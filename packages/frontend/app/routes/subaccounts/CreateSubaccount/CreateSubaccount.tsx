import { useRef } from 'react';
import styles from './CreateSubaccount.module.css';
import Modal from '~/components/Modal/Modal';
import type { useModalIF } from '~/hooks/useModal';
import { useKeydown } from '~/hooks/useKeydown';
import {
    useNotificationStore,
    type NotificationStoreIF,
} from '~/stores/NotificationStore';
import SimpleButton from '~/components/SimpleButton/SimpleButton';

// interface for functional component props
interface propsIF {
    modalControl: useModalIF;
    create: (a: string) => void;
}

// main react functional component
export default function CreateSubaccount(props: propsIF) {
    const { modalControl, create } = props;

    // ref to hold input field until form submission
    const inputRef = useRef<HTMLInputElement>(null);

    // string to link `<label>` and `<input>` fields
    const INPUT_ID_FOR_DOM = 'create_subaccount_input_field';

    // logic to dispatch a notification for sub-account creation
    const notifications: NotificationStoreIF = useNotificationStore();

    // fn to handle subaccount creation
    function createSubaccount(): void {
        if (inputRef.current) {
            const text: string = inputRef.current.value;
            if (text.length) {
                create(inputRef.current.value);
                notifications.add({
                    title: 'Sub Account Created',
                    message: inputRef.current.value,
                    icon: 'check',
                });
            }
        }
        modalControl.close();
    }

    // trigger subaccount creation when user presses the `Enter` key
    useKeydown('Enter', createSubaccount);

    // JSX return
    return (
        <Modal title='Create Sub-Account' close={modalControl.close}>
            <div className={styles.create_sub_account_modal}>
                <div className={styles.text_entry}>
                    <label htmlFor={INPUT_ID_FOR_DOM}>Name</label>
                    <input
                        id={INPUT_ID_FOR_DOM}
                        type='text'
                        autoComplete='off'
                        placeholder='eg: My Sub-Account 1'
                        ref={inputRef}
                    />
                </div>
                <div className={styles.modal_buttons}>
                    <SimpleButton bg='dark4' onClick={modalControl.close}>
                        Cancel
                    </SimpleButton>
                    <SimpleButton bg='accent1' onClick={createSubaccount}>
                        Confirm
                    </SimpleButton>
                </div>
            </div>
        </Modal>
    );
}
