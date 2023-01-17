import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

// bg-gradient-to-b from-[#ecb1c5] to-[#15162c]

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Wishlist</title>
                <meta name="description" content="Wishlist Application created by Elliott Ives using create-t3-app" />
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }}>
                        <h1 className="text-5xl font-extrabold text-white">
                            Welcome To <span className="text-[#9511a7]">Wish</span>List
                        </h1>
                    </motion.div>

                    <Link href={'/wishlist-select'} className="no-underline">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className="glass-button flex w-72 cursor-pointer items-center justify-center rounded-3xl border-none p-2"
                        >
                            <h3>Sign In</h3>
                        </motion.button>
                    </Link>
                </div>
            </main>
        </>
    );
};

export default Home;
