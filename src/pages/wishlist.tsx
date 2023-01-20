import { NextPage } from 'next';
import { api } from '../utils/api';
import MotionButton from '../components/motion-button';

const wishlistID = 1;

const WishList: NextPage = () => {
    const wishlistItems = api.wishlistItems.getAll.useQuery(wishlistID);

    return (
        <>
            <main className="min-h-screen overflow-hidden">
                {wishlistItems.data && wishlistItems.data.length === 0 && (
                    <div className="flex h-screen w-full flex-col items-center justify-center gap-5">
                        <h1>This wishlist is empty!</h1>

                        <MotionButton buttonText={'Create New Entry'}></MotionButton>
                    </div>
                )}
            </main>
        </>
    );
};

export default WishList;
