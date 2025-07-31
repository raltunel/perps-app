import { useEffect, useRef, useCallback } from 'react';
import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import { useUnifiedMarginStore } from '~/stores/UnifiedMarginStore';
import { unifiedMarginPollingManager } from '~/services/UnifiedMarginPollingManager';

export function useUnifiedMarginData() {
    const sessionState = useSession();
    const hasSubscribedRef = useRef(false);
    const lastSessionStateRef = useRef<boolean>(false);

    // Get store data using selectors to avoid re-renders
    const marginBucket = useUnifiedMarginStore((state) => state.marginBucket);
    const balance = useUnifiedMarginStore((state) => state.balance);
    const positions = useUnifiedMarginStore((state) => state.positions);
    const isLoading = useUnifiedMarginStore((state) => state.isLoading);
    const error = useUnifiedMarginStore((state) => state.error);
    const lastUpdateTime = useUnifiedMarginStore(
        (state) => state.lastUpdateTime,
    );

    const isSessionEstablished = isEstablished(sessionState);

    useEffect(() => {
        // Track session state changes
        const sessionChanged =
            lastSessionStateRef.current !== isSessionEstablished;
        lastSessionStateRef.current = isSessionEstablished;

        if (!isSessionEstablished) {
            // Only unsubscribe if we were actually subscribed
            if (hasSubscribedRef.current) {
                hasSubscribedRef.current = false;
                unifiedMarginPollingManager.unsubscribe();
            }
            return;
        }

        // Subscribe only if not already subscribed and session just became established
        if (!hasSubscribedRef.current && sessionChanged) {
            hasSubscribedRef.current = true;
            unifiedMarginPollingManager.subscribe(
                sessionState.connection,
                sessionState.walletPublicKey,
            );
        }

        // Cleanup function - only runs on unmount
        return () => {
            if (hasSubscribedRef.current) {
                hasSubscribedRef.current = false;
                unifiedMarginPollingManager.unsubscribe();
            }
        };
    }, [isSessionEstablished]); // Only depend on session established state

    const forceRefresh = useCallback(async () => {
        if (!isSessionEstablished) {
            throw new Error('Cannot refresh: session not established');
        }

        return unifiedMarginPollingManager.forceRefresh();
    }, [isSessionEstablished]);

    return {
        marginBucket,
        balance,
        positions,
        isLoading,
        error,
        lastUpdateTime,
        forceRefresh,
    };
}
