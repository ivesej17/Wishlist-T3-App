import { motion } from 'framer-motion';

const MotionButton: React.FC<{ buttonText: string }> = (props) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="glass-button flex w-72 cursor-pointer items-center justify-center rounded-3xl border-none p-2"
        >
            <h3>{props.buttonText}</h3>
        </motion.button>
    );
};

export default MotionButton;
