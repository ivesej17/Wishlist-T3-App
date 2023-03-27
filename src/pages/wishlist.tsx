import { InferGetServerSidePropsType, NextPage } from 'next';
import { api } from '../utils/api';
import button from '../components/glass-button';
import WishlistFormModal from '../components/wishlist-form-modal';
import { useEffect, useState } from 'react';
import WishlistItemCard from '../components/wishlist-item-card';
import { useRouter } from 'next/router';
import { getSession, useSession, type GetSessionParams } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlusCircle, faPlusSquare, faWifi } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/loading-spinner';
import Link from 'next/link';
import { useWishlistOwnerStore } from '../utils/zustand-stores';

const WishList: NextPage = () => {
    const session = useSession();

    const wishlistOwnerStore = useWishlistOwnerStore();

    const router = useRouter();

    const wishlistID = parseInt(router.query.wishlistID as string);

    const wishlistName = router.query.wishlistName as string;

    const getWishlist = api.wishlists.getOne.useQuery(wishlistID, {
        onSuccess: (wishlist) => (wishlist ? wishlistOwnerStore.setWishlistOwnerName(wishlist.listOwner) : null),
    });

    const getWishlistItems = api.wishlistItems.getAll.useQuery(wishlistID, {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5,
    });

    const [formModalIsVisible, setFormModalIsVisible] = useState(false);

    return (
        <main className="flex h-screen w-screen flex-col items-center overflow-y-auto overflow-x-hidden">
            <div className="relative mt-3 flex w-11/12 items-center justify-center rounded-xl bg-indigo-900 py-2 xl:w-1/2">
                <Link href="/wishlist-select" className="absolute left-2 no-underline">
                    <button
                        className="flex items-center justify-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-indigo-400"
                        onClick={() => router.back()}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 25, color: 'rgb(241 245 249)' }} />
                    </button>
                </Link>
                <h1 className="select-none text-center text-2xl font-semibold text-slate-50">{getWishlist.data?.name ?? wishlistName}</h1>
                {session.data?.user?.email === getWishlist.data?.listOwnerEmail && (
                    <button
                        className="absolute right-2 flex items-center justify-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-indigo-400"
                        onClick={() => setFormModalIsVisible(true)}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: 25, color: 'rgb(241 245 249)' }} />
                    </button>
                )}
            </div>

            {(getWishlistItems.isLoading || getWishlist.isLoading) && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}

            {(getWishlistItems.error || getWishlist.error) && !getWishlistItems.data && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faWifi} style={{ fontSize: 50, color: 'white' }} />
                    <h1 className="mx-1 select-none text-center text-2xl font-semibold">Looks like there was a connection error! Please try again.</h1>
                </div>
            )}

            {getWishlistItems.data && getWishlist.data && (
                <>
                    {getWishlistItems.data.length === 0 && (
                        <div className="flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden">
                            <h1 className="text-center text-5xl font-bold">This wishlist is empty!</h1>

                            {session.data?.user?.email === getWishlist.data.listOwnerEmail && (
                                <button
                                    onClick={() => setFormModalIsVisible(true)}
                                    className="inline-flex w-[15rem] items-center justify-center rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-indigo-600"
                                >
                                    Create New Entry
                                </button>
                            )}
                        </div>
                    )}

                    {getWishlistItems.data.length > 0 && (
                        <>
                            <div className="mt-5 mb-4 flex w-[95%] flex-col justify-center gap-10 xl:w-1/2">
                                {getWishlistItems.data.map((wishlistItem) => (
                                    <div key={wishlistItem.id}>
                                        <WishlistItemCard wishlistItem={wishlistItem} key={wishlistItem.id} listOwnerEmail={session.data?.user.email} />
                                    </div>
                                ))}
                            </div>

                            {session.data?.user?.email === getWishlist.data.listOwnerEmail && (
                                <button
                                    onClick={() => setFormModalIsVisible(true)}
                                    className="my-5 inline-flex w-1/2 items-center justify-center rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-indigo-600"
                                >
                                    Add New Item
                                </button>
                            )}
                        </>
                    )}

                    <WishlistFormModal
                        wishlistID={wishlistID}
                        isVisible={formModalIsVisible}
                        wishlistItem={undefined}
                        closeModal={() => setFormModalIsVisible(false)}
                        images={[]}
                    />
                </>
            )}
        </main>
    );
};

export default WishList;

export const getServerSideProps = async (context: GetSessionParams | undefined) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};
