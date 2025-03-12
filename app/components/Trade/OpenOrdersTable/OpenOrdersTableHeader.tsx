import styles from './OpenOrdersTable.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
  name: string;
  key: string;
  sortable: boolean;
  onClick: (() => void) | undefined;
  className: string;
}

export default function OpenOrdersTableHeader() {
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
      sortable: false,
      onClick: undefined,
      className: 'typeCell',
    },
    {
      name: 'Coin',
      key: 'coin',
      sortable: false,
      onClick: undefined,
      className: 'coinCell',
    },
    {
      name: 'Direction',
      key: 'direction',
      sortable: false,
      onClick: undefined,
      className: 'directionCell',
    },
    {
      name: 'Size',
      key: 'size',
      sortable: false,
      onClick: undefined,
      className: 'sizeCell',
    },
    {
      name: 'Original Size',
      key: 'originalSize',
      sortable: false,
      onClick: undefined,
      className: 'originalSizeCell',
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
      sortable: false,
      onClick: undefined,
      className: 'priceCell',
    },
    {
      name: 'Reduce Only',
      key: 'reduceOnly',
      sortable: false,
      onClick: undefined,
      className: 'reduceOnlyCell',
    },
    {
      name: 'Trigger Conditions',
      key: 'triggerConditions',
      sortable: false,
      onClick: undefined,
      className: 'triggerConditionsCell',
    },
    {
      name: 'TP/SL',
      key: 'tpsl',
      sortable: false,
      onClick: undefined,
      className: 'tpslCell',
    },
    {
      name: 'Cancel',
      key: 'cancel',
      sortable: false,
      onClick: undefined,
      className: 'cancelCell',
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