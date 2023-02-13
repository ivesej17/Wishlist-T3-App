import { NextPage } from 'next';
import { api } from '../utils/api';
import GlassButton from '../components/glass-button';
import WishlistFormModal from '../components/wishlist-form-modal';
import { useState } from 'react';
import WishlistItemCard from '../components/wishlist-item-card';
import { useRouter } from 'next/router';
import { WishlistItem } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const WishList: NextPage = () => {
    const router = useRouter();

    const wishlistID = parseInt(router.query.wishlistID as string);

    const wishlistName = router.query.wishlistName as string;

    const getWishlistItems = api.wishlistItems.getAll.useQuery(wishlistID, {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5,
    });

    const [formModalIsVisible, setFormModalIsVisible] = useState(false);

    if (!getWishlistItems.data || getWishlistItems.isLoading) return <div>Loading...</div>;

    return (
        <main className="flex h-screen w-screen flex-col items-center overflow-y-auto overflow-x-hidden">
            <div className="absolute top-0 m-3 flex items-center justify-between rounded-3xl bg-slate-800 shadow-2xl md:w-10/12 xl:w-1/2 xs:w-[95%]">
                <button className="rounded-full p-3 transition duration-150 ease-in-out hover:bg-pink-100" onClick={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 25, color: 'rgb(249 168 212)' }} />
                </button>
                <h1 className="text-center text-2xl font-semibold text-slate-50">{wishlistName}</h1>
                <button className="rounded-full p-3 transition duration-150 ease-in-out hover:bg-pink-100" onClick={() => setFormModalIsVisible(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: 25, color: 'rgb(249 168 212)' }} />
                </button>
            </div>

            {getWishlistItems.data.length === 0 && (
                <div className="flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden">
                    <h1 className="text-5xl font-bold">This wishlist is empty!</h1>

                    <GlassButton buttonText={'Create New Entry'} onClickFunction={() => setFormModalIsVisible(true)}></GlassButton>
                </div>
            )}

            {getWishlistItems.data.length > 0 && (
                <div className="mt-20 mb-4 grid w-[98%] items-stretch justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1">
                    {getWishlistItems.data.map((wishlistItem) => (
                        <div key={wishlistItem.id} className="md:w-[48vw] xl:w-[30vw] xs:w-[98vw]">
                            <WishlistItemCard wishlistItem={wishlistItem} key={wishlistItem.id} />
                        </div>
                    ))}
                </div>
            )}

            <WishlistFormModal
                wishlistID={wishlistID}
                isVisible={formModalIsVisible}
                wishlistItem={undefined}
                closeModal={() => setFormModalIsVisible(false)}
                images={[]}
            />
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
