import { NextPage } from 'next';
import { api } from '../utils/api';
import GlassButton from '../components/glass-button';
import WishlistFormModal from '../components/wishlist-form-modal';
import { useState } from 'react';
import WishlistItemCard from '../components/wishlist-item';
import { useRouter } from 'next/router';
import { WishlistItem } from '@prisma/client';
import WishlistItemDetails from '../components/wishlist-item-details';

const WishList: NextPage = () => {
    const router = useRouter();

    const wishlistID = 1;

    const { data, error, isLoading } = api.wishlistItems.getAll.useQuery(wishlistID);

    const [formModalIsVisible, setFormModalIsVisible] = useState(false);

    const [selectedWishlistItem, setSelectedWishlistItem] = useState<WishlistItem | undefined>(undefined);

    const [wishlistItemDetailsIsVisible, setWishlistItemDetailsIsVisible] = useState(false);

    const openWishlistItemDetails = (wishlistItem: WishlistItem) => {
        setSelectedWishlistItem(wishlistItem);
        setWishlistItemDetailsIsVisible(true);
    };

    if (!data || isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <main className="min-h-screen overflow-hidden">
                {data.length === 0 && (
                    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 overflow-hidden">
                        <h1>This wishlist is empty!</h1>

                        <GlassButton buttonText={'Create New Entry'} onClickFunction={() => setFormModalIsVisible(true)}></GlassButton>
                    </div>
                )}

                {data.length > 0 &&
                    data.map((wishlistItem) => (
                        <div className="grid-cols-3 gap-4">
                            <div className="h-full w-full" onClick={() => openWishlistItemDetails(wishlistItem)}>
                                <WishlistItemCard wishlistItem={wishlistItem} key={wishlistItem.id} />
                            </div>
                        </div>
                    ))}

                <WishlistItemDetails wishlistItem={selectedWishlistItem} isVisible={wishlistItemDetailsIsVisible} />

                <WishlistFormModal isVisible={formModalIsVisible} wishlistItem={undefined} onClose={() => setFormModalIsVisible(false)} images={undefined} />
            </main>
        </>
    );
};

export default WishList;
