import { WishlistItem } from "@prisma/client";

export type WishlistItemDTO = {
    id: number | undefined;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    notes: string;
    productLink: string;
    productPrice: number;
    purchased: boolean;
    wishlistID: number;
}