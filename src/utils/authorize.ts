import { getSession, type GetSessionParams } from 'next-auth/react';

export const authorizeUser = async (context: GetSessionParams | undefined) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/index',
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};
