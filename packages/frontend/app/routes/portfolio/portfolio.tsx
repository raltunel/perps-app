import { memo } from 'react';
import type { Route } from '../../+types/root';
import TradeTable from '~/components/Trade/TradeTables/TradeTables';
import styles from './portfolio.module.css';
import { Link } from 'react-router';
import PerformancePanel from '~/components/Portfolio/PerformancePanel/PerformancePanel';
import Modal from '~/components/Modal/Modal';
import { lazy, Suspense } from 'react';
import { usePortfolioManager } from './usePortfolioManager';
import { useModal, type useModalIF } from '~/hooks/useModal';

const PortfolioDeposit = lazy(
    () => import('~/components/Portfolio/PortfolioDeposit/PortfolioDeposit'),
);
const PortfolioWithdraw = lazy(
    () => import('~/components/Portfolio/PortfolioWithdraw/PortfolioWithdraw'),
);
const PortfolioSend = lazy(
    () => import('~/components/Portfolio/PortfolioSend/PortfolioSend'),
);

const MemoizedPerformancePanel = memo(PerformancePanel);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meta(args: Route.MetaArgs) {
    return [
        { title: 'Perps - Portfolio' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

function Portfolio() {
    const {
        portfolio,
        selectedPortfolio,
        isProcessing,
        modalState,
        formatCurrency,
        openModal,
        closeModal,
        processDeposit,
        processWithdraw,
        processSend,
    } = usePortfolioManager();

    // logic to open and close the fee schedule modal
    const feeScheduleModalCtrl: useModalIF = useModal('closed');

    return (
        <>
            <div className={styles.container}>
                <header>Portfolio</header>
                <div className={styles.column}>
                    <div className={styles.detailsContainer}>
                        <div className={styles.detailsContent}>
                            <h6>14 Day Volume</h6>
                            <h3>
                                {formatCurrency(
                                    portfolio.tradingVolume.biWeekly,
                                )}
                            </h3>
                            <Link to='/'>View volume</Link>
                        </div>
                        <div className={styles.detailsContent}>
                            <h6>Fees (Taker / Maker)</h6>
                            <h3>
                                {portfolio.fees.taker}% / {portfolio.fees.maker}
                                %
                            </h3>
                            {/* <Link to='/'>View fee schedule</Link> */}
                            <div onClick={feeScheduleModalCtrl.open}>
                                View fee schedule
                            </div>
                        </div>
                        <div
                            className={`${styles.detailsContent} ${styles.netValueMobile}`}
                        >
                            <h6>Total Net USD Value</h6>
                            <h3>{formatCurrency(portfolio.totalValueUSD)}</h3>
                        </div>
                        <div className={styles.totalNetDisplay}>
                            <h6>
                                <span>Total Net USD Value:</span>{' '}
                                {formatCurrency(portfolio.totalValueUSD)}
                            </h6>
                            <div className={styles.rowButton}>
                                <button onClick={() => openModal('deposit')}>
                                    Deposit
                                </button>
                                <button onClick={() => openModal('withdraw')}>
                                    Withdraw
                                </button>
                                <button
                                    onClick={() => openModal('send')}
                                    className={styles.sendMobile}
                                >
                                    Send
                                </button>
                            </div>
                            <button
                                onClick={() => openModal('send')}
                                className={styles.sendDesktop}
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    <section className={styles.mainContent}>
                        <MemoizedPerformancePanel />

                        <div className={styles.table}>
                            <TradeTable />
                        </div>
                    </section>
                </div>
            </div>

            {modalState.isOpen && selectedPortfolio && (
                <Modal close={closeModal} position='center'>
                    <Suspense fallback={<div>Loading...</div>}>
                        {modalState.content === 'deposit' && (
                            <PortfolioDeposit
                                portfolio={{
                                    id: selectedPortfolio.id,
                                    name: selectedPortfolio.name,
                                    availableBalance:
                                        selectedPortfolio.availableBalance,
                                    unit: selectedPortfolio.unit,
                                }}
                                onDeposit={processDeposit}
                                onClose={closeModal}
                                isProcessing={isProcessing}
                            />
                        )}

                        {modalState.content === 'withdraw' && (
                            <PortfolioWithdraw
                                portfolio={{
                                    id: selectedPortfolio.id,
                                    name: selectedPortfolio.name,
                                    availableBalance:
                                        selectedPortfolio.availableBalance,
                                    unit: selectedPortfolio.unit,
                                }}
                                onWithdraw={processWithdraw}
                                onClose={closeModal}
                                isProcessing={isProcessing}
                            />
                        )}

                        {modalState.content === 'send' && (
                            <PortfolioSend
                                availableAmount={
                                    selectedPortfolio.availableBalance
                                }
                                tokenType={selectedPortfolio.unit}
                                networkFee={
                                    selectedPortfolio.unit === 'USD'
                                        ? '$0.001'
                                        : '0.0001 BTC'
                                }
                                onSend={processSend}
                                onClose={closeModal}
                                isProcessing={isProcessing}
                                portfolio={{
                                    id: selectedPortfolio.id,
                                    name: selectedPortfolio.name,
                                    availableBalance:
                                        selectedPortfolio.availableBalance,
                                    unit: selectedPortfolio.unit,
                                }}
                            />
                        )}
                    </Suspense>
                </Modal>
            )}
            { feeScheduleModalCtrl.isOpen &&
                <Modal close={feeScheduleModalCtrl.close}>
                    This is the feel schedule modal!
                </Modal>
            }
        </>
    );
}

export default memo(Portfolio);
