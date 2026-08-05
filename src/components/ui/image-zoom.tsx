'use client';
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { Trans } from '@lingui/react/macro';

export default function ImageZoom({ className, ...props }: ImageProps & { className?: string }) {
    const [showZoom, setShowZoom] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure we're on the client before using createPortal
    useEffect(() => { setMounted(true); }, []);

    const openZoom = useCallback(() => {
        setShowZoom(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsAnimatingIn(true));
        });
    }, []);

    const closeZoom = useCallback(() => {
        setIsAnimatingIn(false);
        setTimeout(() => setShowZoom(false), 300);
    }, []);

    // Close on Escape key
    useEffect(() => {
        if (!showZoom) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeZoom(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [showZoom, closeZoom]);

    // Prevent background scroll when open
    useEffect(() => {
        document.body.style.overflow = showZoom ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showZoom]);

    const lightbox = showZoom && mounted ? createPortal(
        <div
            className={cn(
                'fixed inset-0 z-[9999] flex items-center justify-center',
                'transition-opacity duration-300 ease-out',
                isAnimatingIn ? 'opacity-100' : 'opacity-0'
            )}
            onClick={closeZoom}
            role="dialog"
            aria-modal="true"
            aria-label="تصویر تمام‌صفحه"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Image */}
            <div
                className={cn(
                    'relative w-full h-full p-4 sm:p-10 flex items-center justify-center',
                    'transition-transform duration-300 ease-out',
                    isAnimatingIn ? 'scale-100' : 'scale-95'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={props.src}
                    alt={props.alt || 'image'}
                    fill
                    className="!object-contain select-none"
                    sizes="100vw"
                    quality={100}
                    priority
                />
            </div>

            {/* Close button */}
            <button
                onClick={closeZoom}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 active:bg-white/40 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                aria-label="بستن"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* ESC hint */}
            <div className="hidden sm:block absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest select-none">
                <Trans>ESC برای بستن</Trans>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {/* Thumbnail */}
            <div
                onClick={openZoom}
                className={cn('relative group cursor-zoom-in overflow-hidden', className)}
                role="button"
                tabIndex={0}
                aria-label="برای مشاهده تمام‌صفحه کلیک کنید"
                onKeyDown={(e) => e.key === 'Enter' && openZoom()}
            >
                <Image {...props} alt={props.alt || 'image'} className='object-cover' />

                {/* Hover hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 backdrop-blur-sm rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {lightbox}
        </>
    );
}
