import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './HorizontalScrollable.module.css';

interface HorizontalScrollableProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: string;
}

export function HorizontalScrollable(props: HorizontalScrollableProps) {
    const { children, className, maxWidth } = props;

    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const scrollLeftBtnRef = useRef<HTMLButtonElement>(null);
    const scrollRightBtnRef = useRef<HTMLButtonElement>(null);

    const checkScroll = () => {
        if (wrapperRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = wrapperRef.current;

            // Can scroll left if we're not at the beginning
            setCanScrollLeft(scrollLeft > 1);

            // Can scroll right if we're not at the end
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    const scrollLeft = () => {
        if (wrapperRef.current) {
            const { clientWidth } = wrapperRef.current;
            // Scroll half the width of the container
            wrapperRef.current.scrollBy({
                left: -clientWidth / 2,
                behavior: 'smooth',
            });

            setTimeout(() => {
                checkScroll();
            }, 350);
        }
    };

    const scrollRight = () => {
        if (wrapperRef.current) {
            const { clientWidth } = wrapperRef.current;
            // Scroll half the width of the container
            wrapperRef.current.scrollBy({
                left: clientWidth / 2,
                behavior: 'smooth',
            });

            setTimeout(() => {
                checkScroll();
            }, 350);
        }
    };

    const scrollLeftBtn = canScrollLeft && (
        <button
            className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
            onClick={scrollLeft}
            ref={scrollLeftBtnRef}
            aria-label='Scroll tabs left'
        >
            <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
            </svg>
        </button>
    );

    const scrollRightBtn = canScrollRight && (
        <button
            className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
            onClick={scrollRight}
            ref={scrollRightBtnRef}
            aria-label='Scroll tabs right'
        >
            <svg viewBox='0 0 24 24' fill='currentColor'>
                <path d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' />
            </svg>
        </button>
    );

    useEffect(() => {
        checkScroll();

        const handleResize = () => {
            checkScroll();
        };

        window.addEventListener('resize', handleResize);

        // Initialize scroll state
        if (contentRef.current) {
            contentRef.current.addEventListener('scroll', checkScroll);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (contentRef.current) {
                contentRef.current.removeEventListener('scroll', checkScroll);
            }
        };
    }, []);

    useEffect(() => {
        checkScroll();
    }, [children]);

    return (
        <>
            {maxWidth ? (
                <div style={{ position: 'relative' }}>
                    <div
                        ref={wrapperRef}
                        className={`${styles.horizontalScrollable} ${className}`}
                        style={{ maxWidth }}
                    >
                        {scrollLeftBtn}
                        {scrollRightBtn}
                        <div
                            className={styles.horizontalScrollableContent}
                            ref={contentRef}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    <div
                        ref={wrapperRef}
                        className={`${styles.horizontalScrollable} ${className}`}
                    >
                        <div
                            className={styles.horizontalScrollableContent}
                            ref={contentRef}
                        >
                            {children}
                        </div>
                    </div>
                    {scrollLeftBtn}
                    {scrollRightBtn}
                </div>
            )}
        </>
    );
}
