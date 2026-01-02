import { memo, type MutableRefObject } from 'react';
import Modal from '~/components/Modal/Modal';
import PerformancePanel from '~/components/Portfolio/PerformancePanel/PerformancePanel';
import { useModal } from '~/hooks/useModal';
import { feeSchedules, type feeTierIF } from '~/utils/feeSchedule';
import styles from './DesktopPortfolio.module.css';

import SimpleButton from '~/components/SimpleButton/SimpleButton';
import Tooltip from '~/components/Tooltip/Tooltip';
import PortfolioTables from '~/components/Portfolio/PortfolioTable/PortfolioTable';
import AnimatedBackground from '~/components/AnimatedBackground/AnimatedBackground';
import { Resizable, type NumberSize } from 're-resizable';
import { usePortfolioManager } from '~/routes/portfolio/usePortfolioManager';
import { usePortfolioModals } from '~/routes/portfolio/usePortfolioModals';
import WebDataConsumer from '~/routes/trade/webdataconsumer';

const MemoizedPerformancePanel = memo(PerformancePanel);

interface DesktopPortfolioProps {
    userData: any;
    isLayoutReady: boolean;
    panelHeight: number;
    setPanelHeight: (height: number) => void;
    maxTop: number | null;
    startRef: MutableRefObject<number>;
    mainRef: MutableRefObject<HTMLDivElement | null>;
    setPortfolioPanelHeight: (height: number) => void;
    PANEL_MIN: number;
}

function DesktopPortfolio({
    userData,
    isLayoutReady,
    panelHeight,
    setPanelHeight,
    maxTop,
    startRef,
    mainRef,
    setPortfolioPanelHeight,
    PANEL_MIN,
}: DesktopPortfolioProps) {
    const { portfolio, formatCurrency } = usePortfolioManager();

    const {
        openDepositModal,
        openWithdrawModal,
        openSendModal,
        PortfolioModalsRenderer,
    } = usePortfolioModals();

    const feeScheduleModalCtrl = useModal('closed');

    const totalValue = portfolio.balances.contract + portfolio.balances.wallet;

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

                <header>Portfolio</header>

                <div className={styles.column}>
                    {/* Details Section */}
                    <div className={styles.detailsContainer}>
                        <div className={styles.detailsContent}>
                            <h6>Fees</h6>
                            <Tooltip content='Maker fees 0.1%' position='top'>
                                <h3>Always 0.00%</h3>
                            </Tooltip>
                            <div
                                className={styles.view_detail_clickable}
                                style={{ visibility: 'hidden' }}
                                onClick={() => feeScheduleModalCtrl.open()}
                            >
                                View fee schedule
                            </div>
                        </div>

                        <div className={styles.totalNetDisplay}>
                            <h6>
                                <span>Total Net USD Value:</span>{' '}
                                {formatCurrency(totalValue)}
                            </h6>
                            <div className={styles.buttonContainer}>
                                <div className={styles.rowButton}>
                                    <SimpleButton
                                        onClick={openDepositModal}
                                        bg='accent1'
                                    >
                                        Deposit
                                    </SimpleButton>
                                    <SimpleButton
                                        onClick={openWithdrawModal}
                                        bg='dark3'
                                        hoverBg='accent1'
                                    >
                                        Withdraw
                                    </SimpleButton>
                                    <SimpleButton
                                        onClick={openSendModal}
                                        bg='dark3'
                                        hoverBg='accent1'
                                    >
                                        Send
                                    </SimpleButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <section
                        id={'portfolioTablesMainContent'}
                        className={styles.mainContent}
                        ref={mainRef}
                    >
                        <Resizable
                            size={{ width: '100%', height: panelHeight }}
                            minHeight={PANEL_MIN}
                            maxHeight={maxTop ?? undefined}
                            enable={{ bottom: true }}
                            handleStyles={{
                                bottom: {
                                    height: '8px',
                                    cursor: 'row-resize',
                                },
                            }}
                            handleComponent={{
                                bottom: (
                                    <div className={styles.resizeHandle}>
                                        <div className={styles.resizeGrip} />
                                    </div>
                                ),
                            }}
                            onResizeStart={() => {
                                startRef.current = panelHeight;
                            }}
                            onResize={(_e, _dir, _ref, d: NumberSize) => {
                                const next = Math.max(
                                    PANEL_MIN,
                                    Math.min(
                                        startRef.current + d.height,
                                        maxTop ?? 10000,
                                    ),
                                );
                                setPanelHeight(next);
                            }}
                            onResizeStop={() => {
                                setPortfolioPanelHeight(panelHeight);
                            }}
                        >
                            <section
                                style={{
                                    height: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                {isLayoutReady && (
                                    <MemoizedPerformancePanel
                                        userData={userData}
                                        panelHeight={panelHeight}
                                        isMobile={false}
                                    />
                                )}
                            </section>
                        </Resizable>

                        <section className={styles.table}>
                            <PortfolioTables />
                        </section>
                    </section>
                </div>
            </div>

            {PortfolioModalsRenderer}

            {feeScheduleModalCtrl.isOpen && (
                <Modal
                    close={feeScheduleModalCtrl.close}
                    title={'Fee Schedule'}
                >
                    <div className={styles.fee_schedule_modal}>
                        <section className={styles.fee_table}>
                            <h4>VIP Tiers</h4>
                            <header>
                                <div>Tier</div>
                                <div>14D Volume</div>
                                <div>Taker</div>
                                <div>Maker</div>
                            </header>
                            <ol>
                                {feeSchedules.vip.map((feeTier: feeTierIF) => (
                                    <li key={JSON.stringify(feeTier)}>
                                        <div>{feeTier.tier}</div>
                                        <div>{feeTier.volume14d}</div>
                                        <div>{feeTier.taker}</div>
                                        <div>{feeTier.maker}</div>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section className={styles.fee_table}>
                            <h4>Market Maker Tiers</h4>
                            <header>
                                <div>Tier</div>
                                <div>14D Volume</div>
                                <div />
                                <div>Maker</div>
                            </header>
                            <ol>
                                {feeSchedules.marketMaker.map(
                                    (feeTier: feeTierIF) => (
                                        <li key={JSON.stringify(feeTier)}>
                                            <div>{feeTier.tier}</div>
                                            <div>{feeTier.volume14d}</div>
                                            <div>{feeTier.taker}</div>
                                            <div>{feeTier.maker}</div>
                                        </li>
                                    ),
                                )}
                            </ol>
                        </section>

                        <div className={styles.neg_fees}>
                            Negative fees are rebates
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default memo(DesktopPortfolio);
