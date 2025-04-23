import AccountsTable from './AccountsTable/AccountsTable';
import styles from './subaccounts.module.css';
import { useModal, type useModalIF } from '~/hooks/useModal';
import Button from '~/components/Button/Button';
import CreateSubaccount from './CreateSubaccount/CreateSubaccount';

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
                    tabId='table_1'
                    noSort
                />
                <AccountsTable
                    title='Sub-Accounts'
                    accounts={accounts.sub}
                    tabId='table_2'
                />
            </div>
            {createSubaccountModal.isOpen && (
                <CreateSubaccount modalControl={createSubaccountModal} />
            )}
        </div>
    );
}
