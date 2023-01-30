import { faArrowCircleRight, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import Link from 'next/link';
import { api } from '../utils/api';

const WishlistSelect: NextPage = () => {
    const wishlists = api.wishlists.getAll.useQuery();

    return (
        <>
            <main className="min-h-screen overflow-hidden">
                <h1 className="w-full text-center">Select Your Wishlist</h1>

                <hr className="solid mb-6 w-1/4 text-center"></hr>

                <div className="flex flex-col items-center justify-center gap-8">
                    {wishlists.data &&
                        wishlists.data.map((w) => {
                            return (
                                <Link
                                    href={{
                                        pathname: '/wishlist',
                                        query: { wishlistID: w.id },
                                    }}
                                    key={w.id}
                                    className="glass-button relative h-full w-1/3 cursor-pointer rounded-3xl p-5 no-underline shadow-md transition duration-200 hover:bg-purple-500"
                                >
                                    <div>
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-col">
                                                <h1>{w.name}</h1>
                                                <p className="m-0">By {w.listOwner}</p>
                                                <p className="m-0">Last updated on {w.updatedAt.toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faArrowCircleRight} style={{ fontSize: 75, color: 'white' }} />
                                            </div>

                                            <div className="absolute top-0 right-0 m-3">
                                                <FontAwesomeIcon icon={faBell} style={{ fontSize: 25, color: 'white' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </main>
        </>
    );
};

export default WishlistSelect;
