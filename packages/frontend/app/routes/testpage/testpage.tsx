import styles from './testpage.module.css';
import PortfolioDeposit from '~/components/Portfolio/PortfolioDeposit/PortfolioDeposit';

export default function testpage() {
    return (
        <div className={styles.testpage}>
            <PortfolioDeposit
                portfolio={{
                    id: 'portfolio_id',
                    name: 'my_portfolio',
                    availableBalance: 13,
                }}
                onDeposit={() => {}}
                onClose={() => {}}
            />
        </div>
    );
}
