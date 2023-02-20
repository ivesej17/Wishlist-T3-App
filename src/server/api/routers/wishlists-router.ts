import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

// Define schemas for input validation.
const WishlistSchema = z.object({
    id: z.number(),
    updatedAt: z.string(),
    name: z.string(),
    listOwner: z.string(),
    listOwnerEmail: z.string(),
});

// Create router with procedure definitions.
export const wishlistsRouter = createTRPCRouter({
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.wishlist.findMany();
    }),

    getOne: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
        return await ctx.prisma.wishlist.findUnique({
            where: { id: input },
        });
    }),

    create: protectedProcedure.input(WishlistSchema).mutation(async ({ ctx, input }) => {
        input.id = 0;
        await ctx.prisma.wishlist.create({ data: { ...input } });
    }),

    updateTimeLastChanged: protectedProcedure.input(z.object({ id: z.number(), updatedAt: z.date() })).mutation(async ({ ctx, input }) => {
        await ctx.prisma.wishlist.update({
            where: { id: input.id },
            data: { updatedAt: input.updatedAt },
        });
    }),
});
