import CurrencyInput from 'react-currency-input-field';
import { WishlistItem, WishlistItemPhoto } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { fileListToBlobArray } from '../utils/convert-filelist';
import { api } from '../utils/api';
import { getCurrentDateISO } from '../utils/time-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type FormValues = {
    title: string;
    price: string;
    productLink: string;
    notes: string;
};

const getArrayOfMapKeys = (map: Map<string, File>) => {
    const keys: string[] = [];
    map.forEach((value, key) => keys.push(key));
    return keys;
};

// prettier-ignore
const WishlistFormModal: React.FC<{ isVisible: boolean; wishlistItem: WishlistItem | undefined; images: File[]; closeModal: () => void }> = (props) => {
    if (!props.isVisible) return null;

    const [infoTabSelected, setInfoTabSelected] = useState(true);
    const [imageURLsToFiles, setImageURLsToFiles] = useState(new Map<string, File>());

    const updateWishlistItem = api.wishlistItems.update.useMutation();
    const storeImageKey = api.wishlistItemPhotos.create.useMutation();
    const gets3UploadCredentials = api.s3.getUploadURL.useMutation();
    const updateWishlist = api.wishlists.updateTimeLastChanged.useMutation();

    useEffect(() => {
        setNewImages(props.images);
    }, []);

    const setNewImages = (files: File[]) => {
        imageURLsToFiles.forEach((value, key) => URL.revokeObjectURL(key));
        setImageURLsToFiles(new Map<string, File>());

        files.forEach((file) => {
            const url = URL.createObjectURL(file);

            setImageURLsToFiles(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(url, file);
                return newMap;
            });

            imageURLsToFiles.set(url, file);
        });
    }

    const removeImage = (imageUrl: string) => {
        URL.revokeObjectURL(imageUrl);

        setImageURLsToFiles(prevMap => {
            const newMap = new Map(prevMap);
            newMap.delete(imageUrl);
            return newMap;
        });
    }

    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: 
        props.wishlistItem 
        ? { title: props.wishlistItem.title, price: '$' + props.wishlistItem.productPrice.toString(), productLink: props.wishlistItem.productLink, notes: props.wishlistItem.notes } 
        : { title: '', price: '', productLink: '', notes: '' },
    });

    const onSubmit = async (data: FormValues) => {
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

        const createdWishlistItem = await updateWishlistItem.mutateAsync(wishlistItem);

        await updateWishlist.mutateAsync({id: 1, updatedAt: getCurrentDateISO()});

        if (imageURLsToFiles.size === 0) {
            props.closeModal();
            return;
        }

        const imageKeys: string[] = [];

        for (const file of imageURLsToFiles.values()) {
            const credentials = await gets3UploadCredentials.mutateAsync();

            imageKeys.push(credentials.key);

            await fetch(credentials.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/png',
                },
                body: file,
            });
        }

        for (const key of imageKeys) {
            const wishlistItemPhoto: Omit<WishlistItemPhoto, 'id'> = {
                imageKey: key,
                wishlistItemID: createdWishlistItem.id,
            };

            await storeImageKey.mutateAsync(wishlistItemPhoto);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-md">
            <div>
                <div className="flex flex-row gap-0">
                    <div className={infoTabSelected ? 'tab-focused' : 'tab-unfocused'} onClick={() => setInfoTabSelected(true)}>
                        <p className={infoTabSelected ? 'font-medium text-slate-800 text-lg' : 'text-white text-lg'}>Info</p>
                    </div>
                    <div className={infoTabSelected ? 'tab-unfocused' : 'tab-focused'} onClick={() => setInfoTabSelected(false)}>
                        <p className={infoTabSelected ? 'text-white text-lg' : 'font-medium text-slate-800 text-lg'}>Images</p>
                    </div>
                </div>

                <div className="h-[30rem] rounded-b-lg rounded-tr-lg bg-white p-6 shadow-xl ring-1 ring-gray-900/5 md:w-96 xs:w-80">
                    {/* {infoTabSelected && <p className='text-neutral-800 text-lg font-semibold mt-0 mb-4'>{props.wishlistItem ? 'Editing Existing Item' : 'Adding New Item'}</p>} */}
                    
                    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className={infoTabSelected ? 'flex flex-col gap-4' : 'hidden'}>
                            <div className="w-full">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700">Title</label>
                                <input className="form-input" type="text" {...register('title')} />
                            </div>

                            <div className="w-full">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700"> Price </label>
                                <CurrencyInput placeholder="$0.00" prefix="$" className="form-input" {...register('price')} />
                            </div>

                            <div className="w-full">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700"> Product Link </label>
                                <input className="form-input" type="text" placeholder="website.com/product" {...register('productLink')} />
                            </div>

                            <div className="w-full">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-700"> Notes </label>
                                <textarea className="form-input" rows={4} {...register('notes')}></textarea>
                            </div>
                        </div>

                        <div className={infoTabSelected ? 'hidden' : 'flex w-full flex-col items-center justify-center'}>
                            <div className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden">
                                {
                                    imageURLsToFiles.keys.length > 0 &&
                                    getArrayOfMapKeys(imageURLsToFiles).map(url => {
                                        return(
                                            <div className=" relative h-full w-full">
                                                <button className="absolute top-0 right-0 bg-red-500 flex items-center justify-center" onClick={() => imageURLsToFiles.delete(url)}>
                                                    <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: 25, color: 'white' }} />
                                                </button>
                                                <img src={url} className="h-72 w-full rounded-lg" />;
                                            </div>
                                        )
                                    })}
                            </div>

                            <div className="bg-grey-lighter flex w-full items-center justify-center">
                                <label className="text-blue border-blue hover:bg-blue flex w-full cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg transition duration-200 hover:text-pink-400">
                                    <svg className="h-8 w-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    <span className="mt-2 text-base leading-normal select-none">Select Images</span>
                                    <input type="file" className="hidden" multiple={true} onChange={(e) => setNewImages(e.target.files ? [...e.target.files] : [])} />
                                </label>
                            </div>
                        </div>

                        {infoTabSelected && (
                            <div className="flex w-full flex-row justify-end gap-3">
                                <button className="secondary-button transition duration-200 ease-in-out" type="button" onClick={() => props.closeModal()}>
                                    Cancel
                                </button>
                                <button className="primary-button transition duration-200 ease-in-out" type="submit">
                                    Save
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WishlistFormModal;
