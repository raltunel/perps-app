import React, { useEffect, useState, useRef, useCallback, useMemo, type ReactNode } from 'react';
import styles from './Modal.module.css';
import { useMobile } from '~/hooks/useMediaQuery';
import { MdClose } from 'react-icons/md';

type positions = 'center' | 'bottomRight' | 'bottomSheet';

interface positionCSS {
    position?: 'fixed';
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

const positionStyles: Record<positions, positionCSS> = {
    center: {
        position: 'fixed',
        top: '0',
        bottom: '0',
    },
    bottomRight: {
        position: 'fixed',
        bottom: '0',
        right: '0',
    },
    bottomSheet: {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
    },
};

interface ModalProps {
    close?: () => void;
    position?: positions;
    children: ReactNode;
    mobileBreakpoint?: number;
    forceBottomSheet?: boolean;
    title: string;
}

function Modal(props: ModalProps) {
    const {
        close,
        position = 'center',
        children,
        mobileBreakpoint = 768,
        forceBottomSheet = false,
        title,
    } = props;

    const isMobile = useMobile(mobileBreakpoint);

    const [animation, setAnimation] = useState('');
    const bottomSheetRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // State to track drag
    const dragState = useRef({
        startY: 0,
        currentY: 0,
        isDragging: false,
    });

    const shouldUseBottomSheet = forceBottomSheet || isMobile;
    const actualPosition = shouldUseBottomSheet ? 'bottomSheet' : position;

    const OUTSIDE_MODAL_DOM_ID = 'outside_modal';

    // Memoize the close handler to prevent unnecessary re-renders
    const handleClose = useCallback((): void => {
        if (actualPosition === 'bottomSheet') {
            setAnimation(styles.slideDown);
            setTimeout(() => {
                if (close) {
                    close();
                }
            }, 300); 
        } else {
            if (close) {
                close();
            }
        }
    }, [actualPosition, close]);

    // Memoize the outside click handler
    const handleOutsideClick = useCallback((target: HTMLDivElement): void => {
        if (target.id === OUTSIDE_MODAL_DOM_ID && close) {
            handleClose();
        }
    }, [OUTSIDE_MODAL_DOM_ID, close, handleClose]);

    // return children without creating curtain behind modal
    // this allows us to make multiple non-exclusive modals at once
    if (!close) return children;
    
    // Use requestAnimationFrame for smooth animations
    const updateDragPosition = useCallback((deltaY: number) => {
        if (!bottomSheetRef.current) return;
        
        requestAnimationFrame(() => {
            if (bottomSheetRef.current) {
                bottomSheetRef.current.style.transform = `translateY(${deltaY}px)`;
                bottomSheetRef.current.style.transition = 'none'; // Disable transition during drag
            }
        });
    }, []);

    // Batch related state updates for starting drag
    const startDragging = useCallback((clientY: number) => {
        dragState.current = {
            startY: clientY,
            currentY: 0,
            isDragging: true,
        };
        
        if (handleRef.current) {
            handleRef.current.classList.add(styles.dragging);
        }
    }, []);

    // Handle drag start - memoized
    const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent): void => {
        if (!bottomSheetRef.current) return;

        let clientY: number;

        if ('touches' in e) {
            // Touch event
            clientY = e.touches[0].clientY;
        } else {
            // Mouse event
            clientY = (e as React.MouseEvent).clientY;
            // For mouse events, we need to add event listeners to document
            document.addEventListener(
                'mousemove',
                handleDragMove as unknown as EventListener,
            );
            document.addEventListener(
                'mouseup',
                handleDragEnd as unknown as EventListener,
            );
        }

        startDragging(clientY);
    }, [startDragging]);

    // Handle drag move - memoized
    const handleDragMove = useCallback((e: React.TouchEvent | MouseEvent): void => {
        if (!dragState.current.isDragging || !bottomSheetRef.current) return;

        let clientY: number;

        if ('touches' in e) {
            // Touch event
            clientY = e.touches[0].clientY;
        } else {
            // Mouse event
            clientY = (e as MouseEvent).clientY;
        }

        // Calculate how far we've dragged
        const deltaY = clientY - dragState.current.startY;

        // Don't allow dragging up beyond the top
        if (deltaY < 0) return;

        dragState.current.currentY = deltaY;

        // Apply the transformation using requestAnimationFrame
        updateDragPosition(deltaY);
    }, [updateDragPosition]);

    // Handle drag end - memoized
    const handleDragEnd = useCallback((): void => {
        if (!dragState.current.isDragging || !bottomSheetRef.current) {
            return;
        }

        // Clean up event listeners for mouse events
        document.removeEventListener(
            'mousemove',
            handleDragMove as unknown as EventListener,
        );
        document.removeEventListener(
            'mouseup',
            handleDragEnd as unknown as EventListener,
        );

        // Re-enable transition
        bottomSheetRef.current.style.transition = 'transform 0.3s ease-out';

        // If dragged more than 30% of the height, close the sheet
        const sheetHeight = bottomSheetRef.current.offsetHeight;
        if (dragState.current.currentY > sheetHeight * 0.3) {
            handleClose();
        } else {
            // Otherwise snap back to open position
            bottomSheetRef.current.style.transform = 'translateY(0)';
        }

        dragState.current.isDragging = false;

        // Remove active class
        if (handleRef.current) {
            handleRef.current.classList.remove(styles.dragging);
        }
    }, [handleClose]);

    // Prevent background content from scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        // Prevent iOS safari from allowing swipe-up gestures on the modal
        const preventDefaultTouchMove = (e: TouchEvent) => {
            if (modalRef.current?.contains(e.target as Node)) {
                e.preventDefault();
            }
        };
        
        document.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
        
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('touchmove', preventDefaultTouchMove);
        };
    }, []);

    // event listener to close modal on `Escape` keydown event
    useEffect(() => {
        let animationTimeout: number;
        const EVENT_TYPE = 'keydown';
        
        function handleEscape(evt: KeyboardEvent): void {
            if (evt.key === 'Escape' && close) {
                handleClose();
            }
        }

        // Add animation class on mount for bottom sheet
        if (actualPosition === 'bottomSheet') {
            // Slight delay to ensure the initial transform is applied first
            animationTimeout = window.setTimeout(() => {
                setAnimation(styles.slideUp);
            }, 10);
        }

        // add the event listener to the DOM
        document.addEventListener(EVENT_TYPE, handleEscape);
        
        // remove event listener from the DOM when component unmounts
        return () => {
            document.removeEventListener(EVENT_TYPE, handleEscape);
            if (animationTimeout) window.clearTimeout(animationTimeout);
        };
    }, [actualPosition, close, handleClose]);

    // Memoize the modal header
    const modalHeader = useMemo(() => (
        <header>
            <span />
            <h3>{title}</h3>
            {!shouldUseBottomSheet ? 
                <MdClose onClick={handleClose} color='var(--text2)' /> : 
                <span/>
            }
        </header>
    ), [title, shouldUseBottomSheet, handleClose]);

    // Memoize the modal content
    const modalContent = useMemo(() => (
        <div className={styles.modalContent}>
            {children}
            <div className={styles.safeAreaSpacer}></div>
        </div>
    ), [children]);

    return (
        <div
            ref={modalRef}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleOutsideClick(e.target as HTMLDivElement)
            }
            id={OUTSIDE_MODAL_DOM_ID}
            className={`${styles.outside_modal} ${actualPosition === 'bottomSheet' ? styles.bottomSheetContainer : ''}`}
            style={positionStyles[actualPosition]}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {actualPosition === 'bottomSheet' ? (
                <div
                    ref={bottomSheetRef}
                    className={`${styles.bottomSheet} ${animation}`}
                >
                    <div
                        ref={handleRef}
                        className={styles.bottomSheetHandle}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                        onMouseDown={handleDragStart}
                    >
                        <div className={styles.handle}></div>
                    </div>
                    {modalHeader}
                    {modalContent}
                </div>
            ) : (
                // Center or other position modals - use centered styling
                <div className={styles.centerModal}>
                    {modalHeader}
                    {modalContent}
                </div>
            )}
        </div>
    );
}

export default React.memo(Modal);