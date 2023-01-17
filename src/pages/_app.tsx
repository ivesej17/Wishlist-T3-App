import { type AppType } from 'next/app';

import { api } from '../utils/api';

import '../styles/globals.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

import { config } from '@fortawesome/fontawesome-svg-core';
// Tell Font Awesome to skip adding the CSS automatically
// since it's already imported above
config.autoAddCss = false;

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import { Montserrat } from '@next/font/google';
import { purple } from '@mui/material/colors';

const montserrat = Montserrat({ subsets: ['latin'] });

export const theme = createTheme({
    palette: {
        primary: {
            main: purple[400],
        },
        mode: 'light',
    },
    typography: {
        fontFamily: montserrat.style.fontFamily,
    },
});

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default api.withTRPC(MyApp);
