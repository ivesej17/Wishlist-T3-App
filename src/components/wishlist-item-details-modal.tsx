import { Dialog, Transition } from '@headlessui/react';
import { WishlistItem } from '@prisma/client';
import { Fragment, useState } from 'react';
import WishlsitItemComments from './wishlist-item-comments';

const openInNewTab = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

const WishlistItemDetailsModal: React.FC<{ isVisible: boolean; wishlistItem: WishlistItem; closeModal: () => void; imageURLs: string[] }> = (props) => {
    if (!props.isVisible) return null;

    return (
        <Transition appear as={Fragment} show={props.isVisible}>
            <Dialog as="div" className="relative z-10" onClose={() => props.closeModal()}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 w-screen overflow-y-auto">
                    <div className="flex items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="max-w-7xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    {props.wishlistItem.title}
                                </Dialog.Title>

                                <p className="text-slate-500">${props.wishlistItem.productPrice}</p>

                                <div className="mt-4 grid grid-cols-2 justify-items-center gap-5">
                                    {props.imageURLs.map((url) => {
                                        return <img className="h-64 w-64 rounded-lg object-cover" src={url} key={url}></img>;
                                    })}
                                </div>

                                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-5">
                                    <p className="font-semibold text-slate-900">Notes</p>
                                    <hr className="mt-1 mb-3 w-12 border-slate-900"></hr>
                                    <p className="font-thin text-slate-900">{props.wishlistItem.notes}</p>
                                </div>

                                <WishlsitItemComments wishlistItemID={props.wishlistItem.id} />

                                {/* <div className="float-right mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-pink-300 px-4 py-2 text-sm font-medium text-white hover:bg-pink-400 focus:outline-none focus-visible:ring-2"
                                        onClick={() => openInNewTab(props.wishlistItem.productLink)}
                                    >
                                        View Product
                                    </button>
                                </div> */}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default WishlistItemDetailsModal;
