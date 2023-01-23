import { WishlistItem } from '@prisma/client';
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';

type FormValues = {
    title: string;
    price: number;
    productLink: string;
    notes: string;
};

const WishlistForm: React.FC<{ wishlistItem: WishlistItem | undefined }> = (props) => {
    const [infoTabSelected, setInfoTabSelected] = useState(true);

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: unknown) => {
        // const formValues = data as FormValues;

        // const wishlistItem: WishlistItem = {
        //     id: 0,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //     notes: formValues.notes,
        //     productLink: formValues.productLink,
        //     productPrice: formValues.price,
        //     purchased: false,
        //     title: formValues.title,
        //     wishlistID: 1,
        // };

        // api.wishlistItems.create.useMutation().mutate(wishlistItem);

        console.log('submit fired');

        const fileUpload = document.getElementById('files') as HTMLInputElement;

        const image = fileUpload.files?.item(0);

        // if (image && url.data) {
        //     fetch(url.data, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'image/png',
        //         },
        //         body: image,
        //     })
        //         .then((res) => console.log(res))
        //         .catch((err) => console.log(err));
        // }
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <div>
                <div className="flex flex-row gap-0">
                    <div className={infoTabSelected ? 'tab-focused' : 'tab-unfocused'} onClick={() => setInfoTabSelected(true)}>
                        <p className={infoTabSelected ? 'font-medium text-slate-800' : 'text-white'}>Info</p>
                    </div>
                    <div className={infoTabSelected ? 'tab-unfocused' : 'tab-focused'} onClick={() => setInfoTabSelected(false)}>
                        <p className={infoTabSelected ? 'text-white' : 'font-medium text-slate-800'}>Images</p>
                    </div>
                </div>

                <div className="height-28-rem rounded-b-lg rounded-tr-lg bg-white p-6 shadow-xl ring-1 ring-gray-900/5 md:w-80">
                    <form className="relative flex w-full flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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

                        <div className={infoTabSelected ? 'hidden' : ''}>
                            <div className="bg-grey-lighter flex w-full items-center justify-center">
                                <label className="text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg hover:text-blue-600">
                                    <svg className="h-8 w-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                    </svg>
                                    <span className="mt-2 text-base leading-normal">Select Images</span>
                                    <input type="file" className="hidden" multiple={true} {...register('files')} />
                                </label>
                            </div>
                        </div>

                        <div className="flex w-full flex-row justify-end gap-3">
                            <button className="secondary-button" type="button">
                                Cancel
                            </button>
                            <button className="primary-button" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WishlistForm;
