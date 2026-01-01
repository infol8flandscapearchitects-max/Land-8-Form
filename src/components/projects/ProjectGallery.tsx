'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProjectGalleryProps {
    images: string[];
    projectTitle: string;
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = '';
    };

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, goToPrevious, goToNext]);

    if (images.length === 0) return null;

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`relative rounded-xl overflow-hidden cursor-pointer group ${index === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                            }`}
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={image}
                            alt={`${projectTitle} - Image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                        aria-label="Close lightbox"
                    >
                        <X size={24} className="text-white" />
                    </button>

                    {/* Previous button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={28} className="text-white" />
                        </button>
                    )}

                    {/* Next button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                            aria-label="Next image"
                        >
                            <ChevronRight size={28} className="text-white" />
                        </button>
                    )}

                    {/* Image container */}
                    <div
                        className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 md:mx-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${projectTitle} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Image counter */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="text-white text-sm font-medium">
                            {currentIndex + 1} / {images.length}
                        </span>
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full px-4 overflow-x-auto scrollbar-hide">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                    className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${index === currentIndex
                                            ? 'ring-2 ring-[var(--primary-accent)] opacity-100 scale-110'
                                            : 'opacity-50 hover:opacity-80'
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
