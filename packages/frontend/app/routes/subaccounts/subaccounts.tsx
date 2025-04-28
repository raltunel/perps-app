import { useState } from 'react';
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

class Account implements accountIF {
    name: string;
    address: string;
    equity: string;
    constructor(n: string, a: string, e: string) {
        this.name = n;
        this.address = a;
        this.equity = e;
    }
}

export interface allAccountsIF {
    master: accountIF;
    sub: accountIF[];
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_DOLLARS = '$0.00';

const accounts: allAccountsIF = {

    master: new Account('Master Account', ZERO_ADDRESS, ZERO_DOLLARS),
    sub: [
        new Account('Sub-Account 1', ZERO_ADDRESS, ZERO_DOLLARS),
        new Account('Sub-Account 5', ZERO_ADDRESS, ZERO_DOLLARS),
        new Account('Sub-Account 2', ZERO_ADDRESS, ZERO_DOLLARS),
        new Account('Sub-Account 3', ZERO_ADDRESS, ZERO_DOLLARS),
        new Account('Sub-Account 4', ZERO_ADDRESS, ZERO_DOLLARS),
    ],
};

export default function subaccounts() {
    const createSubaccountModal: useModalIF = useModal('closed');

    const [subaccounts, setSubaccounts] = useState<accountIF[]>(accounts.sub);
    function addAccount(n: string): void {
        setSubaccounts([
            ...subaccounts,
            new Account(n, ZERO_ADDRESS, ZERO_DOLLARS)
        ]);
    }

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
                    accounts={subaccounts}
                    tabId='table_2'
                />
            </div>
            {createSubaccountModal.isOpen && (
                <CreateSubaccount
                    modalControl={createSubaccountModal}
                    create={addAccount}
                />
            )}
        </div>
    );
}
