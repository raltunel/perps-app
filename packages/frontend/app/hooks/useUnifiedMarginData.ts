import { useEffect, useRef, useCallback } from 'react';
import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import { useUnifiedMarginStore } from '~/stores/UnifiedMarginStore';
import { unifiedMarginPollingManager } from '~/services/UnifiedMarginPollingManager';

export function useUnifiedMarginData() {
    const sessionState = useSession();
    const hasSubscribedRef = useRef(false);
    const isSessionEstablished = isEstablished(sessionState);

    // Get store data using selectors to avoid re-renders
    const marginBucket = useUnifiedMarginStore((state) => state.marginBucket);
    const balance = useUnifiedMarginStore((state) => state.balance);
    const positions = useUnifiedMarginStore((state) => state.positions);
    const isLoading = useUnifiedMarginStore((state) => state.isLoading);
    const error = useUnifiedMarginStore((state) => state.error);
    const lastUpdateTime = useUnifiedMarginStore(
        (state) => state.lastUpdateTime,
    );

    useEffect(() => {
        if (!isSessionEstablished) {
            // Clean up if we were subscribed
            if (hasSubscribedRef.current) {
                hasSubscribedRef.current = false;
                unifiedMarginPollingManager.unsubscribe();
            }
            return;
        }

        // Subscribe if not already subscribed
        if (!hasSubscribedRef.current) {
            hasSubscribedRef.current = true;
            unifiedMarginPollingManager.subscribe(
                sessionState.connection,
                sessionState.walletPublicKey,
            );
        }

        // Cleanup on unmount
        return () => {
            if (hasSubscribedRef.current) {
                hasSubscribedRef.current = false;
                unifiedMarginPollingManager.unsubscribe();
            }
        };
    }, [
        isSessionEstablished,
        sessionState.connection,
        sessionState.walletPublicKey,
    ]);

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
