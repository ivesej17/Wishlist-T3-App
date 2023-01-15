import { Wishlist } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

// Define schemas for input validation.
const WishlistItemSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string(),
    notes: z.string(),
    productLink: z.string(),
    productPrice: z.number(),
    purchased: z.boolean(),
    wishlistID: z.number(),
});

// Create router with procedure definitions.
export const wishlistItemsRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.wishlistItem.findMany();
    }),

    create: publicProcedure
        .input(WishlistItemSchema)
        .mutation(({ ctx, input }) => {
            input.id = 0;
            ctx.prisma.wishlistItem.create({ data: { ...input } });
        }),

    update: publicProcedure
        .input(WishlistItemSchema)
        .mutation(({ ctx, input }) => {
            ctx.prisma.wishlistItem.update({
                data: { ...input },
                where: { id: input.id },
            });
        }),
});
