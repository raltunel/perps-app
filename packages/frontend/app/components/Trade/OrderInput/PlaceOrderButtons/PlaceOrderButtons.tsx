import React, { useCallback, useMemo } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from '~/components/Tooltip/Tooltip';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';
import styles from './PlaceOrderButtons.module.css';

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

    const handleBuyClick = useCallback(
        () => openModalWithContent('confirm_buy'),
        [openModalWithContent],
    );
    const handleSellClick = useCallback(
        () => openModalWithContent('confirm_sell'),
        [openModalWithContent],
    );

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
                {dataToUse.map((data: MarketInfoItem, idx: number) => (
                    <div key={data.label + idx}>
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
    );
});

export default PlaceOrderButtons;
