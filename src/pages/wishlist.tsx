import { NextPage } from 'next';
import { api } from '../utils/api';
import GlassButton from '../components/glass-button';
import WishlistFormModal from '../components/wishlist-form-modal';
import { useState } from 'react';
import WishlistItemCard from '../components/wishlist-item-card';
import { useRouter } from 'next/router';
import { WishlistItem } from '@prisma/client';

// export const getServerSideProps = async () => {
//     return {
//         props: {
//             wishlistID:
//         },
//     };
// }

const WishList: NextPage = () => {
    const router = useRouter();

    const wishlistID = parseInt(router.query.wishlistID as string);

    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    const { data, error, isLoading } = api.wishlistItems.getAll.useQuery(wishlistID, {
        onSuccess: (data) => {
            setWishlistItems(data);
        },
    });

    const removeWishlistItem = (wishlistItemID: number) => setWishlistItems(wishlistItems.filter((wishlistItem) => wishlistItem.id !== wishlistItemID));

    const [formModalIsVisible, setFormModalIsVisible] = useState(false);

    if (!data || isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <main className="align-center min-w-screen flex min-h-screen justify-center overflow-auto">
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

            <WishlistFormModal isVisible={formModalIsVisible} wishlistItem={undefined} closeModal={() => setFormModalIsVisible(false)} images={undefined} />
        </main>
    );
};

export default WishList;
