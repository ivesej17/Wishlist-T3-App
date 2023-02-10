import { WishlistItem } from '@prisma/client';
import { Fragment, useEffect, useState } from 'react';
import { api } from '../utils/api';
import fetchImages from '../utils/fetch-images';
import { faEllipsisH, faPencil, faRectangleList, faTrash, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import WishlistItemDetailsModal from './wishlist-item-details-modal';
import WishlistFormModal from './wishlist-form-modal';
import ConfirmDeletionDialog from './confirm-deletion-dialog';
import LoadingSpinner from './loading-spinner';
import { displayDangerToast } from '../utils/toast-functions';

const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};

const WishlistItemCard: React.FC<{ wishlistItem: WishlistItem; removeWishlistItem: () => void; modifyWishlistItem: () => void }> = (props) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]); // ImageFiles are not used for displaying images, but are used to upload images to S3.

    const [imageURLs, setImageURLs] = useState<string[]>([]); // ImageURLs are used for displaying images, and are passed around to prevent managing object URLs in multiple places.

    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const [editModalIsVisible, setEditModalIsVisible] = useState(false);

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const deleteWishlistItem = api.wishlistItems.delete.useMutation();

    const { isLoading } = api.s3.getDownloadURLs.useQuery(props.wishlistItem.id, {
        onSuccess: async (downloadURLs) => {
            const images = await fetchImages(downloadURLs);
            setImageFiles(images);
            setImageURLs(images.map((i) => window.URL.createObjectURL(i)));
        },
    });

    useEffect(() => {
        return () => {
            imageURLs.forEach((url) => {
                window.URL.revokeObjectURL(url);
            });
        };
    }, []);

    const wishlistItemDelete = async () => {
        await deleteWishlistItem.mutateAsync(props.wishlistItem.id);
        props.removeWishlistItem();
        setDeleteDialogVisible(false);
        displayDangerToast('Wishlist Item Deleted.');
    };

    return (
        <div className="bg-[rgba(255, 255, 255)] rounded-2xl shadow-lg">
            {(imageURLs.length > 0 && !isLoading && <img className="h-[20rem] w-full rounded-t-lg object-cover" src={imageURLs[0]} />) || (
                <div className="flex h-[20rem] w-full items-center justify-center rounded-t-lg bg-slate-50">
                    <LoadingSpinner />
                </div>
            )}

            <Menu as="div" className="relative mt-2 mr-3 p-0">
                <Menu.Button>
                    <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: 25, color: 'white' }} className="absolute top-0 right-0 cursor-pointer" />
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Menu.Items className="absolute right-0 z-10 -translate-y-[calc(100%+25px)] rounded-2xl bg-white p-3 shadow-xl">
                        <div className="flex flex-col items-start gap-1">
                            <Menu.Item>
                                <button
                                    className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-neutral-200"
                                    onClick={() => setDetailsModalVisible(true)}
                                >
                                    <div className="flex flex-row gap-2">
                                        <FontAwesomeIcon icon={faRectangleList} style={{ fontSize: 25, color: 'rgb(82 82 82)' }} />
                                        <p className="font-semibold text-neutral-700">See Details</p>
                                    </div>
                                </button>
                            </Menu.Item>

                            <Menu.Item>
                                <button
                                    className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-neutral-200"
                                    onClick={() => openInNewTab(props.wishlistItem.productLink)}
                                >
                                    <div className="flex flex-row gap-2">
                                        <FontAwesomeIcon icon={faUpRightFromSquare} style={{ fontSize: 25, color: 'rgb(82 82 82)' }} />
                                        <p className="font-semibold text-neutral-700">Go To Product</p>
                                    </div>
                                </button>
                            </Menu.Item>

                            <Menu.Item>
                                <button
                                    className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-neutral-200"
                                    onClick={() => setEditModalIsVisible(true)}
                                >
                                    <div className="flex flex-row gap-2">
                                        <FontAwesomeIcon icon={faPencil} style={{ fontSize: 25, color: 'rgb(82 82 82)' }} />
                                        <p className="font-semibold text-neutral-700">Edit</p>
                                    </div>
                                </button>
                            </Menu.Item>

                            <Menu.Item>
                                <button
                                    className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-red-100"
                                    onClick={() => setDeleteDialogVisible(true)}
                                >
                                    <div className="flex flex-row gap-2">
                                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: 25, color: 'rgb(239 68 68)' }} />
                                        <p className="font-semibold text-red-500">Delete</p>
                                    </div>
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            <WishlistItemDetailsModal
                isVisible={detailsModalVisible}
                wishlistItem={props.wishlistItem}
                closeModal={() => setDetailsModalVisible(false)}
                imageURLs={imageURLs}
            />

            <WishlistFormModal
                isVisible={editModalIsVisible}
                wishlistItem={props.wishlistItem}
                images={imageFiles}
                closeModal={() => setEditModalIsVisible(false)}
                modifyWishlistItem={() => props.modifyWishlistItem}
            />

            <ConfirmDeletionDialog
                isOpen={deleteDialogVisible}
                closeModal={() => setDeleteDialogVisible(false)}
                confirmDeletion={wishlistItemDelete}
                productName={props.wishlistItem.title}
            />

            <div className="px-5 pb-5">
                <h5 className="text-2xl font-bold tracking-tight text-white md:mb-2 lg:m-0 xs:mb-3">
                    {props.wishlistItem.title} - ${props.wishlistItem.productPrice}
                </h5>
                <p className="mb-0 mt-3 font-normal text-slate-200">Added on {props.wishlistItem.createdAt.toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default WishlistItemCard;
