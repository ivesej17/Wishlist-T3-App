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

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    const { data, error, isLoading } = api.wishlistItems.getAll.useQuery(wishlistID, {
        onSuccess: (data) => setWishlistItems(data),
    });

    const removeWishlistItem = (wishlistItemID: number) => setWishlistItems(wishlistItems.filter((wishlistItem) => wishlistItem.id !== wishlistItemID));

    const [formModalIsVisible, setFormModalIsVisible] = useState(false);

    // const confirmCreationOrUpdate = (message: string) => displaySuccessToast('Wishlist item created successfully!');

    // const confirmDeletion = () => displayDangerToast('Wishlist item deleted successfully!');

    if (!data || isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <main className="flex h-screen w-screen flex-col items-center overflow-y-auto overflow-x-hidden">
            <div className="absolute top-0 m-3 flex items-center justify-between rounded-3xl bg-white p-3 shadow-md md:w-10/12 xl:w-1/2 xs:w-[95%]">
                <button className='hover:bg-pink-100 transition ease-in-out duration-150 rounded-full'>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 25, color: 'rgb(244 114 182)' }} className="text-pink-400" />
                </button>
                <h1 className="text-center text-2xl font-semibold text-slate-700">{wishlistName}</h1>
                <button className="flex gap-3" onClick={() => setFormModalIsVisible(true)}>
                    <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: 25, color: 'rgb(244 114 182)' }} />
                </button>
            </div>

            {data.length === 0 && (
                <div className="flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden">
                    <h1 className="text-5xl font-bold">This wishlist is empty!</h1>

                    <GlassButton buttonText={'Create New Entry'} onClickFunction={() => setFormModalIsVisible(true)}></GlassButton>
                </div>
            )}

            {data.length > 0 && (
                <div className="mx-5 grid w-[98%] justify-center justify-items-center gap-5 md:my-5 md:grid-cols-2 lg:my-10 lg:mx-16 xl:grid-cols-3 xs:my-5 xs:grid-cols-1">
                    {wishlistItems.map((wishlistItem) => (
                        <div key={wishlistItem.id}>
                            <WishlistItemCard wishlistItem={wishlistItem} removeWishlistItem={() => removeWishlistItem} key={wishlistItem.id} />
                        </div>
                    ))}
                </div>
            )}

            <WishlistFormModal isVisible={formModalIsVisible} wishlistItem={undefined} closeModal={() => setFormModalIsVisible(false)} images={[]} />
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
