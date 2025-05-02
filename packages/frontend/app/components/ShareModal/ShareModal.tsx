import { useMemo, useRef } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './ShareModal.module.css';
import type { PositionIF } from '~/utils/position/PositionIFs';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { PERPS_TWITTER, TWITTER_CHARACTER_LIMIT } from '~/utils/Constants';
import shareCardBackground from './shareCardBackground.png';
import perpsLogo from './perpsLogo.png';

interface propsIF {
    close: () => void;
    position: PositionIF;
}

export default function ShareModal(props: propsIF) {
    const { close, position } = props;

    const memPosition = useMemo<PositionIF>(() => position, []);

    const { formatNum } = useNumFormatter();
    const { coinPriceMap, symbol } = useTradeDataStore();

    const REFERRAL_CODE = '0x1';

    const TEXTAREA_ID_FOR_DOM = 'share_card_custom_text';

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const symbolFileName = useMemo<string>(() => {
        const match = symbol.match(/^k([A-Z]+)$/);
        return match ? match[1] : symbol;
    }, [symbol]);
console.log(memPosition);
    return (
        <Modal title='' close={close}>
            <div className={styles.share_modal}>
                <div
                    className={styles.picture_overlay}
                    style={{
                        backgroundImage: `url(${shareCardBackground})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <img 
                        src={perpsLogo} 
                        alt="Description of the image"
                        style={{
                            width: '240px',
                            height: 'auto',
                            maxHeight: '300px',
                            objectFit: 'cover'
                        }}
                    />
                    <div className={styles.market}>
                        <div className={styles.market_tkn}>
                            <div className={styles.symbol_icon}>
                                <img
                                    src={`https://app.hyperliquid.xyz/coins/${symbolFileName}.svg`}
                                    alt={symbolFileName}
                                />
                            </div>
                            <div className={styles.symbol}>{memPosition.coin}</div>
                            <div className={styles.yield}>Long {memPosition.leverage.value}x</div>
                        </div>
                        <div className={styles.market_pct}>
                            {position.returnOnEquity > 0 && '+'}{formatNum(position.returnOnEquity * 100, 1)}%
                        </div>
                    </div>
                    <div className={styles.prices}>
                        <div className={styles.price}>
                            <div>Entry Price</div>
                            <div>{formatNum(memPosition.entryPx)}</div>
                        </div>
                        <div className={styles.price}>
                            <div>Mark Price</div>
                            <div>{formatNum(coinPriceMap.get(memPosition.coin) ?? 0)}</div>
                        </div>
                    </div>
                    <div className={styles.price}>
                        <div>Referral code:</div>
                        <div>https://perps.ambient.finance/join</div>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.referral_code}>
                        <div>Referral Code:</div>
                        <div>{REFERRAL_CODE}</div>
                    </div>
                    <div className={styles.custom_text}>
                        <label htmlFor={TEXTAREA_ID_FOR_DOM}>Customize your text</label>
                        <textarea
                            id={TEXTAREA_ID_FOR_DOM}
                            ref={inputRef}
                            maxLength={TWITTER_CHARACTER_LIMIT}
                            autoComplete='false'
                            placeholder={`eg: Trade $BTC Perps seamlessly on ${PERPS_TWITTER} using my referral code`}
                        />
                    </div>
                    <div className={styles.button_bank}>
                        <Button size='medium'>Save Image</Button>
                        <Button size='medium'>Copy Link</Button>
                        <Button size='medium'>Share on X</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}