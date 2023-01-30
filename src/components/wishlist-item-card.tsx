import { WishlistItem } from '@prisma/client';
import { Fragment, useState } from 'react';
import { api } from '../utils/api';
import fetchImages from '../utils/fetch-images';
import { faEllipsisH, faPencil, faRectangleList, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Transition } from '@headlessui/react';
import WishlistItemDetailsModal from './wishlist-item-details-modal';
import WishlistFormModal from './wishlist-form-modal';

const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};

const WishlistItemCard: React.FC<{ wishlistItem: WishlistItem }> = (props) => {
    const [imageURLs, setImageURLs] = useState<string[]>([]);

    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const [editModalIsVisible, setEditModalIsVisible] = useState(false);

    const { isLoading } = api.wishlistItemPhotos.getImageKeysByWishlistItemID.useQuery(props.wishlistItem.id, {
        onSuccess: async (imageKeys) => {
            const images = await fetchImages(imageKeys);
            setImageURLs(images.map((i) => window.URL.createObjectURL(i)));
        },
    });

    return (
        <div className="bg-[rgba(255, 255, 255)] rounded-2xl shadow-lg">
            {imageURLs.length > 0 && <img className="h-[20rem] w-full rounded-t-lg object-cover" src={imageURLs[0]} />}

            <Popover className="relative mt-2 mr-3 p-0">
                <Popover.Button>
                    <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: 25, color: 'white' }} className="absolute top-0 right-0 cursor-pointer" />
                </Popover.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute right-0 z-10 rounded-2xl bg-white p-3">
                        <div className="flex flex-col items-start gap-1">
                            <button
                                className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-neutral-200"
                                onClick={() => setDetailsModalVisible(true)}
                            >
                                <div className="flex flex-row gap-2">
                                    <FontAwesomeIcon icon={faRectangleList} style={{ fontSize: 25, color: 'black' }} />
                                    <p className="font-semibold text-slate-900">See Details</p>
                                </div>
                            </button>

                            <button
                                className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-neutral-200"
                                onClick={() => setEditModalIsVisible(true)}
                            >
                                <div className="flex flex-row gap-2">
                                    <FontAwesomeIcon icon={faPencil} style={{ fontSize: 25, color: 'black' }} />
                                    <p className="font-semibold text-slate-900">Edit</p>
                                </div>
                            </button>

                            <button className="w-full rounded-lg p-3 transition duration-200 ease-in-out hover:bg-red-100">
                                <div className="flex flex-row gap-2">
                                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: 25, color: 'red' }} />
                                    <p className="font-semibold text-red-600">Delete</p>
                                </div>
                            </button>
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>

            <WishlistItemDetailsModal
                isVisible={detailsModalVisible}
                wishlistItem={props.wishlistItem}
                closeModal={() => setDetailsModalVisible(false)}
                imageURLs={imageURLs}
            />

            <WishlistFormModal
                isVisible={editModalIsVisible}
                wishlistItem={props.wishlistItem}
                images={[] as Blob[]}
                closeModal={() => setEditModalIsVisible(false)}
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
