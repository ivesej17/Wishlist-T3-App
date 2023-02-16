import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { WishlistItem } from '@prisma/client';
import { Fragment } from 'react';
import WishlsitItemComments from './wishlist-item-comments';

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
                                <button className="absolute top-0 right-0 m-3 flex items-center justify-center" onClick={() => props.closeModal()}>
                                    <FontAwesomeIcon icon={faCircleXmark} style={{ fontSize: 18, color: 'rgb(244 114 182)' }} />
                                </button>

                                <Dialog.Title as="h3" className="mt-3 text-lg font-medium leading-6 text-gray-900">
                                    {props.wishlistItem.title}
                                </Dialog.Title>

                                <p className="text-slate-500">${props.wishlistItem.productPrice}</p>

                                <div className={`mt-4 grid justify-items-center gap-5 ${props.imageURLs.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    {props.imageURLs.map((url) => {
                                        return (
                                            <img
                                                className={`h-64 rounded-lg object-cover ${props.imageURLs.length > 1 ? 'w-64' : 'w-full'}`}
                                                src={url}
                                                key={url}
                                            ></img>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-5">
                                    <p className="font-semibold text-slate-900">Notes</p>
                                    <hr className="mt-1 mb-3 w-12 border-slate-900"></hr>
                                    <p className="font-thin text-slate-900">{props.wishlistItem.notes}</p>
                                </div>

                                <WishlsitItemComments wishlistItemID={props.wishlistItem.id} />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default WishlistItemDetailsModal;
