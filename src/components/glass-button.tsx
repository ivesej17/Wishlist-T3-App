import { motion } from 'framer-motion';

const GlassButton: React.FC<{ buttonText: string, onClickFunction?: () => void}> = (props) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="glass-button flex w-72 cursor-pointer items-center justify-center rounded-3xl border-none p-2"
            onClick={props.onClickFunction}
        >
            <h3>{props.buttonText}</h3>
        </motion.button>
    );
};

export default GlassButton;
