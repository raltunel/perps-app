import styles from './symbolinfofield.module.css';


interface SymbolInfoFieldProps {
  label: string;
  value: string;
  lastPriceChange?: number;
}



const SymbolInfoField: React.FC<SymbolInfoFieldProps> = ({ label, value, lastPriceChange }) => {


  


  return (
    <div className={styles.symbolInfoField}>
      <div className={styles.symbolInfoFieldLabel}>{label}</div>
      <div className={`${styles.symbolInfoFieldValue} 
      ${lastPriceChange && lastPriceChange > 0 ? styles.positiveAnimation : 
      lastPriceChange && lastPriceChange < 0 ? styles.negativeAnimation : ''}`}>{value}</div>
    </div>
  );
}

export default SymbolInfoField;
