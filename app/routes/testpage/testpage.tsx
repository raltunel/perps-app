import styles from './testpage.module.css';
import Modal from "~/components/Modal/Modal";
import { type useModalIF, useModal } from "~/hooks/useModal";
import Notification from '~/components/Notifications/Notification';
interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const modalControl: useModalIF = useModal('closed');

    return (
        <div className={styles.testpage}>
            {/* interactable to open modal on user action */}
            <button onClick={() => modalControl.open()}>Open Modal</button>
            {/* format to insantiate modal in the DOM */}
            {modalControl.isOpen && (
                <Modal close={modalControl.close}>
                    <Notification status={'pending'} />
                </Modal>
            )}
        </div>
    );
}
