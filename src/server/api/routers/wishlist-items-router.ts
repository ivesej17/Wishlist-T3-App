import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

// Define schemas for input validation.
const WishlistItemSchema = z.object({
    id: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    notes: z.string(),
    productLink: z.string(),
    productPrice: z.number(),
    purchased: z.boolean(),
    wishlistID: z.number(),
});

// Create router with procedure definitions.
export const wishlistItemsRouter = createTRPCRouter({
    getAll: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
        return ctx.prisma.wishlistItem.findMany({
            where: { wishlistID: input },
        });
    }),

    update: protectedProcedure.input(WishlistItemSchema).mutation(async ({ ctx, input }) => {
        if (!input.id) {
            const newWishlistItem = await ctx.prisma.wishlistItem.create({ data: input });
            return newWishlistItem;
        }

        const updatedItem = await ctx.prisma.wishlistItem.update({
            data: input,
            where: { id: input.id },
        });

        return updatedItem;
    }),

    delete: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
        await Promise.all([
            ctx.prisma.wishlistItem.delete({
                where: { id: input },
            }),

            ctx.prisma.wishlistItemComment.deleteMany({
                where: { wishlistItemID: input },
            }),

            ctx.prisma.wishlistItemPhoto.deleteMany({
                where: { wishlistItemID: input },
            }),
        ]);
    }),
});
