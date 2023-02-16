import { type AppType } from 'next/app';

import { api } from '../utils/api';

import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

import 'react-toastify/dist/ReactToastify.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <ToastContainer />
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
