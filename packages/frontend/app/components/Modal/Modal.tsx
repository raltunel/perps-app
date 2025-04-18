import { useEffect, useState, useRef, type ReactNode } from 'react';
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

export default function Modal(props: ModalProps) {
    const {
        close,
        position = 'center',
        children,
        mobileBreakpoint = 768,
        forceBottomSheet = false,
        title,
    } = props;

    // Use our custom hook to detect mobile devices
    const isMobile = useMobile(mobileBreakpoint);

    const [animation, setAnimation] = useState('');
    const bottomSheetRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    // State to track drag
    const dragState = useRef({
        startY: 0,
        currentY: 0,
        isDragging: false,
    });

    // Determine if we should use bottom sheet based on screen size or forced option
    const shouldUseBottomSheet = forceBottomSheet || isMobile;
    const actualPosition = shouldUseBottomSheet ? 'bottomSheet' : position;

    // Function to handle closing with animation
    const handleClose = (): void => {
        if (actualPosition === 'bottomSheet') {
            setAnimation(styles.slideDown);
            setTimeout(() => {
                if (close) {
                    close();
                }
            }, 300); // Match this with your CSS animation duration
        } else {
            if (close) {
                close();
            }
        }
    };

    // DOM id for the area outside modal body
    const OUTSIDE_MODAL_DOM_ID = 'outside_modal';

    // fn to handle a click outside the modal body
    const handleOutsideClick = (target: HTMLDivElement): void => {
        // close the modal if area outside the body was clicked directly
        if (target.id === OUTSIDE_MODAL_DOM_ID && close) {
            handleClose();
        }
    };

    // return children without creating curtain behind modal
    // this allows us to make multiple non-exclusive modals at once
    if (!close) return children;

    // Handle drag start
    const handleDragStart = (e: React.TouchEvent | React.MouseEvent): void => {
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

        dragState.current = {
            startY: clientY,
            currentY: 0,
            isDragging: true,
        };

        // Add active class to show the grabbing cursor
        if (handleRef.current) {
            handleRef.current.classList.add(styles.dragging);
        }
    };

    // Handle drag move
    const handleDragMove = (e: React.TouchEvent | MouseEvent): void => {
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

        // Apply the transformation
        bottomSheetRef.current.style.transform = `translateY(${deltaY}px)`;
        bottomSheetRef.current.style.transition = 'none'; // Disable transition during drag
    };

    // Handle drag end
    const handleDragEnd = (): void => {
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
    };

    // event listener to close modal on `Escape` keydown event
    useEffect(() => {
        // type of event
        const EVENT_TYPE = 'keydown';
        // fn to close modal when the `Escape` key is pressed
        function handleEscape(evt: KeyboardEvent): void {
            if (evt.key === 'Escape' && close) {
                handleClose();
            }
        }

        // Add animation class on mount for bottom sheet
        if (actualPosition === 'bottomSheet') {
            // Slight delay to ensure the initial transform is applied first
            setTimeout(() => {
                setAnimation(styles.slideUp);
            }, 10);
        }

        // add the event listener to the DOM
        document.addEventListener(EVENT_TYPE, handleEscape);
        // remove event listener from the DOM when component unmounts
        return () => document.removeEventListener(EVENT_TYPE, handleEscape);
    }, [actualPosition, close]);

    return (
        <div
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleOutsideClick(e.target as HTMLDivElement)
            }
            id={OUTSIDE_MODAL_DOM_ID}
            className={`${styles.outside_modal} ${actualPosition === 'bottomSheet' ? styles.bottomSheetContainer : ''}`}
            style={positionStyles[actualPosition]}
        >
            {actualPosition === 'bottomSheet' ? (
                // Bottom sheet - direct rendering without extra container
                <div
                    ref={bottomSheetRef}
                    className={`${styles.bottomSheet} ${animation}`}
                    style={{
                        // Add padding-bottom to account for mobile safe area
                        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 16px)`
                    }}
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
                    <header>
                        <span />
                        <h3>{title}</h3>
                        <MdClose onClick={handleClose} color='var(--text2)' />
                    </header>
                    <div className={styles.modalContent}>{children}</div>
                </div>
            ) : (
                // Center or other position modals - use centered styling
                <div className={styles.centerModal}>
                    <header>
                        <span />
                        <h3>{title}</h3>
                        <MdClose onClick={handleClose} color='var(--text2)' />
                    </header>

                    {children}
                </div>
            )}
        </div>
    );
}