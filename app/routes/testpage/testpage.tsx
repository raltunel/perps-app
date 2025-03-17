import styles from './testpage.module.css';
import { type useModalIF, useModal } from "~/hooks/useModal";
import Notification from '~/components/Notifications/Notification';

interface propsIF {

}

const notificationTexts = [
    
];

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const modalControl: useModalIF = useModal('closed');

    return (
        <div className={styles.testpage}>
            {/* interactable to open modal on user action */}
            <button onClick={() => modalControl.open()}>Open Modal</button>
            {/* format to insantiate modal in the DOM */}
            { modalControl.isOpen &&
                <Notification
                    status={'pending'}
                    dismiss={modalControl.close}
                />
            }
        </div>
    );
}
