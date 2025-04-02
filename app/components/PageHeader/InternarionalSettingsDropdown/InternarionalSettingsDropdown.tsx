import { useAppSettings } from '~/stores/AppSettingsStore';
import styles from './InternarionalSettingsDropdown.module.css'
import { type BuySellColor, type LangType, type NumFormat } from '~/utils/Constants';

export default function InternarionalSettingsDropdown() {

    const { numFormat, setNumFormat, lang, setLang, buySellColor, setBuySellColor, langs, numFormatTypes, buySellColors } = useAppSettings();






    return (
        <div className={styles.container}>

            <div className={styles.internationalSettingHeader}>Number Formatting: </div>
            {
                numFormatTypes.map((e: NumFormat) => (
                    <div key={e.value} className={`${styles.intSettingItem} ${numFormat.value === e.value ? styles.selected : ''}`} onClick={() => setNumFormat(e)}>
                        {e.label}
                    </div>
                ))
            }
            <div className={styles.internationalSettingHeader}>Language:</div>
            {
                langs.map((e: LangType) => (
                    <div key={e.label} className={`${styles.intSettingItem} ${lang.label === e.label ? styles.selected : ''}`} onClick={() => setLang(e)}>
                        {e.label}
                    </div>
                ))
            }
            <div className={styles.internationalSettingHeader}>Color</div>
            {
                buySellColors.map((e: BuySellColor) => (
                    <div key={e.type} className={`${styles.intSettingItem} ${buySellColor.type === e.type ? styles.selected : ''}`} onClick={() => setBuySellColor(e)}>
                        <span style={{ color: e.buy }}>Buy</span>&nbsp;/&nbsp;<span style={{ color: e.sell }}>Sell</span>
                    </div>
                ))
            }

        </div>
    )
}