import PortfolioDeposit from '~/components/Portfolio/PortfolioDeposit/PortfolioDeposit';
import styles from './testpage.module.css';

export default function testpage() {
    return (
        <div className={styles.testpage}>
            <PortfolioDeposit
                portfolio={{
                    id: 'portfolio_deposit_testpage',
                    name: 'sample_portfolio',
                    availableBalance: 83,
                }}
                onDeposit={() => {}}
                onClose={() => {}}
            />
        </div>
    );
}
