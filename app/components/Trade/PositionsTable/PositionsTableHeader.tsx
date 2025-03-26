import SortIcon from '~/components/Vault/SortIcon';
import styles from './PositionsTable.module.css';

export interface HeaderCell {
  name: string;
  key: string;
  sortable: boolean;
  onClick: (() => void) | undefined;
  className: string;
}

export default function PositionsTableHeader() {
  const handleSort = (key: string) => {
    console.log(`Sorting by: ${key}`);
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
      name: 'Size',
      key: 'size',
      sortable: true,
      onClick: () => handleSort('size'),
      className: 'sizeCell',
    },
    {
      name: 'Position Value',
      key: 'positionValue',
      sortable: true,
      onClick: () => handleSort('positionValue'),
      className: 'positionValueCell',
    },
    {
      name: 'Entry Price',
      key: 'entryPrice',
      sortable: true,
      onClick: () => handleSort('entryPrice'),
      className: 'entryPriceCell',
    },
    {
      name: 'Mark Price',
      key: 'markPrice',
      sortable: true,
      onClick: () => handleSort('markPrice'),
      className: 'markPriceCell',
    },
    {
      name: 'PNL (ROE%)',
      key: 'pnl',
      sortable: true,
      onClick: () => handleSort('pnl'),
      className: 'pnlCell',
    },
    {
      name: 'Liq. Price',
      key: 'liqPrice',
      sortable: true,
      onClick: () => handleSort('liqPrice'),
      className: 'liqPriceCell',
    },
    {
      name: 'Margin',
      key: 'margin',
      sortable: true,
      onClick: () => handleSort('margin'),
      className: 'marginCell',
    },
    {
      name: 'Funding',
      key: 'funding',
      sortable: true,
      onClick: () => handleSort('funding'),
      className: 'fundingCell',
    },
    {
      name: 'TP/SL',
      key: 'tpsl',
      sortable: false,
      onClick: undefined,
      className: 'tpslCell',
    },
    {
      name: 'Close',
      key: 'close',
      sortable: false,
      onClick: undefined,
      className: 'closeCell',
    }
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
          {header.sortable && (
           <SortIcon/>
          )}
        </div>
      ))}
    </div>
  );
}