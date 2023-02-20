import { faArrowCircleRight, faBell, faBellSlash, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type NextPage } from 'next';
import { getSession, GetSessionParams, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import LoadingSpinner from '../components/loading-spinner';
import { api } from '../utils/api';
import { displayDangerToast, displaySuccessToast } from '../utils/toast-functions';
import { useWishlistOwnerStore } from '../utils/zustand-stores';

const WishlistSelect: NextPage = () => {
    const wishlistOwnerStore = useWishlistOwnerStore();

    const user = useSession().data?.user;

    const [bellIcon, setBellIcon] = useState<Map<number, IconDefinition>>(new Map());

    const wishlists = api.wishlists.getAll.useQuery(undefined, {
        onSuccess: (wishlists) => {
            for (const wishlist of wishlists) {
                setBellIcon((prev) => new Map([...prev, [wishlist.id, faBell]]));
            }
        },
    });

    const toggleBellIcon = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, wishlistID: number, wishlistName: string) => {
        e.preventDefault();

        if (bellIcon.get(wishlistID) === faBell) {
            setBellIcon((prev) => new Map([...prev, [wishlistID, faBellSlash]]));
            displayDangerToast(`You will no longer receive notifications for ${wishlistName}.`);
            return;
        }

        setBellIcon((prev) => new Map([...prev, [wishlistID, faBell]]));
        displaySuccessToast(`You will now receive notifications for ${wishlistName}!`);
    };

    const linkClick = (listOwner: string) => wishlistOwnerStore.setWishlistOwnerName(listOwner);

    return (
        <main className="min-h-screen overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <h1 className="m-4 text-3xl font-semibold">Welcome {user?.name?.split(' ')[0]}!</h1>
                <hr className="solid mb-6 w-[32rem] xs:w-11/12"></hr>

                {wishlists.isLoading && (
                    <div>
                        <LoadingSpinner />
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center justify-center gap-8">
                {wishlists.data &&
                    bellIcon.size === wishlists.data.length &&
                    wishlists.data.map((w) => {
                        return (
                            <Link
                                href={{
                                    pathname: '/wishlist',
                                    query: { wishlistID: w.id, wishlistName: w.name },
                                }}
                                key={w.id}
                                onClick={() => linkClick(w.listOwner)}
                                className="glass-button relative h-full w-[32rem] cursor-pointer rounded-3xl p-5 no-underline shadow-lg transition duration-200 hover:bg-purple-500 xs:w-11/12"
                            >
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-col">
                                        <h1 className="mb-3 text-4xl font-bold">{w.name}</h1>
                                        <p className="m-0">By {w.listOwner}</p>
                                        <p className="m-0">Last updated on {w.updatedAt.toLocaleDateString()}</p>
                                    </div>

                                    <div className="mr-7 flex items-center">
                                        <FontAwesomeIcon icon={faArrowCircleRight} style={{ fontSize: 75, color: 'white' }} />
                                    </div>

                                    <button className="absolute top-0 right-0 m-3" onClick={(e) => toggleBellIcon(e, w.id, w.name)}>
                                        <FontAwesomeIcon icon={bellIcon.get(w.id)!} style={{ fontSize: 25, color: 'white' }} />
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </main>
    );
};

export default WishlistSelect;

export const getServerSideProps = async (context: GetSessionParams | undefined) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};
