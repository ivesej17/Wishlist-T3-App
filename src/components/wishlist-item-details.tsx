import { WishlistItem } from '@prisma/client';

const WishlistItemDetails: React.FC<{ wishlistItem: WishlistItem | undefined; isVisible: boolean }> = (props) => {
    if (!props.isVisible || !props.wishlistItem) return null;

    return <div></div>;
};

export default WishlistItemDetails;
