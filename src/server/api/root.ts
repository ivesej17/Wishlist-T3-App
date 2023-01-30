import { createTRPCRouter } from './trpc';
import { wishlistsRouter } from './routers/wishlists-router';
import { wishlistItemsRouter } from './routers/wishlist-items-router';
import { s3_Router } from './routers/s3-router';
import { wishlistItemPhotosRouter } from './routers/wishlist-item-photos-router';
import { wishlistItemCommentsRouter } from './routers/wishlist-item-comments-router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    wishlists: wishlistsRouter,
    wishlistItems: wishlistItemsRouter,
    s3: s3_Router,
    wishlistItemPhotos: wishlistItemPhotosRouter,
    wishlistItemComments: wishlistItemCommentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
