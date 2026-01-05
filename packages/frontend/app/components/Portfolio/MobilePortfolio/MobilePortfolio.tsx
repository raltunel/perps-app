import { memo } from 'react';
import { Link, useLocation } from 'react-router';
import PerformancePanel from '~/components/Portfolio/PerformancePanel/PerformancePanel';
import {
    IoArrowUp,
    IoArrowDown,
    IoChevronForward,
    IoChevronBack,
} from 'react-icons/io5';
import PortfolioTables from '~/components/Portfolio/PortfolioTable/PortfolioTable';
import AnimatedBackground from '~/components/AnimatedBackground/AnimatedBackground';

import useNumFormatter from '~/hooks/useNumFormatter';
import styles from './MobilePortfolio.module.css';
import WebDataConsumer from '~/routes/trade/webdataconsumer';
import { usePortfolioModals } from '~/routes/portfolio/usePortfolioModals';
import { usePortfolioManager } from '~/routes/portfolio/usePortfolioManager';

const MemoizedPerformancePanel = memo(PerformancePanel);

interface MobilePortfolioProps {
    userData: any;
    isLayoutReady: boolean;
    panelHeight: number;
}

function MobilePortfolio({
    userData,
    isLayoutReady,
    panelHeight,
}: MobilePortfolioProps) {
    const { portfolio, formatCurrency } = usePortfolioManager();
    const { formatNum } = useNumFormatter();
    const location = useLocation();

    const isTransactionsView = location.pathname.includes('/transactions');

    const { openDepositModal, openWithdrawModal, PortfolioModalsRenderer } =
        usePortfolioModals();

    // Extract user stats
    const userStats = userData?.data?.leaderboard?.[0];

    // Format stats
    const pnlFormatted = userStats?.pnl
        ? formatNum(userStats.pnl, 2, true, true)
        : '$0.00';
    const volumeFormatted = userStats?.volume
        ? formatNum(userStats.volume, 2, true, true)
        : '$0.00';
    const maxDrawdownFormatted = userStats?.maxDrawdown
        ? formatNum(userStats.maxDrawdown, 2)
        : '0.00%';
    const totalEquityFormatted = userStats?.account_value
        ? formatNum(userStats.account_value, 2, true, true)
        : '$0.00';
    const accountEquityFormatted = userStats?.account_value
        ? formatNum(userStats.account_value, 2, true, true)
        : '$0.00';
    const vaultEquityFormatted = userStats?.vaultEquity
        ? formatNum(userStats.vaultEquity)
        : '$0.00';

    // Calculate PNL
    const totalValue = portfolio.balances.contract + portfolio.balances.wallet;
    const pnlValue = userStats?.pnl ?? 0;
    const pnlPercent = totalValue > 0 ? (pnlValue / totalValue) * 100 : 0;
    const isPnlPositive = pnlValue >= 0;

    // ═══════════════════════════════════════════════════════════════════════
    // TRANSACTIONS VIEW
    // ═══════════════════════════════════════════════════════════════════════
    if (isTransactionsView) {
        return (
            <div className={styles.outer}>
                <div className={styles.container}>
                    <AnimatedBackground
                        mode='absolute'
                        layers={1}
                        opacity={1}
                        duration='15s'
                        strokeWidth='2'
                        palette={{
                            color1: '#1E1E24',
                            color2: '#7371FC',
                            color3: '#CDC1FF',
                        }}
                    />
                    <WebDataConsumer />

                    <header className={styles.header}>
                        <Link to='/v2/portfolio' className={styles.backLink}>
                            <IoChevronBack />
                            <span className={styles.breadcrumb}>
                                <span className={styles.breadcrumbParent}>
                                    Portfolio
                                </span>
                                <span className={styles.breadcrumbSeparator}>
                                    /
                                </span>
                                <span className={styles.breadcrumbCurrent}>
                                    Transactions
                                </span>
                            </span>
                        </Link>
                    </header>

                    <div className={styles.scrollContainer}>
                        <PortfolioTables
                            layout='stacked'
                            visibleSections={[
                                'common.positions',
                                'common.openOrders',
                                'common.balances',
                                'common.tradeHistory',
                                'common.orderHistory',
                                'common.depositsAndWithdrawals',
                            ]}
                        />
                    </div>
                </div>

                {PortfolioModalsRenderer}
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN PORTFOLIO VIEW
    // ═══════════════════════════════════════════════════════════════════════
    return (
        <div
            className={styles.outer}
            style={{ opacity: isLayoutReady ? 1 : 0 }}
        >
            <div className={styles.container}>
                <AnimatedBackground
                    mode='absolute'
                    layers={1}
                    opacity={1}
                    duration='15s'
                    strokeWidth='2'
                    palette={{
                        color1: '#1E1E24',
                        color2: '#7371FC',
                        color3: '#CDC1FF',
                    }}
                />
                <WebDataConsumer />

                <header className={styles.header}>Portfolio</header>

                <div className={styles.scrollContainer}>
                    {/* Hero Card */}
                    <section className={styles.heroCard}>
                        <div className={styles.heroLabel}>Total Net Value</div>
                        <div className={styles.heroValue}>
                            {formatCurrency(totalValue)}
                        </div>
                        <div
                            className={`${styles.heroPnl} ${isPnlPositive ? styles.positive : styles.negative}`}
                        >
                            <span className={styles.heroPnlIcon}>
                                {isPnlPositive ? (
                                    <IoArrowUp />
                                ) : (
                                    <IoArrowDown />
                                )}
                            </span>
                            {formatCurrency(Math.abs(pnlValue))} (
                            {isPnlPositive ? '+' : ''}
                            {pnlPercent.toFixed(2)}%)
                        </div>

                        <div className={styles.heroBalances}>
                            <div className={styles.heroBalanceItem}>
                                <span className={styles.heroBalanceLabel}>
                                    Contract
                                </span>
                                <span className={styles.heroBalanceValue}>
                                    {formatCurrency(
                                        portfolio.balances.contract,
                                    )}
                                </span>
                            </div>
                            <div className={styles.heroBalanceDivider} />
                            <div className={styles.heroBalanceItem}>
                                <span className={styles.heroBalanceLabel}>
                                    Wallet
                                </span>
                                <span className={styles.heroBalanceValue}>
                                    {formatCurrency(portfolio.balances.wallet)}
                                </span>
                            </div>
                            <div className={styles.heroBalanceDivider} />
                            <div className={styles.heroBalanceItem}>
                                <span className={styles.heroBalanceLabel}>
                                    Fees
                                </span>
                                <span className={styles.heroBalanceValue}>
                                    0.00%
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Performance Chart */}
                    <section className={styles.chartSection}>
                        {isLayoutReady && (
                            <MemoizedPerformancePanel
                                userData={userData}
                                panelHeight={panelHeight}
                                isMobile={true}
                            />
                        )}
                    </section>

                    {/* Stats */}
                    <section className={styles.statsSection}>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>PNL</span>
                            <span
                                className={`${styles.statValue} ${pnlValue >= 0 ? styles.positive : styles.negative}`}
                            >
                                {pnlFormatted}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>Volume</span>
                            <span className={styles.statValue}>
                                {volumeFormatted}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>
                                Max Drawdown
                            </span>
                            <span className={styles.statValue}>
                                {maxDrawdownFormatted}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>
                                Total Equity
                            </span>
                            <span className={styles.statValue}>
                                {totalEquityFormatted}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>
                                Account Equity
                            </span>
                            <span className={styles.statValue}>
                                {accountEquityFormatted}
                            </span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>
                                Vault Equity
                            </span>
                            <span className={styles.statValue}>
                                {vaultEquityFormatted}
                            </span>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <section className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${styles.primary}`}
                            onClick={openDepositModal}
                        >
                            Deposit
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.secondary}`}
                            onClick={openWithdrawModal}
                        >
                            Withdraw
                        </button>
                    </section>

                    {/* Stacked Tables */}
                    <section className={styles.tablesSection}>
                        <PortfolioTables
                            layout='stacked'
                            visibleSections={[
                                'common.positions',
                                'common.openOrders',
                                'common.balances',
                            ]}
                        />
                    </section>

                    {/* View All History Link */}
                    <Link
                        to='/v2/portfolio/transactions'
                        className={styles.viewAllLink}
                    >
                        <span>View All History</span>
                        <IoChevronForward />
                    </Link>
                </div>
            </div>

            {PortfolioModalsRenderer}
        </div>
    );
}

export default memo(MobilePortfolio);
