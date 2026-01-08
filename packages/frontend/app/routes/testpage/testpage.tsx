import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import { Fuul, UserIdentifierType } from '@fuul/sdk';
import { useReferralStore } from '~/stores/ReferralStore';

export default function testpage() {
    const sessionState = useSession();
    const referralStore = useReferralStore();

    const handleClick = async () => {
        if (!isEstablished(sessionState)) {
            console.warn('Session not established');
            return;
        }

        const userWalletKey =
            sessionState.walletPublicKey || sessionState.sessionPublicKey;

        if (!userWalletKey) {
            console.warn('No wallet key available');
            return;
        }

        try {
            // Create a dynamic message with current date
            const currentDate = new Date().toISOString().split('T')[0];
            const message = `Accept affiliate code ${referralStore.cached} on ${currentDate}`;

            // Convert message to Uint8Array
            const messageBytes = new TextEncoder().encode(message);

            // Get the signature from the session
            const signatureBytes =
                await sessionState.solanaWallet.signMessage(messageBytes);

            // Convert the signature to base64
            const signatureArray = Array.from(new Uint8Array(signatureBytes));
            const binaryString = String.fromCharCode.apply(
                null,
                signatureArray,
            );
            const signature = btoa(binaryString);

            // Call the Fuul SDK to identify the user
            try {
                const response = await Fuul.identifyUser({
                    identifier: userWalletKey.toString(),
                    identifierType: UserIdentifierType.SolanaAddress,
                    signature,
                    signaturePublicKey: userWalletKey.toString(),
                    message,
                });
                console.log('Fuul.identifyUser successful:', response);
            } catch (error: any) {
                console.error('Detailed error in identifyUser:', {
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers,
                    },
                });
                throw error;
            }
        } catch (error) {
            console.error('Error in identifyUser:', error);
        }
    };

    const userWalletKey = isEstablished(sessionState)
        ? sessionState.walletPublicKey || sessionState.sessionPublicKey
        : null;

    return (
        <div style={{ padding: '2rem' }}>
            <button
                onClick={handleClick}
                style={{
                    padding: '12px 24px',
                    background: '#6b8eff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                Send FUUL Identify User Event
            </button>
            <p style={{ marginTop: '1rem', color: '#888' }}>
                Connected wallet: {userWalletKey?.toString() || 'None'}
            </p>
            <p style={{ color: '#888' }}>
                Referral code: {referralStore.cached || 'None'}
            </p>
        </div>
    );
}
