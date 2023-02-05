import { Wishlist } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

// Define schemas for input validation.
const WishlistSchema = z.object({
    id: z.number(),
    updatedAt: z.string(),
    name: z.string(),
    listOwner: z.string(),
});

// Create router with procedure definitions.
export const wishlistsRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.wishlist.findMany();
    }),

    create: protectedProcedure.input(WishlistSchema).mutation(({ ctx, input }) => {
        input.id = 0;
        ctx.prisma.wishlist.create({ data: { ...input } });
    }),

    updateTimeLastChanged: protectedProcedure.input(z.object({ id: z.number(), updatedAt: z.date() })).mutation(({ ctx, input }) => {
        ctx.prisma.wishlist.update({
            where: { id: input.id },
            data: { updatedAt: input.updatedAt },
        });
    }),
});
