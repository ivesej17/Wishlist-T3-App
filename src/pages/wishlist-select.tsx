import { faArrowCircleRight, faBell, faBellSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { ToastContainer } from 'react-toastify';
import { displayToast } from '../components/toast-container';
import { api } from '../utils/api';

const WishlistSelect: NextPage = () => {
    const wishlists = api.wishlists.getAll.useQuery();

    // const [isBellActive, setIsBellActive] = useState(true);

    const onBellClick = (e: any) => {
        e.preventDefault();
        displayToast('🔔 Notifications enabled!');
    };

    // const getInverseBellIcon = (currentIcon: IconDefinition) => (currentIcon === faBell ? faBellSlash : faBell);

    return (
        <main className="min-h-screen overflow-hidden">
            <h1 className="m-4 w-full text-center text-3xl font-medium">Select Your Wishlist</h1>

            <div className="flex items-center justify-center">
                <hr className="solid mb-6 w-[32rem] text-center xs:w-11/12"></hr>
            </div>

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

                                    <button className="absolute top-0 right-0 m-3" onClick={(e) => onBellClick(e)}>
                                        <FontAwesomeIcon icon={faBell} style={{ fontSize: 25, color: 'white' }} />
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
            </div>
            <ToastContainer />
        </main>
    );
};

export default WishlistSelect;
