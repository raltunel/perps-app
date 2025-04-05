import { useAppSettings } from '~/stores/AppSettingsStore';
import styles from './symbolinfofield.module.css';


interface SymbolInfoFieldProps {
  label: string;
  value: string;
  lastWsChange?: number;
  type?: 'positive' | 'negative';
  valueClass?: string;
}



const SymbolInfoField: React.FC<SymbolInfoFieldProps> = ({ label, value, lastWsChange, type, valueClass }) => {


  const {isInverseColor} = useAppSettings();


  return (
    <div className={styles.symbolInfoFieldWrapper}>
    <div className={`${styles.symbolInfoField} ${isInverseColor ? styles.inverseColor : ''}`}>
      <div className={styles.symbolInfoFieldLabel}>{label}</div>
      <div className={`${styles.symbolInfoFieldValue} 
      ${lastWsChange && lastWsChange > 0 ? styles.positiveAnimation : 
      lastWsChange && lastWsChange < 0 ? styles.negativeAnimation : ''}
      ${type === 'positive' ? styles.positive : 
      type === 'negative' ? styles.negative : ''} 
      ${valueClass}`}>{value}</div>
    </div>
    </div>
  );
}

export default SymbolInfoField;
