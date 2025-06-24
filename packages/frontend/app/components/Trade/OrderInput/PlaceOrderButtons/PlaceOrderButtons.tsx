import React, { useCallback, useMemo, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from '~/components/Tooltip/Tooltip';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';
import styles from './PlaceOrderButtons.module.css';
import {
    HiOutlineChevronDoubleDown,
    HiOutlineChevronDoubleUp,
} from 'react-icons/hi2';

interface propsIF {
    orderMarketPrice: string;
    openModalWithContent: (
        content: 'margin' | 'scale' | 'confirm_buy' | 'confirm_sell',
    ) => void;
    leverage: number;
    orderValue?: number;
}
interface MarketInfoItem {
    label: string;
    tooltipLabel: string;
    value: string;
}

const PlaceOrderButtons: React.FC<propsIF> = React.memo((props) => {
    const { orderMarketPrice, openModalWithContent, orderValue, leverage } =
        props;

    const { getBsColor } = useAppSettings();
    const { formatNum } = useNumFormatter();

    // State for scrolling through items
    const [currentStartIndex, setCurrentStartIndex] = useState(0);

    const buyColor = useMemo(() => getBsColor().buy, [getBsColor]);
    const sellColor = useMemo(() => getBsColor().sell, [getBsColor]);

    const showLiquidationPrice = useMemo(
        () =>
            ['market', 'limit', 'stop_limit', 'stop_market'].includes(
                orderMarketPrice,
            ),
        [orderMarketPrice],
    );

    const marketInfoData: MarketInfoItem[] = useMemo(() => {
        const arr: (MarketInfoItem | false)[] = [
            showLiquidationPrice && {
                label: 'Liquidation Price',
                tooltipLabel: 'liquidation price',
                value: '-',
            },
            orderMarketPrice === 'scale' && {
                label: 'Avg. Entry Price',
                tooltipLabel: 'average entry price',
                value: '-',
            },
            {
                label: 'Order Value',
                tooltipLabel: 'order value',
                value: orderValue
                    ? formatNum(orderValue, null, true, true)
                    : 'N/A',
            },
            {
                label: 'Margin Required',
                tooltipLabel: 'margin required',
                value: orderValue
                    ? formatNum(orderValue / leverage, null, true, true)
                    : 'N/A',
            },
        ];
        return arr.filter(Boolean) as MarketInfoItem[];
    }, [
        showLiquidationPrice,
        orderMarketPrice,
        orderValue,
        leverage,
        formatNum,
    ]);

    const twapInfoData: MarketInfoItem[] = useMemo(
        () => [
            {
                label: 'Frequency',
                tooltipLabel: 'frequency',
                value: '30 seconds',
            },
            {
                label: 'Run Time',
                tooltipLabel: 'run time',
                value: '30 minutes',
            },
            {
                label: 'Number of Orders',
                tooltipLabel: 'number of orders',
                value: '61',
            },
        ],
        [],
    );

    const limitInfoData: MarketInfoItem[] = useMemo(
        () => [
            {
                label: 'Chasing Interval',
                tooltipLabel: 'chasing interval',
                value: 'Per 1s',
            },
            {
                label: 'Size per suborder',
                tooltipLabel: 'size per suborder',
                value: '0.000 ETH',
            },
        ],
        [],
    );

    const infoDataMap: Record<string, MarketInfoItem[]> = useMemo(
        () => ({
            twap: twapInfoData,
            chase_limit: limitInfoData,
        }),
        [twapInfoData, limitInfoData],
    );

    const dataToUse = useMemo(
        () => infoDataMap[orderMarketPrice] || marketInfoData,
        [infoDataMap, orderMarketPrice, marketInfoData],
    );

    // Calculate visible items and navigation state
    const itemsToShow = 2;
    const hasMoreItems = useMemo(
        () => dataToUse.length > itemsToShow,
        [dataToUse, itemsToShow],
    );
    const canScrollDown = useMemo(
        () => currentStartIndex + itemsToShow < dataToUse.length,
        [currentStartIndex, dataToUse.length, itemsToShow],
    );
    const canScrollUp = useMemo(
        () => currentStartIndex > 0,
        [currentStartIndex],
    );

    const handleBuyClick = useCallback(
        () => openModalWithContent('confirm_buy'),
        [openModalWithContent],
    );

    const handleSellClick = useCallback(
        () => openModalWithContent('confirm_sell'),
        [openModalWithContent],
    );

    const handleScroll = useCallback(() => {
        if (canScrollDown) {
            // Scroll down to show next items
            setCurrentStartIndex((prev) =>
                Math.min(prev + 1, dataToUse.length - itemsToShow),
            );
        } else if (canScrollUp) {
            // If at bottom, reset to top
            setCurrentStartIndex(0);
        }
    }, [canScrollDown, canScrollUp, dataToUse.length, itemsToShow]);

    return (
        <div className={styles.place_order_buttons}>
            <div className={styles.buttons_wrapper}>
                <button
                    style={{ backgroundColor: buyColor }}
                    className={styles.overlay_button}
                    onClick={handleBuyClick}
                >
                    Buy / Long
                </button>
                <button
                    style={{ backgroundColor: sellColor }}
                    className={styles.overlay_button}
                    onClick={handleSellClick}
                >
                    Sell / Short
                </button>
            </div>
            <div className={styles.input_details}>
                <div className={styles.details_viewport}>
                    <div
                        className={styles.details_container}
                        style={{
                            transform: `translateY(-${(currentStartIndex * 100) / itemsToShow}%)`,
                        }}
                    >
                        {dataToUse.map((data: MarketInfoItem, idx: number) => (
                            <div
                                key={data.label + idx}
                                className={styles.detail_item}
                            >
                                <div className={styles.detail_label}>
                                    <span>{data.label}</span>
                                    <Tooltip
                                        content={data.tooltipLabel}
                                        position='right'
                                    >
                                        <AiOutlineQuestionCircle size={13} />
                                    </Tooltip>
                                </div>
                                <span className={styles.detail_value}>
                                    {data.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {hasMoreItems && (
                    <button
                        className={styles.scroll_button}
                        onClick={handleScroll}
                        aria-label='Scroll through details'
                    >
                        {canScrollDown ? (
                            <HiOutlineChevronDoubleDown
                                className={styles.scroll_icon}
                            />
                        ) : (
                            <HiOutlineChevronDoubleUp
                                className={styles.scroll_icon}
                            />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
});

export default PlaceOrderButtons;
