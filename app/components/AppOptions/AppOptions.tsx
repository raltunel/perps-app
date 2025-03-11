import { useRef } from 'react';
import type { useModalIF } from '~/hooks/useModal';
import styles from './AppOptions.module.css';
import OptionLine from './OptionLine';
import { useAppOptions, type appOptions, type useAppOptionsIF } from '~/stores/AppOptionsStore';

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

    const shouldToggleOnClose = useRef<appOptions[]>([]);
    function markForUpdate(o: appOptions): void {
        let output: appOptions[];
        shouldToggleOnClose.current.includes(o)
            ? output = shouldToggleOnClose.current.filter((e) => e !== o)
            : output = [...shouldToggleOnClose.current, o];
        shouldToggleOnClose.current = output;
    }

    function clickConfirm(): void {
        shouldToggleOnClose.current.forEach((elem: appOptions) => activeOptions.toggle(elem));
        modalControl.close();
    }

    return (
        <section className={styles.app_options}>
            <header>
                <div />
                <h2>Options</h2>
                <button onClick={modalControl.close}>×</button>
            </header>
            <ul>
                {
                    optionsTop.map(
                        (option: appOptionDataIF) => (
                            <OptionLine
                                key={JSON.stringify(option)}
                                option={option}
                                isEnabled={activeOptions[option.slug] === true}
                                markForUpdate={() => markForUpdate(option.slug)}
                            />
                        )
                    )
                }
            </ul>
            <hr />
            <ul>
                {
                    optionsBottom.map(
                        (option: appOptionDataIF) => (
                            <OptionLine
                                key={JSON.stringify(option)}
                                option={option}
                                isEnabled={activeOptions[option.slug]}
                                markForUpdate={() => markForUpdate(option.slug)}
                            />
                        )
                    )
                }
            </ul>
            <footer>
                <button onClick={modalControl.close}>Cancel</button>
                <button onClick={clickConfirm}>Confirm</button>
            </footer>
        </section>
    );
}