import { useRef } from 'react';
import styles from './CreateSubaccount.module.css';
import { MdOutlineClose } from 'react-icons/md';
import Modal from '~/components/Modal/Modal';
import type { useModalIF } from '~/hooks/useModal';

interface propsIF {
    modalControl: useModalIF;
}

export default function CreateSubaccount(props: propsIF) {
    const { modalControl } = props;

    // ref to hold input when user enters the 
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Modal close={modalControl.close}>
            <div className={styles.create_sub_account_modal}>
                <header>
                    <div style={{ width: '20px' }}/>
                    <h3>Create Sub-Account</h3>
                    <MdOutlineClose
                        size={20}
                        onClick={modalControl.close}
                        style={{ cursor: 'pointer' }}
                        color='var(--text2)'
                    />
                </header>
                <div className={styles.text_entry}>
                    <div>Name</div>
                    <input
                        type='text'
                        placeholder='eg: My Sub-Account 1'
                        ref={inputRef}
                    />
                </div>
                <div className={styles.modal_buttons}>
                    <button
                        onClick={modalControl.close}
                    >
                        Cancel
                    </button>
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