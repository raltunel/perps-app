import SimpleButton from '~/components/SimpleButton/SimpleButton';
import styles from './ReferralCodeModal.module.css';
import { useNavigate } from 'react-router';

interface PropsIF {
    close: () => void;
    refCode: string;
    handleConfirm: () => void;
}

export default function ReferralCodeModal(props: PropsIF) {
    const { close, refCode, handleConfirm } = props;

    const navigate = useNavigate();
    return (
        <section className={styles.referral_code_modal}>
            <p>
                You have been referred by{' '}
                <span className={styles.referral_code_inline}>{refCode}</span>{' '}
                to Ambient Perps.
            </p>
            <p>
                Using a referral code will grant incentives to both you and the
                referrer.
            </p>
            <div className={styles.button_container}>
                <SimpleButton onClick={handleConfirm}>Confirm</SimpleButton>
                <SimpleButton
                    bg='dark4'
                    onClick={(): void => {
                        close();
                        navigate('/v2/referrals');
                    }}
                >
                    Edit
                </SimpleButton>
            </div>
        </section>
    );
}
