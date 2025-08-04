import PortfolioWithdraw from '~/components/Portfolio/PortfolioWithdraw/PortfolioWithdraw';
import styles from './testpage.module.css';

export default function testpage() {
    return (
        <div className={styles.testpage}>
            <PortfolioWithdraw
                portfolio={{
                    id: 'portfolio_deposit_testpage',
                    name: 'sample_portfolio',
                    availableBalance: 83,
                }}
                onWithdraw={() => {}}
                onClose={() => {}}
            />
        </div>
    );
}
