import { faArrowCircleRight, faBell, faBellSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage, InferGetServerSidePropsType } from 'next';
import { getSession, GetSessionParams, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { api } from '../utils/api';
import { displayToast } from '../utils/toast-functions';

const WishlistSelect: NextPage = () => {    
    const user = useSession().data?.user;

    const wishlists = api.wishlists.getAll.useQuery(undefined, {
        onSuccess: (wishlists) => {
            for (const wishlist of wishlists) {
                setBellIsActive(bellIsActive.set(wishlist.id, true));
                setBellIcon(bellIcon.set(wishlist.id, faBell));
            }
        },
    });

    const [bellIsActive, setBellIsActive] = useState<Map<number, boolean>>(new Map());

    const [bellIcon, setBellIcon] = useState<Map<number, IconDefinition>>(new Map());

    const onBellClick = (e: any, wishlistID: number) => {
        e.preventDefault();

        const isBellActive = bellIsActive.get(wishlistID);

        bellIsActive.set(wishlistID, !isBellActive);

        const newBellIcon = isBellActive ? faBellSlash : faBell;

        bellIcon.set(wishlistID, newBellIcon);

        if (isBellActive) displayToast('🔔 Notifications enabled!');
        else displayToast('🔕 Notifications disabled!');
    };

    const getBellIcon = (wishlistID: number) => {
        return bellIcon.get(wishlistID)!;
    };

    return (
        <main className="min-h-screen overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <h1 className="m-4 text-3xl font-semibold">Welcome {user?.name?.split(' ')[0]}!</h1>
                <hr className="solid mb-6 w-[32rem] xs:w-11/12"></hr>
            </div>

            <div className="flex flex-col items-center justify-center gap-8">
                {wishlists.data &&
                    wishlists.data.map((w) => {
                        return (
                            <Link
                                href={{
                                    pathname: '/wishlist',
                                    query: { wishlistID: w.id, wishlistName: w.name },
                                }}
                                key={w.id}
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

                                    <button className="absolute top-0 right-0 m-3" onClick={(e) => onBellClick(e, w.id)}>
                                        <FontAwesomeIcon icon={getBellIcon(w.id)} style={{ fontSize: 25, color: 'white' }} />
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
