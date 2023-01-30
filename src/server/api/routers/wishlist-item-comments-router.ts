import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

// Define schemas for input validation.
const WishlistItemCommentSchema = z.object({
    id: z.number(),
    wishlistItemID: z.number(),
    updatedAt: z.date(),
    createdAt: z.date(),
    comment: z.string(),
    byUser: z.string(),
});

// Create router with procedure definitions.
export const wishlistItemCommentsRouter = createTRPCRouter({
    get: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        return await ctx.prisma.wishlistItemComment.findMany({
            where: { wishlistItemID: input },
        });
    }),

    create: publicProcedure.input(WishlistItemCommentSchema.omit({ id: true })).mutation(async ({ ctx, input }) => {
        const newComment = await ctx.prisma.wishlistItemComment.create({ data: input });
        return newComment;
    }),

    delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
        await ctx.prisma.wishlistItemComment.delete({
            where: {
                id: input,
            },
        });
    }),
});
