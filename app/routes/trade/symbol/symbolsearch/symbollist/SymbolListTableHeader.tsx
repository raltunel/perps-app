import styles from './symbollist.module.css';
import SortIcon from '~/components/Vault/SortIcon';

export interface HeaderCell {
  name: string;
  key: string;
  sortable: boolean;
  onClick: (() => void) | undefined;
  className: string;
}

export default function SymbolListTableHeader() {
  const handleSort = (key: string) => {
    console.log(`Sorting by: ${key}`);
   
  };

  const tableHeaders: HeaderCell[] = [
    {
      name: 'Symbol',
      key: 'symbol',
      sortable: true,
      onClick: () => handleSort('symbol'),
      className: 'symbolCell',
    },
    {
      name: 'Last Price',
      key: 'lastPrice',
      sortable: true,
      onClick: () => handleSort('lastPrice'),
      className: 'lastPriceCell',
    },
    {
      name: '24hr Change',
      key: 'change',
      sortable: true,
      onClick: () => handleSort('change'),
      className: 'changeCell',
    },
    {
      name: '8hr Funding',
      key: 'funding',
      sortable: true,
      onClick: () => handleSort('funding'),
      className: 'fundingCell',
    },
    {
      name: 'Volume',
      key: 'volume',
      sortable: true,
      onClick: () => handleSort('volume'),
      className: 'volumeCell',
    },
    {
      name: 'Open Interest',
      key: 'openInterest',
      sortable: true,
      onClick: () => handleSort('openInterest'),
      className: 'openInterestCell',
    },
  ];

  return (
    <div className={styles.headerContainer}>
      {tableHeaders.map((header) => (
        <div
          key={header.key}
          className={`${styles.cell} ${styles.headerCell} ${styles[header.className]} ${header.sortable ? styles.sortable : ''} `}
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