import CodeTabs from '~/components/Referrals/CodeTabs/CodeTabs';
import ReferralsTabs from '~/components/Referrals/ReferralsTabs/ReferralsTabs';
import styles from './referrals.module.css';
import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import { useUserDataStore } from '~/stores/UserDataStore';
// import styles from './referrals.module.css'
// export function meta({}: Route.MetaArgs) {
export function meta() {
    return [
        { title: 'Referrals | Ambient' },
        { name: 'description', content: 'Trade Perps with Ambient' },
    ];
}

// export default function Referrals({ loaderData }: Route.ComponentProps) {
export default function Referrals() {
    const sessionState = useSession();
    const isUserConnected = isEstablished(sessionState);
    const userDataStore = useUserDataStore();

    async function handleConfirm() {
        if (isUserConnected) {
            await userDataStore.confirmRefCode(
                sessionState.walletPublicKey,
                sessionState.signMessage,
            );
        }
    }

    return (
        <div className={styles.container}>
            <header>
                Referrals
                <p>
                    Refer users to earn rewards. Affiliates earn greater
                    rewards. <a href='#'>Learn More</a>
                </p>
            </header>
            <div className={styles.detailsContainer}>
                <div className={styles.detailsContent}>
                    <h6>Traders Referred</h6>
                    <h3>0</h3>
                </div>
                <div className={styles.detailsContent}>
                    <h6>Rewards Earned</h6>
                    <h3>$0.00</h3>
                </div>
            </div>
            <section className={styles.tableContainer}>
                <CodeTabs />
                <ReferralsTabs />
            </section>
            <button onClick={handleConfirm}>Confirm Referral Code</button>
        </div>
    );
}
