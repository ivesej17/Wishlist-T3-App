import { type AppType } from 'next/app';

import { api } from '../utils/api';

import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

import 'react-toastify/dist/ReactToastify.css';

import { config } from '@fortawesome/fontawesome-svg-core';

// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

const MyApp: AppType = ({ Component, pageProps }) => {
    return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
