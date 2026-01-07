import { useUserDataStore } from '~/stores/UserDataStore';

const TEMP_FUUL_API_KEY =
    'ae8178229c5e89378386e6f6535c12212b12693dab668eb4dc9200600ae698b6';

async function sendFuulConnectWallet(walletAddress: string): Promise<void> {
    const trackingId = localStorage.getItem('fuul.tracking_id') || '';
    const ENDPOINT = 'https://api.fuul.xyz/api/v1/events';

    const payload = {
        metadata: {
            tracking_id: trackingId,
        },
        name: 'connect_wallet',
        user: {
            identifier: walletAddress,
            identifier_type: 'solana_address',
        },
    };

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEMP_FUUL_API_KEY}`,
    };

    console.log('FUUL connect_wallet request:', {
        url: ENDPOINT,
        payload,
        headers,
    });

    const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    console.log('FUUL connect_wallet response:', response);
}

export default function testpage() {
    const userDataStore = useUserDataStore();
    const userAddress = userDataStore.userAddress;

    const handleClick = () => {
        if (!userAddress) {
            console.warn('No wallet connected');
            return;
        }
        sendFuulConnectWallet(userAddress.toString());
    };

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
                Send FUUL Connect Wallet Event
            </button>
            <p style={{ marginTop: '1rem', color: '#888' }}>
                Connected wallet: {userAddress?.toString() || 'None'}
            </p>
        </div>
    );
}
