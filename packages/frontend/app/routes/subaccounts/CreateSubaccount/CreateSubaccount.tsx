import { useRef } from 'react';
import styles from './CreateSubaccount.module.css';
import Modal from '~/components/Modal/Modal';
import type { useModalIF } from '~/hooks/useModal';

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

    function createSubaccount(): void {
        if (inputRef.current) {
            create(inputRef.current.value);
        }
        modalControl.close();
    }

    // JSX return
    return (
        <Modal title='Create Sub-Account' close={modalControl.close}>
            <div className={styles.create_sub_account_modal}>
                <div className={styles.text_entry}>
                    <label htmlFor={INPUT_ID_FOR_DOM}>Name</label>
                    <input
                        id={INPUT_ID_FOR_DOM}
                        type='text'
                        placeholder='eg: My Sub-Account 1'
                        ref={inputRef}
                    />
                </div>
                <div className={styles.modal_buttons}>
                    <button onClick={modalControl.close}>Cancel</button>
                    <button onClick={createSubaccount}>Confirm</button>
                </div>
            </div>
        </Modal>
    );
}
