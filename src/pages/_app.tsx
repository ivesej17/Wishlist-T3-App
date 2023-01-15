import { type AppType } from 'next/app';

import { api } from '../utils/api';

import '../styles/globals.css';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import { Montserrat } from '@next/font/google';
import { pink } from '@mui/material/colors';

const montserrat = Montserrat({ subsets: ['latin'] });

export const theme = createTheme({
    palette: {
        primary: {
            main: pink[200],
        },
        mode: 'dark',
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
