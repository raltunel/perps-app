import { BsThreeDots } from 'react-icons/bs';
import OrderBook from './orderbook';
import styles from './orderbooksection.module.css';
import OrderBookTrades from './orderbooktrades';
import Tabs from '~/components/Tabs/Tabs';
import BasicMenu from '~/components/BasicMenu/BasicMenu';
import { useState } from 'react';
import { useUIStore } from '~/stores/UIStore';
interface OrderBookSectionProps {
  symbol: string;
}

const OrderBookSection: React.FC<OrderBookSectionProps> = ({ symbol }) => {
  

    const orderBookComponent = <OrderBook symbol={symbol} orderCount={9} />
    const orderBookTrades = <OrderBookTrades symbol={symbol} />
    const { orderBookMode, setOrderBookMode } = useUIStore();

    const menuItems = [
        {
            label: 'Tab',
            listener: () => {
                setOrderBookMode('tab');
            }
        },
        {
            label: 'Stacked',
            listener: () => {
                setOrderBookMode('stacked');
            }
        },
        {
            label: 'Large',
            listener: () => {
                setOrderBookMode('large');
            }
        }
    ]
    const tabs = [
        {
            label: 'Order Book',
            content: orderBookComponent
        },
        {
            label: 'Trades',
            content: orderBookTrades
        }
        
    ]


  return (
    <>
    <div className={styles.orderBookSection}>
      {orderBookMode === 'tab' && (
        <Tabs tabs={tabs} 
          headerRightContent={
            <BasicMenu items={menuItems} icon={<BsThreeDots />} />
          }
            />
      )}
      {orderBookMode === 'stacked' && (
        <div className={styles.stackedContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderTitle}>Order Book</div>
            <BasicMenu items={menuItems} icon={<BsThreeDots />} />
          </div>
          <OrderBook symbol={symbol} orderCount={5} />
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderTitle}>Trades</div>
            <BasicMenu items={menuItems} icon={<BsThreeDots />} />
          </div>
          {orderBookTrades}
        </div>
      )}
      {orderBookMode === 'large' && (
        <div className={styles.largeContainer}>
          <div className={styles.childOfLargeContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderTitle}>Order Book</div>
          </div>
            <OrderBook symbol={symbol} orderCount={9} />
          </div>
          <div className={styles.childOfLargeContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderTitle}>Trades</div>
            <BasicMenu items={menuItems} icon={<BsThreeDots />} />
          </div>
            {orderBookTrades}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default OrderBookSection;
