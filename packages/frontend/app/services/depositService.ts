import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
    getUserTokenBalance,
    buildDepositMarginTx,
} from '@crocswap-libs/ambient-ember';
import { notificationService } from './notificationService';

// USD token mint address from root.tsx configuration
const USD_MINT = new PublicKey('fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry');

export interface DepositServiceResult {
    success: boolean;
    error?: string;
    signature?: string;
}

export interface UserBalance {
    balance: number;
    decimalized: number;
}

/**
 * Service for handling Solana deposit transactions
 */
export class DepositService {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Get user's token balance from their wallet
     * @param userWallet - User's public key
     * @param mint - Token mint address (defaults to USD_MINT)
     * @returns Promise<UserBalance>
     */
    async getUserBalance(
        userWallet: PublicKey,
        mint?: PublicKey,
    ): Promise<UserBalance> {
        try {
            const mintToUse = mint || USD_MINT;
            console.log('🔍 Debugging getUserBalance call:');
            console.log('  - Connection:', this.connection);
            console.log('  - User wallet pubkey:', userWallet.toString());
            console.log('  - Mint address:', mintToUse.toString());

            const balance = await getUserTokenBalance(
                this.connection,
                userWallet,
                mintToUse,
            );

            console.log('  - Raw balance from SDK:', balance);
            console.log('  - Balance type:', typeof balance);

            // Convert from non-decimalized to decimalized (divide by 10^6)
            const decimalized = Number(balance) / Math.pow(10, 6);

            console.log('  - Decimalized balance:', decimalized);

            const result = {
                balance: Number(balance),
                decimalized,
            };

            console.log('  - Final result:', result);

            return result;
        } catch (error) {
            console.error('❌ Error fetching user balance:', error);
            console.error('Error details:', {
                message:
                    error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack trace',
                userWallet: userWallet.toString(),
                mint: mint?.toString(),
            });
            throw new Error(`Failed to fetch user balance: ${error}`);
        }
    }

    /**
     * Validate deposit amount meets minimum requirements
     * @param amount - Deposit amount in decimalized form
     * @returns validation result
     */
    validateDepositAmount(amount: number): {
        isValid: boolean;
        message?: string;
    } {
        if (amount < 10) {
            return {
                isValid: false,
                message: 'Minimum deposit value is $10',
            };
        }
        return { isValid: true };
    }

    /**
     * Build a deposit margin transaction
     * @param amount - Amount to deposit (in decimalized form)
     * @param user - User's public key
     * @returns Promise<Transaction>
     */
    async buildDepositTransaction(
        amount: number,
        user: PublicKey,
    ): Promise<Transaction> {
        try {
            // Convert decimalized amount to non-decimalized (multiply by 10^6)
            const nonDecimalizedAmount = BigInt(
                Math.floor(amount * Math.pow(10, 6)),
            );

            const transaction = await buildDepositMarginTx(
                this.connection,
                nonDecimalizedAmount,
                user,
            );

            return transaction;
        } catch (error) {
            console.error('Error building deposit transaction:', error);
            throw new Error(`Failed to build deposit transaction: ${error}`);
        }
    }

    /**
     * Execute a deposit by building and sending the transaction
     * @param amount - Amount to deposit (in decimalized form)
     * @param user - User's public key
     * @param sendTransaction - Function to send the transaction (from Fogo session)
     * @returns Promise<DepositServiceResult>
     */
    async executeDeposit(
        amount: number,
        user: PublicKey,
        sendTransaction: (instructions: any[]) => Promise<any>,
    ): Promise<DepositServiceResult> {
        try {
            // Validate amount first
            const validation = this.validateDepositAmount(amount);
            if (!validation.isValid) {
                notificationService.showDepositError(
                    validation.message || 'Invalid deposit amount',
                );
                return {
                    success: false,
                    error: validation.message,
                };
            }

            // Show pending notification
            notificationService.showTransactionPending({ amount });

            // Build the transaction
            const transaction = await this.buildDepositTransaction(
                amount,
                user,
            );

            // Extract instructions from the transaction
            const instructions = transaction.instructions;

            // Send the transaction
            const result = await sendTransaction(instructions);

            const signature = result?.signature || result;

            // Show success notification
            notificationService.showDepositSuccess({
                amount,
                signature,
                token: 'USD',
            });

            return {
                success: true,
                signature,
            };
        } catch (error) {
            console.error('Error executing deposit:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';

            // Show error notification
            notificationService.showDepositError(errorMessage);

            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}
