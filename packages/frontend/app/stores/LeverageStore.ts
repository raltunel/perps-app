import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LeverageState {
    // User's preferred leverage level
    preferredLeverage: number;

    // Current applied leverage (may be different from preferred if market limits are lower)
    currentLeverage: number;

    // Track the current market symbol to detect market changes
    currentMarket?: string;
}

interface LeverageStore extends LeverageState {
    /**
     * this setss preferred leverage and applies it as current leverage
     * Currently calling this when user manually changes leverage
     */
    setPreferredLeverage: (leverage: number) => void;

    /**
     * Validates and applies leverage for a new market
     * Returns the leverage that should be applied (thsi may be different from preferred)
     */
    validateAndApplyLeverageForMarket: (
        marketSymbol: string,
        maxLeverage: number,
        minLeverage?: number,
    ) => number;

    /**
     * for now, this just returns the appropriate leverage for a market without changing state
     * but we can also use it for calculations, etc...
     */
    getLeverageForMarket: (maxLeverage: number, minLeverage?: number) => number;

    /**
     * Reset leverage to default
     */
    resetLeverage: () => void;
}

const DEFAULT_LEVERAGE = 1;
const DEFAULT_MIN_LEVERAGE = 1;

export const useLeverageStore = create<LeverageStore>()(
    persist(
        (set, get) => ({
            preferredLeverage: DEFAULT_LEVERAGE,
            currentLeverage: DEFAULT_LEVERAGE,
            currentMarket: undefined,

            setPreferredLeverage: (leverage: number) => {
                set({
                    preferredLeverage: leverage,
                    currentLeverage: leverage,
                });
            },

            validateAndApplyLeverageForMarket: (
                marketSymbol: string,
                maxLeverage: number,
                minLeverage: number = DEFAULT_MIN_LEVERAGE,
            ) => {
                const state = get();

                // Calculate the appropriate leverage for this market
                const targetLeverage = Math.min(
                    state.preferredLeverage,
                    maxLeverage,
                );

                // Ensure it's not below minimum
                const validatedLeverage = Math.max(targetLeverage, minLeverage);

                // Update state with new market and validated leverage
                set({
                    currentLeverage: validatedLeverage,
                    currentMarket: marketSymbol,
                });

                return validatedLeverage;
            },

            getLeverageForMarket: (
                maxLeverage: number,
                minLeverage: number = DEFAULT_MIN_LEVERAGE,
            ) => {
                const state = get();
                const targetLeverage = Math.min(
                    state.preferredLeverage,
                    maxLeverage,
                );
                return Math.max(targetLeverage, minLeverage);
            },

            resetLeverage: () => {
                set({
                    preferredLeverage: DEFAULT_LEVERAGE,
                    currentLeverage: DEFAULT_LEVERAGE,
                    currentMarket: undefined,
                });
            },
        }),
        {
            name: 'leverage-store',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
