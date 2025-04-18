import Button from '~/components/Button/Button';
import AccountsTable from './AccountsTable/AccountsTable';
import styles from './subaccounts.module.css';
import Modal from '~/components/Modal/Modal';
import { useModal, type useModalIF } from '~/hooks/useModal';
import { MdOutlineClose } from 'react-icons/md';
import { useRef } from 'react';

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
                    <div>
                        <header>
                            <></>
                            <h3>Create Sub-Account</h3>
                            <MdOutlineClose
                                size={20}
                                onClick={createSubaccountModal.close}
                                style={{ cursor: 'pointer' }}
                            />
                        </header>
                        <div>
                            <div>Name</div>
                            <input
                                type='text'
                                placeholder='eg: My Sub-Account 1'
                                ref={inputRef}
                            />
                        </div>
                        <div>
                            <Button
                                size='medium'
                                onClick={createSubaccountModal.close}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='medium'
                                onClick={() => {
                                    // Log the input value
                                    if (inputRef.current) {
                                        console.log(inputRef.current.value);
                                    }
                                    // Close the modal
                                    createSubaccountModal.close();
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    );
}
