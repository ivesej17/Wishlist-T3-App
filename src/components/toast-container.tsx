import { ToastContainer } from 'react-toastify';

export const Toast = () => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 h-screen w-screen">
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={1}
            />
        </div>
    );
};
