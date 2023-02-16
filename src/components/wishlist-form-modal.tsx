import CurrencyInput from 'react-currency-input-field';
import { type WishlistItem } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { getCurrentDateISO } from '../utils/time-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import ButtonInnerLoader from './button-inner-spinner';
import { displayDangerToast, displaySuccessToast } from '../utils/toast-functions';
import { useMutation } from '@tanstack/react-query';
import { type UploadInput, uploadImageToS3 } from '../utils/upload-image';

type FormValues = {
    title: string;
    price: string;
    productLink: string;
    notes: string;
};

const WishlistFormModal: React.FC<{
    wishlistID: number;
    isVisible: boolean;
    wishlistItem: WishlistItem | undefined;
    images: File[];
    closeModal: () => void;
    refetchImages?: () => Promise<unknown>;
}> = (props) => {
    const utils = api.useContext();

    const [infoTabSelected, setInfoTabSelected] = useState(true);
    const [imageURLs, setImageURLs] = useState<readonly string[]>([]);
    const [imageURLsToFiles, setImageURLsToFiles] = useState(new Map<string, File>());
    const [wishlistUploading, setWishlistUploading] = useState(false);

    const updateWishlistItem = api.wishlistItems.update.useMutation();
    const replaceAllExistingImageKeys = api.wishlistItemPhotos.replaceAll.useMutation();
    const gets3UploadCredentials = api.s3.getUploadURL.useMutation();
    const updateWishlist = api.wishlists.updateTimeLastChanged.useMutation();
    const uploadImage = useMutation((uploadInput: UploadInput) => uploadImageToS3(uploadInput));

    const udpateWishlistItemQueryData = (newItem: WishlistItem) => {
        utils.wishlistItems.getAll.setData(props.wishlistID, (old) => {
            if (!old) return old;

            // Case when updating existing item.
            if (props.wishlistItem) return old.map((oldItem) => (oldItem.id === newItem.id ? newItem : oldItem));

            // Case when adding new item.
            return [...old, newItem];
        });
    };

    const { register, handleSubmit, reset, setFocus } = useForm<FormValues>({
        defaultValues: { title: '', price: '', productLink: '', notes: '' },
    });

    useEffect(() => {
        setImageURLs([]);
        setImageURLsToFiles(new Map<string, File>());

        if (props.wishlistItem) {
            reset({
                title: props.wishlistItem.title,
                price: '$' + props.wishlistItem.productPrice.toString(),
                productLink: props.wishlistItem.productLink,
                notes: props.wishlistItem.notes,
            });
        }

        setFocus('title');

        setNewImages(props.images);

        return () => imageURLsToFiles.forEach((value, key) => URL.revokeObjectURL(key));
    }, []);

    const setNewImages = (files: File[]) => {
        for (const file of files) {
            const url = URL.createObjectURL(file);
            setImageURLsToFiles((prev) => new Map([...prev, [url, file]]));
            setImageURLs((prev) => [...prev, url]);
        }
    };

    const removeImage = (imageUrl: string) => {
        imageURLsToFiles.delete(imageUrl);

        setImageURLs((prev) => prev.filter((url) => url !== imageUrl));

        URL.revokeObjectURL(imageUrl);
    };

    const onSubmit = async (data: FormValues) => {
        if (imageURLsToFiles.size === 0 || imageURLs.length === 0) {
            displayDangerToast('Oh no buddy! You forgot to add an image!');
            return;
        }

        setWishlistUploading(true);

        const wishlistItem: WishlistItem | Omit<WishlistItem, 'id'> = {
            id: props.wishlistItem?.id || undefined,
            createdAt: props.wishlistItem?.createdAt || getCurrentDateISO(),
            updatedAt: getCurrentDateISO(),
            notes: data.notes,
            productLink: data.productLink,
            productPrice: parseFloat(data.price.substring(1)),
            purchased: false,
            title: data.title,
            wishlistID: 1,
        };

        try {
            const newWishlistItem = await updateWishlistItem.mutateAsync(wishlistItem);

            await updateWishlist.mutateAsync({ id: newWishlistItem.wishlistID, updatedAt: getCurrentDateISO() });

            const imageKeys: string[] = [];

            for (const file of imageURLsToFiles.values()) {
                const credentials = await gets3UploadCredentials.mutateAsync();

                imageKeys.push(credentials.key);

                await uploadImage.mutateAsync({ url: credentials.url, file });
            }

            await replaceAllExistingImageKeys.mutateAsync({ imageKeys: imageKeys, wishlistItemID: newWishlistItem.id });

            if (props.refetchImages) await props.refetchImages();

            udpateWishlistItemQueryData(newWishlistItem);

            setWishlistUploading(false);
            props.closeModal();
            props.wishlistItem ? displaySuccessToast('Wishlist item updated! 🎉') : displaySuccessToast('Wishlist item added! 🎉');
        } catch (e) {
            setWishlistUploading(false);
            displayDangerToast('Oh no! Something went wrong! 😥 Try saving again.');
            console.log('CAUGHT ERROR:', e);
        }
    };

    if (!props.isVisible) return null;

    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-md">
                <div>
                    <div className="flex flex-row gap-0">
                        <div className={infoTabSelected ? 'tab-focused' : 'tab-unfocused'} onClick={() => setInfoTabSelected(true)}>
                            <p className={infoTabSelected ? 'text-lg font-medium text-slate-800' : 'text-lg text-white'}>Info</p>
                        </div>
                        <div className={infoTabSelected ? 'tab-unfocused' : 'tab-focused'} onClick={() => setInfoTabSelected(false)}>
                            <p className={infoTabSelected ? 'text-lg text-white' : 'text-lg font-medium text-slate-800'}>Images</p>
                        </div>
                    </div>
                    <div className="h-[30rem] rounded-b-lg rounded-tr-lg bg-white p-6 shadow-xl ring-1 ring-gray-900/5 md:w-96 xs:w-80">
                        <form className="relative flex h-full w-full flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className={infoTabSelected ? 'flex flex-col gap-4' : 'hidden'}>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700">Title</label>
                                    <input className="form-input" type="text" {...register('title')} required={true} />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700"> Price </label>
                                    <CurrencyInput
                                        placeholder="$0.00"
                                        prefix="$"
                                        className="form-input"
                                        defaultValue={props.wishlistItem?.productPrice}
                                        {...register('price')}
                                        required={true}
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700"> Product Link </label>
                                    <input className="form-input" type="text" placeholder="website.com/product" {...register('productLink')} required={true} />
                                </div>
                                <div className="w-full">
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700"> Notes </label>
                                    <textarea className="form-input" rows={4} {...register('notes')}></textarea>
                                </div>
                            </div>
                            <div className={infoTabSelected ? 'hidden' : 'absolute inset-0 flex w-full flex-col items-center justify-between'}>
                                <div className="absolute left-0 right-0 grid grid-cols-3 justify-items-center gap-2 overflow-x-auto overflow-y-hidden">
                                    {imageURLs.length > 0 &&
                                        imageURLs.map((url) => {
                                            return (
                                                <div className="relative" key={url}>
                                                    <button type="button" className="absolute top-0 right-0 mt-2 mr-2" onClick={() => removeImage(url)}>
                                                        <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: 20, color: 'white' }} />
                                                    </button>
                                                    <img src={url} className="h-36 rounded-lg object-cover" />
                                                </div>
                                            );
                                        })}
                                </div>
                                <div
                                    className={`bg-grey-lighter flex w-full items-center justify-center ${
                                        imageURLs.length > 0 ? 'absolute bottom-0 mb-3' : ''
                                    }`}
                                >
                                    <label className="text-blue border-blue hover:bg-blue flex w-full cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg transition duration-200 hover:text-pink-400">
                                        <svg className="h-8 w-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                        </svg>
                                        <span className="mt-2 select-none text-base leading-normal">Select Images</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple={true}
                                            onChange={(e) => setNewImages(e.target.files ? [...e.target.files] : [])}
                                        />
                                    </label>
                                </div>
                            </div>
                            {infoTabSelected && (
                                <div className="flex w-full flex-row justify-end gap-3">
                                    <button
                                        className="secondary-button transition duration-200 ease-in-out"
                                        type="button"
                                        onClick={() => props.closeModal()}
                                        disabled={wishlistUploading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="primary-button flex items-center justify-center transition duration-200 ease-in-out"
                                        type="submit"
                                        disabled={wishlistUploading}
                                    >
                                        {wishlistUploading && <ButtonInnerLoader />}
                                        Save
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistFormModal;
