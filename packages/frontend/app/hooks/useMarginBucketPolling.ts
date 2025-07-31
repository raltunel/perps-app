import { useCallback, useEffect, useState, useRef } from 'react';
import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import {
    getUserMarginBucket,
    USD_MINT,
    DFLT_EMBER_MARKET,
    type MarginBucketAvail,
} from '@crocswap-libs/ambient-ember';
import type { UserBalanceIF } from '~/utils/UserDataIFs';

export function useMarginBucketPolling(pollingInterval: number = 2000): {
    balance: UserBalanceIF | null;
    isLoading: boolean;
    error: string | null;
} {
    const sessionState = useSession();
    const [balance, setBalance] = useState<UserBalanceIF | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchMarginBucket = useCallback(async () => {
        if (!isEstablished(sessionState)) {
            setBalance(null);
            setIsLoading(false);
            return;
        }

        try {
            const marginBucket: MarginBucketAvail | null =
                await getUserMarginBucket(
                    sessionState.connection,
                    sessionState.walletPublicKey,
                    BigInt(DFLT_EMBER_MARKET.mktId),
                    USD_MINT,
                    {},
                );

            if (!marginBucket) {
                setBalance(null);
                setError('No margin bucket found');
                return;
            }

            // Extract values from margin bucket
            const committedCollateral =
                Number(marginBucket.committedCollateral || 0n) /
                Math.pow(10, 6);
            const availToWithdraw =
                Number(marginBucket.availToWithdraw || 0n) / Math.pow(10, 6);
            const hold = committedCollateral - availToWithdraw;

            console.log(marginBucket);
            console.log('Committed Collateral:', committedCollateral);
            // Create balance object
            const newBalance: UserBalanceIF = {
                coin: 'fUSD',
                type: 'margin',
                total: committedCollateral,
                available: availToWithdraw,
                hold: hold,
                entryNtl: 0,
                sortName: '\x01',
                usdcValue: committedCollateral,
                pnlValue: 0,
                metaIndex: 0,
                buyingPower: availToWithdraw,
                contractAddress: 'fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry',
            };

            setBalance(newBalance);
            setError(null);
        } catch (err) {
            console.error('Error fetching margin bucket:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to fetch balance',
            );
        } finally {
            setIsLoading(false);
        }
    }, [sessionState]);

    // Set up polling
    useEffect(() => {
        // Initial fetch
        fetchMarginBucket();

        // Set up interval
        intervalRef.current = setInterval(() => {
            fetchMarginBucket();
        }, pollingInterval);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetchMarginBucket, pollingInterval]);

    return { balance, isLoading, error };
}
