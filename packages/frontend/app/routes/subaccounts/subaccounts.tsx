import AccountsTable from './AccountsTable/AccountsTable';
import styles from './subaccounts.module.css';
import { useModal, type useModalIF } from '~/hooks/useModal';
import Button from '~/components/Button/Button';
import CreateSubaccount from './CreateSubaccount/CreateSubaccount';
import { useAccounts, type useAccountsIF } from '~/stores/AccountsStore';

export default function subaccounts() {
    // logic to open and close subaccount creation modal
    const createSubaccountModal: useModalIF = useModal('closed');

    // state data for subaccounts
    const data: useAccountsIF = useAccounts();

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
                    accounts={[data.master]}
                    tabId='table_1'
                    noSort
                />
                <AccountsTable
                    title='Sub-Accounts'
                    accounts={data.sub}
                    tabId='table_2'
                />
            </div>
            {createSubaccountModal.isOpen && (
                <CreateSubaccount
                    modalControl={createSubaccountModal}
                    create={data.create}
                />
            )}
        </div>
    );
}
