import PortfolioTable from '../portfolio/components/PortfolioTable';
import styles from './subaccounts.module.css';

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
            name: 'Sub-Account 2',
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
            name: 'Sub-Account 5',
            address: '0x0000000000000000000000000000000000000000',
            equity: '$0.00',
        },
    ],
};

export default function subaccounts() {
    return (
        <>
            <div className={styles.subaccounts}>
                This is the sub accounts page
            </div>
            <PortfolioTable
                title='Master Account'
                accounts={[accounts.master]}
            />
            <PortfolioTable title='Sub-Accounts' accounts={accounts.sub} />
        </>
    );
}
