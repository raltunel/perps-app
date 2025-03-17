import styles from './testpage.module.css';
import { type useModalIF, useModal } from "~/hooks/useModal";
import Notification from '~/components/Notifications/Notification';

interface propsIF {

}

interface notificationMetaIF {
    title: string;
    messages: string[],
    icon: 'spinner'|'check';
}

const notificationMeta: notificationMetaIF[] = [
    {
        title: 'Leverage Mode Changed',
        messages: [
            'Switched to Isolated Margin Mode',
            'Switched to 100x Leverage',
        ],
        icon: 'check',
    },
    {
        title: 'Sub Account Created',
        messages: [
            'Sub Account 1 Created'
        ],
        icon: 'check',
    },
    
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
