import { create } from 'zustand';
import { useEffect } from 'react';

/**
 * Chart Element Selection Store
 * Implements: Select & Edit Chart Elements specification
 */

export interface ChartElement {
    id: string;
    type: string;
    price: number;
    hitbox: {
        top: number;
        bottom: number;
    };
    label?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

interface ChartElementStoreState {
    focusedElementId: string | null;
    previewPrice: number | null;
    isEditing: boolean;

    focusedElement: ChartElement | null;
    originalPrice: number | null;

    focus: (element: ChartElement) => void;
    clearFocus: () => void; // ESC → clear
    updatePreview: (price: number) => void;
    adjustPreview: (direction: 'up' | 'down', step?: number) => void;
    commit: () => void;
    cancel: () => void;

    hasChanges: () => boolean;
}

export const useChartElementStore = create<ChartElementStoreState>(
    (set, get) => ({
        focusedElementId: null,
        previewPrice: null,
        isEditing: false,
        focusedElement: null,
        originalPrice: null,

        // Focus (Click / Tap)
        focus: (element) => {
            console.log('Element Focused:', {
                id: element.id,
                type: element.type,
                price: element.price,
                label: element.label,
                hitbox: element.hitbox,
            });

            set({
                focusedElementId: element.id,
                focusedElement: element,
                previewPrice: element.price,
                originalPrice: element.price,
                isEditing: true,
            });
        },

        // Clear Focus (Click outside / ESC)
        clearFocus: () => {
            const { focusedElement } = get();
            if (focusedElement) {
                console.log('Focus Cleared:', focusedElement.id);
            }

            set({
                focusedElementId: null,
                focusedElement: null,
                previewPrice: null,
                originalPrice: null,
                isEditing: false,
            });
        },

        // Update Preview Price (Mobile buttons / Desktop arrows)
        updatePreview: (price) => {
            const { focusedElement } = get();
            if (!focusedElement) return;

            set({ previewPrice: price });
        },

        // Adjust Preview (Arrow keys)
        adjustPreview: (direction, step = 0.1) => {
            const { previewPrice, focusedElement } = get();
            if (!focusedElement || previewPrice === null) return;

            const newPrice =
                direction === 'up' ? previewPrice + step : previewPrice - step;

            console.log(
                `${direction === 'up' ? '⬆️' : '⬇️'} Preview adjusted: ${previewPrice.toFixed(4)} → ${newPrice.toFixed(4)}`,
            );

            set({ previewPrice: newPrice });
        },

        // Commit (Enter / Save button)
        commit: () => {
            const { focusedElement, previewPrice, originalPrice } = get();
            if (
                !focusedElement ||
                previewPrice === null ||
                originalPrice === null
            )
                return;

            if (Math.abs(previewPrice - originalPrice) > 0.001) {
                console.log('✅ Changes Committed:', {
                    id: focusedElement.id,
                    from: originalPrice,
                    to: previewPrice,
                    element: focusedElement,
                });

                // Update element's price in store
                set({
                    focusedElement: { ...focusedElement, price: previewPrice },
                    originalPrice: previewPrice,
                });
            }
        },

        // Cancel (Revert changes)
        cancel: () => {
            const { focusedElement, originalPrice } = get();
            if (!focusedElement || originalPrice === null) return;

            console.log(
                '❌ Changes Cancelled, restoring original price:',
                originalPrice,
            );

            set({
                previewPrice: originalPrice,
            });
        },

        hasChanges: () => {
            const { previewPrice, originalPrice } = get();
            if (previewPrice === null || originalPrice === null) return false;
            return Math.abs(previewPrice - originalPrice) > 0.001;
        },
    }),
);

/**
 * Keyboard Control Hook
 * Desktop: ArrowUp/ArrowDown, Shift+Arrow for bigger step
 */
export const useChartElementKeyboard = (
    enabled: boolean = true,
    calculateStep?: () => number,
) => {
    const store = useChartElementStore();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!enabled || !store.focusedElement) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Arrow keys
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const baseStep = calculateStep ? calculateStep() : 1;
                const step = e.shiftKey ? baseStep * 10 : baseStep; //  Shift + Arrow → bigger step
                store.adjustPreview('up', step);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const baseStep = calculateStep ? calculateStep() : 1;
                const step = e.shiftKey ? baseStep * 10 : baseStep; // Shift + Arrow → bigger step
                store.adjustPreview('down', step);
            }
            // Enter → commit
            else if (e.key === 'Enter') {
                e.preventDefault();
                store.commit();
            }
            // Escape → cancel and clear focus
            else if (e.key === 'Escape') {
                e.preventDefault();
                store.cancel();
                store.clearFocus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, store.focusedElement, calculateStep]);

    return store;
};

// Helper function to generate deterministic IDs
export const generateElementId = (
    type: string,
    scope: string,
    key: string | number,
    variant?: string,
): string => {
    const parts = [type, scope, String(key)];
    if (variant) parts.push(variant);
    return parts.join(':');
};
