import { useRef, useState } from 'react';
import styles from './CodeTabs.module.css';
import Tabs from '~/components/Tabs/Tabs';
import { motion } from 'framer-motion';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import { useUserDataStore } from '~/stores/UserDataStore';

interface Props {
    initialTab?: string;
}
const availableTabs = ['Enter Code', 'Create Code', 'Claim'];
export default function CodeTabs(props: Props) {
    const { initialTab = 'Enter Code' } = props;
    const [activeTab, setActiveTab] = useState(initialTab);

    const userData = useUserDataStore();

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const referralCodeInputRef = useRef<HTMLInputElement>(null);

    const enterCodeContent = (
        <section className={styles.sectionWithButton}>
            <div className={styles.enterCodeContent}>
                <h6>Enter a referral code</h6>
                <input
                    type='text'
                    defaultValue={userData.referralCode}
                    ref={referralCodeInputRef}
                />
                {userData.referralCode ? (
                    <p>
                        You are currently using{' '}
                        <span>{userData.referralCode}</span> as a referral code
                        for a fee reduction. Entering a new code will replace
                        the current code.
                    </p>
                ) : (
                    <p>
                        You are not using a referral code. Enter a referral code
                        for a discount on fees.
                    </p>
                )}
            </div>
            <SimpleButton
                bg='accent1'
                onClick={() => {
                    const value: string | undefined =
                        referralCodeInputRef.current?.value;
                    if (value) {
                        userData.setReferralCode(value);
                    }
                }}
            >
                Enter
            </SimpleButton>
        </section>
    );

    const createCodeContent = (
        <section className={styles.sectionWithButton}>
            <div className={styles.createCodeContent}>
                <p>Your code is DATAWALLET</p>
                <div className={styles.walletLink}>
                    <a href='#'>linktocode.com/join/datawallet</a>
                </div>
                <p>
                    You will receive <span>10%</span> of referred users fees and
                    they will receive a <span>4%</span> discount. See the Docs
                    for more.
                </p>
            </div>
            <SimpleButton bg='accent1'>Enter</SimpleButton>
        </section>
    );
    const claimContent = (
        <section className={styles.sectionWithButton}>
            <div className={styles.claimContent}>
                <p>Claim $0.00 in rewards</p>
            </div>
            <SimpleButton bg='accent1'>Enter</SimpleButton>
        </section>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Enter Code':
                return enterCodeContent;
            case 'Create Code':
                return createCodeContent;
            case 'Claim':
                return claimContent;
            default:
                return (
                    <div className={styles.emptyState}>
                        Select a tab to view data
                    </div>
                );
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <Tabs
                tabs={availableTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                wrapperId='codeTabs'
                layoutIdPrefix='codeTabIndicator'
                flex
            />
            <motion.div
                className={styles.tableContent}
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {renderTabContent()}
            </motion.div>
        </div>
    );
}
