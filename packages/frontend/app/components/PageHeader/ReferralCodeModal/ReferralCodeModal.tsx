import SimpleButton from '~/components/SimpleButton/SimpleButton';
import styles from './ReferralCodeModal.module.css';

export default function ReferralCodeModal() {
    return (
        <section className={styles.referral_code_modal}>
            <p>
                Your referral code is REF_CODE_HERE for this wallet address. Do
                you wish to confirm?
            </p>
            <div className={styles.button_container}>
                <SimpleButton>Confirm</SimpleButton>
                <SimpleButton>Details</SimpleButton>
            </div>
        </section>
    );
}
