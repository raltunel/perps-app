import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './ShareModal.module.css';

interface propsIF {
    close: () => void;
}

export default function ShareModal(props: propsIF) {
    const { close } = props;

    const REFERRAL_CODE = '0x1';

    return (
        <Modal title='' close={close}>
            <div className={styles.share_modal}>
                <div
                    className={styles.picture_overlay}
                    
                >

                </div>
                <div className={styles.info}>
                    <div className={styles.referral_code}>
                        <div>Referral Code:</div>
                        <div>{REFERRAL_CODE}</div>
                    </div>
                    <div className={styles.custom_text}>Customize your text</div>
                    <div className={styles.message}>Trade $BTC Perps seamlessly on @AmbientPerps using my referral code</div>
                    <div className={styles.button_bank}>
                        <Button size='medium'>Save Image</Button>
                        <Button size='medium'>Copy Link</Button>
                        <Button size='medium'>Share on X</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}