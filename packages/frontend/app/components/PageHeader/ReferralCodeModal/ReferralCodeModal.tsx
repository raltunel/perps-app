import SimpleButton from '~/components/SimpleButton/SimpleButton';
import styles from './ReferralCodeModal.module.css';
import { useNavigate } from 'react-router';

interface PropsIF {
    refCode: string;
    isRefCodeValidated: boolean;
    handleConfirm: (rc: string) => void;
    handleCancel: () => void;
    close: () => void;
}

export default function ReferralCodeModal(props: PropsIF) {
    const { refCode, isRefCodeValidated, handleConfirm, handleCancel, close } =
        props;

    const navigate = useNavigate();

    return (
        <section className={styles.referral_code_modal}>
            {isRefCodeValidated ? (
                <p>
                    You have been referred by{' '}
                    <span className={styles.referral_code_inline}>
                        {refCode}
                    </span>{' '}
                    to Ambient Perps.
                </p>
            ) : (
                <p>
                    You have been referred by{' '}
                    <span className={styles.referral_code_inline}>
                        {refCode}
                    </span>{' '}
                    to Ambient Perps but this code does not appear to be valid.
                    Would you like to update?
                </p>
            )}
            <p>
                Using a valid referral code will grant incentives to both you
                and the referrer.
            </p>
            <div className={styles.button_container}>
                {isRefCodeValidated ? (
                    <>
                        <SimpleButton
                            onClick={(): void => handleConfirm(refCode)}
                        >
                            Confirm
                        </SimpleButton>
                        <SimpleButton
                            bg='dark4'
                            onClick={(): void => {
                                navigate('/v2/referrals');
                                close();
                            }}
                        >
                            Edit
                        </SimpleButton>
                    </>
                ) : (
                    <>
                        <SimpleButton
                            bg='dark4'
                            onClick={(): void => {
                                navigate('/v2/referrals');
                                close();
                            }}
                        >
                            Edit
                        </SimpleButton>

                        <SimpleButton bg='dark4' onClick={handleCancel}>
                            Cancel
                        </SimpleButton>
                    </>
                )}
            </div>
        </section>
    );
}
