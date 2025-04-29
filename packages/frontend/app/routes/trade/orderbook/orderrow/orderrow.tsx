import { useMemo } from 'react';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeModuleStore } from '~/stores/TradeModuleStore';
import type {
    OrderBookRowIF,
    OrderRowResolutionIF,
} from '~/utils/orderbook/OrderBookIFs';
import styles from './orderrow.module.css';

interface OrderRowProps {
    rowIndex: number;
    order: OrderBookRowIF;
    coef: number;
    resolution: OrderRowResolutionIF | null;
    userSlots: Set<string>;
    clickListener: (
        order: OrderBookRowIF,
        type: OrderRowClickTypes,
        rowIndex: number,
    ) => void;
}

export enum OrderRowClickTypes {
    PRICE = 'price',
    AMOUNT = 'amount',
}

const OrderRow: React.FC<OrderRowProps> = ({
    rowIndex,
    order,
    coef,
    resolution,
    userSlots,
    clickListener,
}) => {
    const { formatNum } = useNumFormatter();

    const { getBsColor } = useAppSettings();

    const { setTradeSlot } = useTradeModuleStore();

    const formattedPrice = useMemo(() => {
        return formatNum(order.px, resolution);
    }, [order.px, resolution]);

    const handleClick = () => {
        setTradeSlot({
            coin: order.coin,
            amount: order.sz,
            price: order.px,
            type: order.type,
        });
    };
    return (
        <div
            className={`${styles.orderRow} ${userSlots.has(formattedPrice) ? styles.userOrder : ''}`}
            onClick={handleClick}
        >
            {/* <div
                className={styles.ratio}
                style={{
                    width: `${order.ratio * 100}%`,
                    backgroundColor:
                        order.type === 'buy'
                            ? getBsColor().buy
                            : getBsColor().sell,
                }}
            ></div> */}
            {userSlots.has(formattedPrice) && (
                <div className={styles.userOrderIndicator}></div>
            )}
            <div
                className={styles.orderRowPrice}
                style={{
                    color:
                        order.type === 'buy'
                            ? getBsColor().buy
                            : getBsColor().sell,
                }}
                onClick={() =>
                    clickListener(order, OrderRowClickTypes.PRICE, rowIndex)
                }
            >
                {formattedPrice}
            </div>
            <div
                className={styles.orderRowSize}
                onClick={() =>
                    clickListener(order, OrderRowClickTypes.AMOUNT, rowIndex)
                }
            >
                {formatNum(order.sz * coef)}
            </div>
            <div
                className={styles.orderRowTotal}
                onClick={() =>
                    clickListener(order, OrderRowClickTypes.AMOUNT, rowIndex)
                }
            >
                {formatNum(order.total * coef)}
            </div>
            {/* <div className={styles.fadeOverlay}></div> */}
        </div>
    );
};

export default OrderRow;
