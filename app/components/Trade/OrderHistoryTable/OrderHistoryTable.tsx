import React, { useCallback, useEffect, useRef } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './OrderHistoryTable.module.css';
import OrderHistoryTableHeader from './OrderHistoryTableHeader';
import OrderHistoryTableRow from './OrderHistoryTableRow';
import { orderHistoryData } from './data';
import { useWsObserver } from '~/hooks/useWsObserver';
import { useDebugStore } from '~/stores/DebugStore';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';
import { processUserOrder } from '~/processors/processOrderBook';
import type { FilterOption } from '../TradeTables/TradeTables';

interface OrderHistoryTableProps {
  onViewAll?: () => void;
  selectedFilter: string;
}

export default function OrderHistoryTable(props: OrderHistoryTableProps) {
  const { onViewAll, selectedFilter } = props;

  const { orderHistory } = useTradeDataStore();

  const {subscribe, unsubscribeAllByChannel} = useWsObserver();
  const {addOrderToHistory, symbol, setOrderHistory} = useTradeDataStore();

  const userOrderHistoryRef = useRef<OrderDataIF[]>([]);

  const {debugWallet} = useDebugStore();

  const filterOrderHistory = useCallback((orderHistory: OrderDataIF[]) => {
    switch(selectedFilter){
      case 'all':
        return orderHistory;
      case 'active':
        return orderHistory.filter((order) => order.coin === symbol);
      case 'long':
        return orderHistory.filter((order) => order.side === 'buy');
      case 'short':
        return orderHistory.filter((order) => order.side === 'sell');
    }
    return orderHistory;
  }, [selectedFilter, symbol]);

  
  useEffect(() => {

    const saveIntoStoreInterval = setInterval(() => {
      addOrderToHistory(filterOrderHistory(userOrderHistoryRef.current));
    }, 1000);

    return () => {
      clearInterval(saveIntoStoreInterval);
    }
    
  }, [filterOrderHistory]);

  useEffect(() => {
    userOrderHistoryRef.current = filterOrderHistory(orderHistory).slice(0, 50);
    setOrderHistory(userOrderHistoryRef.current);
  }, [selectedFilter, symbol]);

  useEffect(() => {
    subscribe('userHistoricalOrders', {
      payload: { user: debugWallet.address },
      handler: (payload) => {
        
        if(payload && payload.orderHistory && payload.orderHistory.length > 0){
          const orderUpdates: OrderDataIF[] = [];
          payload.orderHistory.map((o:any) => {
            const processedOrder = processUserOrder(o.order, o.status);
            if(processedOrder){
              orderUpdates.push(processedOrder);
            }
          })
          userOrderHistoryRef.current = filterOrderHistory([...orderUpdates, ...userOrderHistoryRef.current]).slice(0, 50);
          userOrderHistoryRef.current.sort((a, b) => b.timestamp - a.timestamp);
        }
      }
    });

    return () => {
      unsubscribeAllByChannel('userHistoricalOrders');
    }
  }, [debugWallet.address]);

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <OrderHistoryTableHeader />
      <div className={styles.tableBody}>
        {orderHistory.map((order, index) => (
          <OrderHistoryTableRow 
            key={`order-${index}`} 
            order={order}
          />
        ))}
        
        {orderHistoryData.length === 0 && (
          <div className={styles.rowContainer} style={{ justifyContent: 'center', padding: '2rem 0' }}>
            No order history
          </div>
        )}
        
        {orderHistoryData.length > 0 && (
          <a href="#" className={styles.viewAllLink} onClick={handleViewAll}>
            View All
          </a>
        )}
      </div>
    </div>
  );
}