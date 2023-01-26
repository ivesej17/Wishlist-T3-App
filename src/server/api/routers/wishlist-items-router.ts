import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

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
    getAll: publicProcedure.input(z.number()).query(({ ctx, input }) => {
        return ctx.prisma.wishlistItem.findMany({
            where: { wishlistID: input },
        });
    }),

    update: publicProcedure.input(WishlistItemSchema).mutation(async ({ ctx, input }) => {
        if (!input.id) {
            await ctx.prisma.wishlistItem.create({ data: input });
            return;
        }

        await ctx.prisma.wishlistItem.update({
            data: input,
            where: { id: input.id },
        });
    }),
});
