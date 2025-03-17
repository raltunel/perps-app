import React from 'react';
import OpenOrdersTableHeader from './OpenOrdersTableHeader';
import OpenOrdersTableRow, { type OpenOrderData } from './OpenOrdersTableRow';
import styles from './OpenOrdersTable.module.css';
import { openOrdersData } from './data';

interface OpenOrdersTableProps {
  onCancel?: (time: string, coin: string) => void;
  onViewAll?: () => void;
}

export default function OpenOrdersTable(props: OpenOrdersTableProps) {
  const { onCancel, onViewAll } = props;
  
  const handleCancel = (time: string, coin: string) => {
    if (onCancel) {
      onCancel(time, coin);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <OpenOrdersTableHeader />
      <div className={styles.tableBody}>
        {openOrdersData.map((order, index) => (
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