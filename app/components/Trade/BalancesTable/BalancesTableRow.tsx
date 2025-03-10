import React from 'react';
import styles from './BalancesTable.module.css';

export interface BalanceData {
  coin: string;
  totalBalance: string;
  availableBalance: string;
  usdcValue: string;
  buyingPower: string;
  pnl: string;
  contract: string;
}

interface BalancesTableRowProps {
  balance: BalanceData;
}

export default function BalancesTableRow(props: BalancesTableRowProps) {
  const { balance } = props;

  return (
    <div className={styles.rowContainer}>
      <div className={`${styles.cell} ${styles.coinCell}`}>{balance.coin}</div>
      <div className={`${styles.cell} ${styles.totalBalanceCell}`}>{balance.totalBalance}</div>
      <div className={`${styles.cell} ${styles.availableBalanceCell}`}>{balance.availableBalance}</div>
      <div className={`${styles.cell} ${styles.usdcValueCell}`}>{balance.usdcValue}</div>
      <div className={`${styles.cell} ${styles.buyingPowerCell}`}>{balance.buyingPower}</div>
      <div className={`${styles.cell} ${styles.pnlCell}`}>{balance.pnl}</div>
      <div className={`${styles.cell} ${styles.contractCell}`}>{balance.contract}</div>
      <div className={`${styles.cell} ${styles.actionCell}`}>
        <button className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}