import AccountsTable from './AccountsTable/AccountsTable';
import styles from './subaccounts.module.css';
import Modal from '~/components/Modal/Modal';
import { useModal, type useModalIF } from '~/hooks/useModal';
import { MdOutlineClose } from 'react-icons/md';
import { useRef } from 'react';
import Button from '~/components/Button/Button';

export interface accountIF {
    name: string;
    address: string;
    equity: string;
}

export interface allAccountsIF {
    master: accountIF;
    sub: accountIF[];
}

const accounts: allAccountsIF = {
    master: {
        name: 'Master Account',
        address: '0x0000000000000000000000000000000000000000',
        equity: '$0.00',
    },
    sub: [
        {
            name: 'Sub-Account 1',
            address: '0x0000000000000000000000000000000000000000',
            equity: '$0.00',
        },
        {
            name: 'Sub-Account 5',
            address: '0x0000000000000000000000000000000000000000',
            equity: '$0.00',
        },
        {
            name: 'Sub-Account 3',
            address: '0x0000000000000000000000000000000000000000',
            equity: '$0.00',
        },
        {
            name: 'Sub-Account 4',
            address: '0x0000000000000000000000000000000000000000',
            equity: '$0.00',
        },
        {
            name: 'Sub-Account 2',
            address: '0x0000000000000000000000000000000000000000',
            equity: '$0.00',
        },
    ],
};

export default function subaccounts() {
    const createSubaccountModal: useModalIF = useModal('closed');

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={styles.subaccounts}>
            <div className={styles.subaccounts_wrapper}>
            <header>
                <h2>Sub-Accounts</h2>
                <Button
                    size='medium'
                    selected={true}
                    onClick={createSubaccountModal.open}
                >
                    Create Sub-Account
                </Button>
            </header>
            <AccountsTable
                title='Master Account'
                accounts={[accounts.master]}
            />
            <AccountsTable
                title='Sub-Accounts'
                accounts={accounts.sub}
            />
            </div>
            { createSubaccountModal.isOpen && 
                <Modal close={createSubaccountModal.close}>
                    <div className={styles.create_sub_account_modal}>
                        <header>
                            <div style={{ width: '20px' }}/>
                            <h3>Create Sub-Account</h3>
                            <MdOutlineClose
                                size={20}
                                onClick={createSubaccountModal.close}
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
                                onClick={createSubaccountModal.close}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (inputRef.current) {
                                        console.log(inputRef.current.value);
                                    }
                                    createSubaccountModal.close();
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    );
}
