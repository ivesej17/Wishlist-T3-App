import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

// Create router with procedure definitions.
export const wishlistItemPhotosRouter = createTRPCRouter({
    getImageKeysByWishlistItemID: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const photoRecords = await ctx.prisma.wishlistItemPhoto.findMany({
            where: { wishlistItemID: input },
        });

        return photoRecords.map((photoRecord) => photoRecord.imageKey);
    }),

    create: publicProcedure.input(z.object({ imageKey: z.string(), wishlistItemID: z.number() })).mutation(async ({ ctx, input }) => {
        await ctx.prisma.wishlistItemPhoto.create({
            data: {
                imageKey: input.imageKey,
                wishlistItemID: input.wishlistItemID,
            },
        });
    }),

    delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
        await ctx.prisma.wishlistItemPhoto.delete({
            where: {
                id: input,
            },
        });
    }),
});
