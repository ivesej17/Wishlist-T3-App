import { motion } from 'framer-motion';
import { type NextPage } from 'next';
import Head from 'next/head';
import GlassButton from '../components/glass-button';
import { signIn, getSession, GetSessionParams } from 'next-auth/react';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Wishlist</title>
                <meta name="description" content="Wishlist Application created by Elliott Ives using create-t3-app" />
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5 } }}>
                        <h1 className="text-5xl font-extrabold text-white">
                            Welcome To <span className="text-[#9511a7]">Wish</span>List
                        </h1>
                    </motion.div>

                    <GlassButton buttonText={'Sign In'} onClickFunction={() => signIn()}></GlassButton>
                </div>
            </main>
        </>
    );
};

export default Home;

export const getServerSideProps = async (context: GetSessionParams | undefined) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/wishlist-select',
            },
        };
    }

    return {
        props: {},
    };
};
