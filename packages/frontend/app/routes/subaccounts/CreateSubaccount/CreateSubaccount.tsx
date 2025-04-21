import { useRef } from 'react';
import styles from './CreateSubaccount.module.css';
import { MdOutlineClose } from 'react-icons/md';
import Modal from '~/components/Modal/Modal';
import type { useModalIF } from '~/hooks/useModal';

// interface for functional component props
interface propsIF {
    modalControl: useModalIF;
}

// main react functional component
export default function CreateSubaccount(props: propsIF) {
    const { modalControl } = props;

    // ref to hold input field until form submission
    const inputRef = useRef<HTMLInputElement>(null);

    // string to link `<label>` and `<input>` fields
    const INPUT_ID_FOR_DOM = 'create_subaccount_input_field';

    // centralize icon size to keep <header> horizontally centered
    const CLOSE_ICON_SIZE = 20;

    // JSX return
    return (
        <Modal close={modalControl.close}>
            <div className={styles.create_sub_account_modal}>
                <header>
                    {/* empty <div> below is just for spacing */}
                    <div style={{ width: CLOSE_ICON_SIZE + 'px' }} />
                    <h3>Create Sub-Account</h3>
                    <MdOutlineClose
                        size={CLOSE_ICON_SIZE}
                        onClick={modalControl.close}
                        style={{ cursor: 'pointer' }}
                        color='var(--text2)'
                    />
                </header>
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
                    <button
                        onClick={() => {
                            if (inputRef.current) {
                                console.log(inputRef.current.value);
                            }
                            modalControl.close();
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
}
