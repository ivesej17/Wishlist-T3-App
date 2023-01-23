import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

// Create router with procedure definitions.
export const wishlistItemPhotosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ imageKey: z.string(), wishlistItemID: z.number() })).mutation(async ({ ctx, input }) => {
        ctx.prisma.image.create({
            data: {
                imageKey: input.imageKey,
                wishlistItemID: input.wishlistItemID,
            },
        });
    }),
});
