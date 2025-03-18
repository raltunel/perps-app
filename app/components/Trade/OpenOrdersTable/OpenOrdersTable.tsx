import React from 'react';
import OpenOrdersTableHeader from './OpenOrdersTableHeader';
import OpenOrdersTableRow, { type OpenOrderData } from './OpenOrdersTableRow';
import styles from './OpenOrdersTable.module.css';
import { openOrdersData } from './data';
import { useTradeDataStore } from '~/stores/TradeDataStore';

interface OpenOrdersTableProps {
  onCancel?: (time: number, coin: string) => void;
  onViewAll?: () => void;
}

export default function OpenOrdersTable(props: OpenOrdersTableProps) {
  const { onCancel, onViewAll } = props;
  
  const handleCancel = (time: number, coin: string) => {
    if (onCancel) {
      onCancel(time, coin);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  const { userSymbolOrders } = useTradeDataStore();
  
  return (
    <div className={styles.tableWrapper}>
      <OpenOrdersTableHeader />
      <div className={styles.tableBody}>
        {userSymbolOrders.map((order, index) => (
          <OpenOrdersTableRow 
            key={`order-${index}`} 
            order={order} 
            onCancel={handleCancel}
          />
        ))}
        
        {openOrdersData.length === 0 && (
          <div className={styles.rowContainer} style={{ justifyContent: 'center', padding: '2rem 0' }}>
            No open orders
          </div>
        )}
        
        {openOrdersData.length > 0 && (
          <a href="#" className={styles.viewAllLink} onClick={(e) => { 
            e.preventDefault();
            handleViewAll();
          }}>
            View All
          </a>
        )}
      </div>
    </div>
  );
}