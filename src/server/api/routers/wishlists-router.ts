import { Wishlist } from '@prisma/client';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

// Define schemas for input validation.
const WishlistSchema = z.object({
    id: z.number(),
    updatedAt: z.string(),
    name: z.string(),
    listOwner: z.string(),
});

// Create router with procedure definitions.
export const wishlistsRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.wishlist.findMany();
    }),

    create: publicProcedure.input(WishlistSchema).mutation(({ ctx, input }) => {
        input.id = 0;
        ctx.prisma.wishlist.create({ data: { ...input } });
    }),
});
