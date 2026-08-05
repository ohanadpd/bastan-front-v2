'use client';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

type PlayButtonProps = Omit<React.ComponentPropsWithRef<'div'>, keyof HTMLMotionProps<'div'>> & 
    HTMLMotionProps<'div'>;

const PlayButton = React.forwardRef<HTMLDivElement, PlayButtonProps>(
    ({ className, ...props }, ref) => {
        return (
            <motion.div
                className={cn('cursor-pointer', className)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                ref={ref}
                {...props}
            >
                <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.circle
                        cx="28.5"
                        cy="28.5"
                        r="28.5"
                        fill="var(--primary)"
                        fillOpacity="0.4"
                        animate={{
                            scale: [0.9, 1, 0.9],
                            opacity: [0.3, 0.4, 0.3]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.circle
                        cx="28.5"
                        cy="28.5"
                        r="24.5"
                        fill="var(--primary)"
                        fillOpacity="0.69"
                        animate={{
                            scale: [0.9, 1, 0.9],
                            opacity: [0.6, 0.69, 0.6]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.circle
                        cx="29"
                        cy="29"
                        r="20"
                        fill="var(--primary)"
                        animate={{
                            scale: [0.95, 1, 0.95]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.path
                        d="M23.3398 29.3773V26.6905C23.3398 23.3547 25.7021 21.9887 28.5927 23.6566L30.9247 25L33.2568 26.3434C36.1474 28.0113 36.1474 30.7434 33.2568 32.4113L30.9247 33.7547L28.5927 35.0981C25.7021 36.766 23.3398 35.4 23.3398 32.0641V29.3773Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>
        );
    }
);

PlayButton.displayName = 'PlayButton';
export { PlayButton };
