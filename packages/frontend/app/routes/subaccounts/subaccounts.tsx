import Button from '~/components/Button/Button';
import AccountsTable from './AccountsTable/AccountsTable';
import styles from './subaccounts.module.css';
import Modal from '~/components/Modal/Modal';
import { useModal, type useModalIF } from '~/hooks/useModal';

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
                        <h3>Good morning!</h3>
                    </Modal>
                }
            </div>
    );
}
