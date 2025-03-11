import type { useModalIF } from '~/hooks/useModal';
import styles from './AppOptions.module.css';
import OptionLine from './OptionLine';
import { useEffect, useState } from 'react';
import { useAppOptions, type appOptions } from '~/stores/AppOptionsStore';

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

    const [checked, setChecked] = useState<string[]>(initializeData());
    function toggleChecked(item: string) {
        const updated: string[] = checked.includes(item)
            ? checked.filter((c: string) => c !== item)
            : [...checked, item];
            console.log(updated);
        setChecked(updated);
    }

    function initializeData(): string[] {
        let initialData: string[];
        const persisted: string|null = localStorage.getItem('APP_OPTIONS');
        if (persisted) {
            initialData = JSON.parse(persisted);
        } else {
            initialData = optionsTop.concat(optionsBottom)
                .filter((opt: appOptionDataIF) => opt.isDefault)
                .flatMap((opt: appOptionDataIF) => opt.slug);
        }
        return initialData;
    }

    function clickConfirm(): void {
        localStorage.setItem('APP_OPTIONS', JSON.stringify(checked));
        modalControl.close();
    }

    const activeOptions = useAppOptions();
    console.log(activeOptions);

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
                                isChecked={activeOptions[option.slug]}
                                toggle={toggleChecked}
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
                                isChecked={activeOptions[option.slug]}
                                toggle={toggleChecked}
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