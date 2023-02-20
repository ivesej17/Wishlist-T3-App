import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WishlistOwnerStore = {
    wishlistOwnerName: string;
    setWishlistOwnerName: (wishlistOwnerName: string) => void;
};

export const useWishlistOwnerStore = create<WishlistOwnerStore>()(
    persist(
        (set) => ({
            wishlistOwnerName: '',
            setWishlistOwnerName: (wishlistOwnerName: string) => set({ wishlistOwnerName }),
        }),
        { name: 'ownerOfSelectedWishlist', getStorage: () => localStorage }
    )
);
