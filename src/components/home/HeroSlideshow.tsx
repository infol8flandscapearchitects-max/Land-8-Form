'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '@/lib/types/database';

interface HeroSlideshowProps {
    slides: HeroSlide[];
}

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Default slides if none from database
    const defaultSlides: HeroSlide[] = [
        {
            id: '1',
            image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
            title: 'Building Tomorrow\'s Vision',
            subtitle: 'Where Innovation Meets Design Excellence',
            display_order: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80',
            title: 'Sustainable Architecture',
            subtitle: 'Creating Spaces That Inspire',
            display_order: 1,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '3',
            image_url: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=1920&q=80',
            title: 'Modern Design Philosophy',
            subtitle: 'Crafting Experiences Through Architecture',
            display_order: 2,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    const displaySlides = slides.length > 0 ? slides : defaultSlides;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, [displaySlides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    }, [displaySlides.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    useEffect(() => {
        if (!isAutoPlaying || displaySlides.length <= 1) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, displaySlides.length]);

    return (
        <section className="relative w-full h-screen overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <Image
                        src={displaySlides[currentIndex].image_url}
                        alt={displaySlides[currentIndex].title || 'Hero image'}
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                    />
                    <div className="hero-overlay absolute inset-0" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-6 lg:px-8 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {displaySlides[currentIndex].title && (
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                                    {displaySlides[currentIndex].title}
                                </h1>
                            )}
                            {displaySlides[currentIndex].subtitle && (
                                <p className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                                    {displaySlides[currentIndex].subtitle}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Arrows */}
            {displaySlides.length > 1 && (
                <>
                    <button
                        onClick={() => {
                            prevSlide();
                            setIsAutoPlaying(false);
                            setTimeout(() => setIsAutoPlaying(true), 10000);
                        }}
                        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-[var(--primary-accent)] hover:border-[var(--primary-accent)] hover:bg-black/50 transition-all duration-300 z-20"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => {
                            nextSlide();
                            setIsAutoPlaying(false);
                            setTimeout(() => setIsAutoPlaying(true), 10000);
                        }}
                        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-[var(--primary-accent)] hover:border-[var(--primary-accent)] hover:bg-black/50 transition-all duration-300 z-20"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {displaySlides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                    {displaySlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Scroll Indicator - Centered above dots */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-2 rounded-full bg-white"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
