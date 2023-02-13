import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

// Create router with procedure definitions.
export const wishlistItemPhotosRouter = createTRPCRouter({
    getImageKeysByWishlistItemID: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const photoRecords = await ctx.prisma.wishlistItemPhoto.findMany({
            where: { wishlistItemID: input },
        });

        return photoRecords.map((photoRecord) => photoRecord.imageKey);
    }),

    create: protectedProcedure.input(z.object({ imageKey: z.string(), wishlistItemID: z.number() })).mutation(async ({ ctx, input }) => {
        await ctx.prisma.wishlistItemPhoto.create({
            data: {
                imageKey: input.imageKey,
                wishlistItemID: input.wishlistItemID,
            },
        });
    }),

    replaceAll: protectedProcedure.input(z.object({ imageKeys: z.array(z.string()), wishlistItemID: z.number() })).mutation(async ({ ctx, input }) => {
        await ctx.prisma.wishlistItemPhoto.deleteMany({
            where: { wishlistItemID: input.wishlistItemID },
        });

        await ctx.prisma.wishlistItemPhoto.createMany({
            data: input.imageKeys.map((imageKey) => ({
                imageKey,
                wishlistItemID: input.wishlistItemID,
            })),
        });
    }),
});
