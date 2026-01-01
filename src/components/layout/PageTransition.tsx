'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Staggered animation wrapper for children
export function StaggerContainer({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Fade up animation for individual elements
export function FadeUp({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Scale animation for cards
export function ScaleIn({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Slide in from left
export function SlideInLeft({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Slide in from right
export function SlideInRight({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                ease: 'easeOut',
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
