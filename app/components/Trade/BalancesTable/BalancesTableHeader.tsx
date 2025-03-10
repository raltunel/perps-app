import React from 'react';
import styles from './BalancesTable.module.css';
// import SortIcon from './SortIcon';

export interface HeaderCell {
  name: string;
  key: string;
  sortable: boolean;
  onClick: (() => void) | undefined;
  className: string;
}

export default function BalancesTableHeader() {
  const handleSort = (key: string) => {
    console.log(`Sorting by: ${key}`);
    // Implement your sorting logic here
  };

  const tableHeaders: HeaderCell[] = [
    {
      name: 'Coin',
      key: 'coin',
      sortable: true,
      onClick: () => handleSort('coin'),
      className: 'coinCell',
    },
    {
      name: 'Total Balance',
      key: 'totalBalance',
      sortable: true,
      onClick: () => handleSort('totalBalance'),
      className: 'totalBalanceCell',
    },
    {
      name: 'Available Balance',
      key: 'availableBalance',
      sortable: true,
      onClick: () => handleSort('availableBalance'),
      className: 'availableBalanceCell',
    },
    {
      name: 'USDC Value',
      key: 'usdcValue',
      sortable: true,
      onClick: () => handleSort('usdcValue'),
      className: 'usdcValueCell',
    },
    {
      name: 'Buying Power',
      key: 'buyingPower',
      sortable: true,
      onClick: () => handleSort('buyingPower'),
      className: 'buyingPowerCell',
    },
    {
      name: 'PNL (ROGER)',
      key: 'pnl',
      sortable: true,
      onClick: () => handleSort('pnl'),
      className: 'pnlCell',
    },
    {
      name: 'Contract',
      key: 'contract',
      sortable: false,
      onClick: undefined,
      className: 'contractCell',
    },
    {
      name: '', // Empty header for action column
      key: 'action',
      sortable: false,
      onClick: undefined,
      className: 'actionCell',
    },
  ];

  return (
    <div className={styles.headerContainer}>
      {tableHeaders.map((header) => (
        <div
          key={header.key}
          className={`${styles.cell} ${styles.headerCell} ${styles[header.className]} ${header.sortable ? styles.sortable : ''}`}
          onClick={header.onClick}
        >
          {header.name}
              {header.sortable &&
                  //   <SortIcon />
                  <p>*</p>
              }
        </div>
      ))}
    </div>
  );
}