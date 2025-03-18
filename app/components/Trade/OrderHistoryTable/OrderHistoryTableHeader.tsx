import styles from './OrderHistoryTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
  name: string;
  key: string;
  sortable: boolean;
  onClick: (() => void) | undefined;
  className: string;
}

export default function OrderHistoryTableHeader() {
  const handleSort = (key: string) => {
    console.log(`Sorting by: ${key}`);
   
  };

  const tableHeaders: HeaderCell[] = [
    {
      name: 'Time',
      key: 'time',
      sortable: true,
      onClick: () => handleSort('time'),
      className: 'timeCell',
    },
    {
      name: 'Type',
      key: 'type',
      sortable: true,
      onClick: () => handleSort('type'),
      className: 'typeCell',
    },
    {
      name: 'Coin',
      key: 'coin',
      sortable: true,
      onClick: () => handleSort('coin'),
      className: 'coinCell',
    },
    {
      name: 'Direction',
      key: 'direction',
      sortable: true,
      onClick: () => handleSort('direction'),
      className: 'directionCell',
    },
    {
      name: 'Size',
      key: 'size',
      sortable: true,
      onClick: () => handleSort('size'),
      className: 'sizeCell',
    },
    {
      name: 'Filled Size',
      key: 'filledSize',
      sortable: true,
      onClick: () => handleSort('filledSize'),
      className: 'filledSizeCell',
    },
    {
      name: 'Order Value',
      key: 'orderValue',
      sortable: true,
      onClick: () => handleSort('orderValue'),
      className: 'orderValueCell',
    },
    {
      name: 'Price',
      key: 'price',
      sortable: true,
      onClick: () => handleSort('price'),
      className: 'priceCell',
    },
    {
      name: 'Reduce Only',
      key: 'reduceOnly',
      sortable: true,
      onClick: () => handleSort('reduceOnly'),
      className: 'reduceOnlyCell',
    },
    {
      name: 'Trigger Conditions',
      key: 'triggerConditions',
      sortable: true,
      onClick: () => handleSort('triggerConditions'),
      className: 'triggerConditionsCell',
    },
    {
      name: 'TP/SL',
      key: 'tpsl',
      sortable: true,
      onClick: () => handleSort('tpsl'),
      className: 'tpslCell',
    },
    {
      name: 'Status',
      key: 'status',
      sortable: true,
      onClick: () => handleSort('status'),
      className: 'statusCell',
    },
    {
      name: 'Order ID',
      key: 'orderId',
      sortable: true,
      onClick: () => handleSort('orderId'),
      className: 'orderIdCell',
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