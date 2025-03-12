import type { useModalIF } from '~/hooks/useModal';
import styles from './AppOptions.module.css';
import OptionLine from './OptionLine';
import { useAppOptions, type appOptions, type useAppOptionsIF } from '~/stores/AppOptionsStore';
import { MdOutlineClose } from 'react-icons/md';

export interface appOptionDataIF {
    slug: appOptions;
    text: string;
}

const optionsTop: appOptionDataIF[] = [
    {
        slug: 'skipOpenOrderConfirm',
        text: 'Skip Open Order Confirmations',
    },
    {
        slug: 'skipClosePositionConfirm',
        text: 'Skip Close Position Confirmations',
    },
    {
        slug: 'optOutSpotDusting',
        text: 'Opt Out of Spot Dusting',
    },
    {
        slug: 'persistTradingConnection',
        text: 'Persist Trading Connection',
    },
];

const optionsBottom: appOptionDataIF[] = [
    {
        slug: 'displayVerboseErrors',
        text: 'Display Verbose Errors',
    },
    {
        slug: 'enableBackgroundFillNotif',
        text: 'Enable Background Fill Notifications',
    },
    {
        slug: 'playFillSound',
        text: 'Play Sound for Fills',
    },
    {
        slug: 'animateOrderBook',
        text: 'Animate Order Book',
    },
    {
        slug: 'clickToSetOrderBookSize',
        text: 'Order Book Set Size on Click',
    },
    {
        slug: 'showBuysSellsOnChart',
        text: 'Show Buys and Sells on Chart',
    },
    {
        slug: 'showPnL',
        text: 'Show PnL',
    },
    {
        slug: 'showAllWarnings',
        text: 'Show All Warnings',
    },
];

interface propsIF {
    modalControl: useModalIF;
}

export default function AppOptions(props: propsIF) {
    const { modalControl } = props;

    const activeOptions: useAppOptionsIF = useAppOptions();

    return (
        <section className={styles.app_options}>
            <header>
                <div />
                <h2>Options</h2>
                <MdOutlineClose
                    size={20}
                    onClick={modalControl.close}
                    style={{ cursor: 'pointer' }}
                />
            </header>
            <ul>
                {
                    optionsTop.map(
                        (option: appOptionDataIF) => (
                            <OptionLine
                                key={JSON.stringify(option)}
                                option={option}
                                isChecked={activeOptions[option.slug]}
                                toggle={() => activeOptions.toggle(option.slug)}
                            />
                        )
                    )
                }
            </ul>
            <div className={styles.horizontal_divider} />
            <ul>
                {
                    optionsBottom.map(
                        (option: appOptionDataIF) => (
                            <OptionLine
                                key={JSON.stringify(option)}
                                option={option}
                                isChecked={activeOptions[option.slug] === true}
                                toggle={() => activeOptions.toggle(option.slug)}
                            />
                        )
                    )
                }
            </ul>
            <div className={styles.apply_defaults} onClick={activeOptions.applyDefaults}>
                Apply Defaults
            </div>
        </section>
    );
}