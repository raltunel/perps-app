import SimpleButton from '~/components/SimpleButton/SimpleButton';
import styles from './ReferralCodeModal.module.css';
import { useNavigate } from 'react-router';

interface PropsIF {
    close: () => void;
}

export default function ReferralCodeModal(props: PropsIF) {
    const { close } = props;

    const navigate = useNavigate();
    return (
        <section className={styles.referral_code_modal}>
            <p>
                Your referral code is REF_CODE_HERE for this wallet address. Do
                you wish to confirm?
            </p>
            <div className={styles.button_container}>
                <SimpleButton>Confirm</SimpleButton>
                <SimpleButton
                    onClick={(): void => {
                        close();
                        navigate('/v2/referrals');
                    }}
                >
                    Details
                </SimpleButton>
            </div>
        </section>
    );
}
