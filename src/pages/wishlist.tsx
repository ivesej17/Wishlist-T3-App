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

    const [wishlistItems, setWishlistItems] = useState<readonly WishlistItem[]>([]);

    const { data, error, isLoading } = api.wishlistItems.getAll.useQuery(wishlistID, {
        onSuccess: (data) => setWishlistItems(data),
    });

    const addWishlistItem = (wishlistItem: WishlistItem) => setWishlistItems((prev) => [...prev, wishlistItem]);

    const modifyWishlistItem = (wishlistItem: WishlistItem) => setWishlistItems((prev) => prev.map((w) => (w.id === wishlistItem.id ? wishlistItem : w)));

    const removeWishlistItem = (wishlistItemID: number) => setWishlistItems(wishlistItems.filter((wishlistItem) => wishlistItem.id !== wishlistItemID));

    const [formModalIsVisible, setFormModalIsVisible] = useState(false);

    if (!data || isLoading) return <div>Loading...</div>;

    return (
        <main className="flex h-screen w-screen flex-col items-center overflow-y-auto overflow-x-hidden">
            <div className="bg-[rgba(255, 255, 255, 0.18)] absolute top-0 m-3 flex items-center justify-between rounded-3xl shadow-2xl md:w-10/12 xl:w-1/2 xs:w-[95%]">
                <button className="rounded-full p-3 transition duration-150 ease-in-out hover:bg-pink-300" onClick={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 25, color: 'white' }} className="text-pink-400" />
                </button>
                <h1 className="text-center text-2xl font-semibold text-slate-50">{wishlistName}</h1>
                <button className="rounded-full p-3 transition duration-150 ease-in-out hover:bg-pink-300" onClick={() => setFormModalIsVisible(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: 25, color: 'white' }} />
                </button>
            </div>

            {data.length === 0 && (
                <div className="flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden">
                    <h1 className="text-5xl font-bold">This wishlist is empty!</h1>

                    <GlassButton buttonText={'Create New Entry'} onClickFunction={() => setFormModalIsVisible(true)}></GlassButton>
                </div>
            )}

            {data.length > 0 && (
                <div className="mt-20 grid w-[98%] justify-center justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1">
                    {wishlistItems.map((wishlistItem) => (
                        <div key={wishlistItem.id}>
                            <WishlistItemCard wishlistItem={wishlistItem} removeWishlistItem={() => removeWishlistItem} key={wishlistItem.id} />
                        </div>
                    ))}
                </div>
            )}

            <WishlistFormModal isVisible={formModalIsVisible} wishlistItem={undefined} closeModal={() => setFormModalIsVisible(false)} images={[]} addWishlistItem={() => addWishlistItem} />
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
