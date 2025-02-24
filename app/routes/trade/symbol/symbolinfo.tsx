import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './symbolinfo.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';

interface SymbolInfoProps {
}


const symbolList = [
  'BTC',
  'ETH',
  'SOL',
  'XRP',
  'ADA',
  'DOGE',
  'SHIB',
]

const SymbolInfo: React.FC<SymbolInfoProps> = ({ }) => {


  const {symbol, setSymbol} = useTradeDataStore();
  


  return (
    <div className={styles.symbolInfoContainer}>
      <ComboBox
        value={symbol}
        options={symbolList}
        onChange={(value) => setSymbol(value)}
      />

    </div>
  );
}

export default SymbolInfo;
