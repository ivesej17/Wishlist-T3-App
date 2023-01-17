import { createTRPCRouter } from './trpc';
import { wishlistsRouter } from './routers/wishlists-router';
import { wishlistItemsRouter } from './routers/wishlist-items-router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    wishlists: wishlistsRouter,
    wishlistItems: wishlistItemsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
