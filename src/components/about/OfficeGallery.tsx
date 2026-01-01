'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface OfficeGalleryImage {
    id: string;
    image_url: string;
    title?: string | null;
    description?: string | null;
}

interface OfficeGalleryProps {
    images: OfficeGalleryImage[];
}

export default function OfficeGallery({ images }: OfficeGalleryProps) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className={`group relative overflow-hidden rounded-2xl cursor-pointer ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                            }`}
                        style={{
                            minHeight: index === 0 ? '400px' : '250px'
                        }}
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={image.image_url}
                            alt={image.title || 'Office image'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Hover overlay with zoom icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content Overlay */}
                        {(image.title || image.description) && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/70 to-transparent">
                                {image.title && (
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {image.title}
                                    </h3>
                                )}
                                {image.description && (
                                    <p className="text-white/80 text-sm">
                                        {image.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Subtle Border Glow on Hover */}
                        <div className="absolute inset-0 rounded-2xl border border-[var(--primary-accent)]/0 group-hover:border-[var(--primary-accent)]/30 transition-all duration-500 pointer-events-none" />
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

                    {/* Image container - full size */}
                    <div
                        className="relative w-full h-full max-w-[95vw] max-h-[90vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentIndex].image_url}
                            alt={images[currentIndex].title || `Office image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                            sizes="95vw"
                        />
                    </div>

                    {/* Image title and description */}
                    {(images[currentIndex].title || images[currentIndex].description) && (
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center max-w-2xl px-4">
                            {images[currentIndex].title && (
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {images[currentIndex].title}
                                </h3>
                            )}
                            {images[currentIndex].description && (
                                <p className="text-white/80 text-sm">
                                    {images[currentIndex].description}
                                </p>
                            )}
                        </div>
                    )}

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
                                    key={image.id}
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
                                        src={image.image_url}
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
