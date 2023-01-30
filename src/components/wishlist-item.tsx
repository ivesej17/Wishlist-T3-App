import { WishlistItem } from '@prisma/client';
import { useState } from 'react';
import { api } from '../utils/api';
import fetchImages from '../utils/fetch-images';

const WishlistItemCard: React.FC<{ wishlistItem: WishlistItem }> = (props) => {
    const [imageURLs, setImageURLs] = useState<string[]>([]);

    // const { isLoading } = api.s3.getImagesForWishlistItem.useQuery(props.wishlistItem.id, {
    //     onSuccess: (images) => setImageURLs(images.map((i) => window.URL.createObjectURL(i))),
    // });

    const { isLoading } = api.wishlistItemPhotos.getImageKeysByWishlistItemID.useQuery(props.wishlistItem.id, {
        onSuccess: async (imageKeys) => {
            const images = await fetchImages(imageKeys);
            setImageURLs(images.map((i) => window.URL.createObjectURL(i)));
        },
    });

    const openInNewTab = (url: string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    if (isLoading) {
        return (
            <div className="card flex items-center justify-center">
                <h3 className="text-slate-600">Loading...</h3>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-slate-600">{props.wishlistItem.title}</h3>
            <p className="text-slate-400">${props.wishlistItem.productPrice}</p>

            {imageURLs.length > 0 && <img src={imageURLs[1]} />}

            <button className="primary-button float-right" onClick={() => openInNewTab(props.wishlistItem.productLink)}>
                Go To Product
            </button>
        </div>
    );
};

export default WishlistItemCard;
