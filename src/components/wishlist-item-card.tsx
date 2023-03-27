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
import { getSession, GetSessionParams, useSession } from 'next-auth/react';
import { useWishlistOwnerStore } from '../utils/zustand-stores';

const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};

const WishlistItemCard: React.FC<{ wishlistItem: WishlistItem; listOwnerEmail: string | null | undefined }> = (props) => {
    const session = useSession();

    const utils = api.useContext();

    const [imageFiles, setImageFiles] = useState<File[]>([]); // ImageFiles are not used for displaying images, but are used to upload images to S3.

    const [imageURLs, setImageURLs] = useState<string[]>([]); // ImageURLs are used for displaying images, and are passed around to prevent managing object URLs in multiple places.

    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const [editModalIsVisible, setEditModalIsVisible] = useState(false);

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const deleteWishlistItem = api.wishlistItems.delete.useMutation({
        onMutate: (wishlistItemID) => {
            utils.wishlistItems.getAll.setData(props.wishlistItem.wishlistID, (old) => old?.filter((i) => i.id !== wishlistItemID));
        },
    });

    const { refetch: refetchImages, isLoading: imagesLoading } = api.s3.getDownloadURLs.useQuery(props.wishlistItem.id, {
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

    const wishlistItemDelete = () => {
        setDeleteDialogVisible(false);
        displayDangerToast('Wishlist Item Deleted.');
        deleteWishlistItem.mutate(props.wishlistItem.id);
    };

    return (
        <div className="flex w-full items-center justify-center gap-5">
            <div>
                {imageURLs.length > 0 && !imagesLoading && <img className="h-[17rem] w-[17rem] rounded-3xl rounded-bl-3xl object-cover" src={imageURLs[0]} />}
            </div>

            <div className="relative h-[17rem] w-full rounded-3xl rounded-br-3xl border-slate-800 shadow-lg">
                <div className="ml-4 mt-2">
                    <h5 className="w-4/5 text-2xl font-bold tracking-tight text-white">{props.wishlistItem.title}</h5>

                    <p>${props.wishlistItem.productPrice}</p>

                    <p className="mt-2 font-normal text-slate-200">Added on {props.wishlistItem.createdAt.toLocaleDateString()}</p>
                </div>

                <button
                    className="absolute top-0 right-0 mt-2 mr-2 rounded-lg p-3 transition duration-200 ease-in-out hover:bg-slate-400"
                    onClick={() => setDeleteDialogVisible(true)}
                >
                    <div className="flex flex-row gap-2">
                        <FontAwesomeIcon icon={faTrash} style={{ fontSize: 25, color: 'rgb(241 245 249)' }} />
                    </div>
                </button>

                <div className="absolute bottom-0 right-0 mb-3 mr-3">
                    <div className="flex gap-3">
                        {session.data?.user.email === props.listOwnerEmail && (
                            <button
                                onClick={() => setEditModalIsVisible(true)}
                                type="button"
                                className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-indigo-600"
                            >
                                Edit
                            </button>
                        )}

                        <button
                            onClick={() => setDetailsModalVisible(true)}
                            type="button"
                            className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-indigo-600"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            <WishlistItemDetailsModal
                isVisible={detailsModalVisible}
                wishlistItem={props.wishlistItem}
                closeModal={() => setDetailsModalVisible(false)}
                imageURLs={imageURLs}
            />

            <WishlistFormModal
                wishlistID={props.wishlistItem.wishlistID}
                isVisible={editModalIsVisible}
                wishlistItem={props.wishlistItem}
                images={imageFiles}
                closeModal={() => setEditModalIsVisible(false)}
                refetchImages={refetchImages}
            />

            <ConfirmDeletionDialog
                isOpen={deleteDialogVisible}
                closeModal={() => setDeleteDialogVisible(false)}
                confirmDeletion={wishlistItemDelete}
                productName={props.wishlistItem.title}
            />
        </div>
    );
};

export default WishlistItemCard;
