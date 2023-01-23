import { NextPage } from 'next';
import { api } from '../utils/api';
import GlassButton from '../components/glass-button';
import WishlistFormModal from '../components/wishlist-form-modal';
import { useState } from 'react';

const wishlistID = 1;

const WishList: NextPage = () => {
    const wishlistItems = api.wishlistItems.getAll.useQuery(wishlistID);

    const [modalIsVisible, setModalIsVisible] = useState(false);

    return (
        <>
            <main className="min-h-screen overflow-hidden">
                {wishlistItems.data && wishlistItems.data.length === 0 && (
                    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 overflow-hidden">
                        <h1>This wishlist is empty!</h1>

                        <GlassButton buttonText={'Create New Entry'} onClickFunction={() => setModalIsVisible(true)}></GlassButton>
                    </div>
                )};

                <WishlistFormModal isVisible={modalIsVisible} wishlistItem={undefined} onClose={() => setModalIsVisible(false)} />
            </main>
        </>
    );
};

export default WishList;
