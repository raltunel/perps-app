import type { useModalIF } from '~/hooks/useModal';
import styles from './AppOptions.module.css';
import OptionLine from './OptionLine';
import { useEffect, useState } from 'react';

export interface appOptionDataIF {
    slug: string;
    text: string;
    isDefault: boolean;
}

const optionsTop: appOptionDataIF[] = [
    {
        slug: 'skipOpenOrderConfirm',
        text: 'Skip Open Order Confirmations',
        isDefault: false,
    },
    {
        slug: 'skipClosePositionConfirm',
        text: 'Skip Close Position Confirmations',
        isDefault: false,
    },
    {
        slug: 'optOutOfSpotDusting',
        text: 'Opt Out of Spot Dusting',
        isDefault: false,
    },
    {
        slug: 'persistTradingConnection',
        text: 'Persist Trading Connection',
        isDefault: false,
    },
];

const optionsBottom: appOptionDataIF[] = [
    {
        slug: 'displayVerboseErrors',
        text: 'Display Verbose Errors',
        isDefault: false,
    },
    {
        slug: 'disableBackgroundFillNotif',
        text: 'Disable Background Fill Notifications',
        isDefault: false,
    },
    {
        slug: 'disableFillSound',
        text: 'Disable Playing Sound for Fills',
        isDefault: true,
    },
    {
        slug: 'animateOrderBook',
        text: 'Animate Order Book',
        isDefault: true,
    },
    {
        slug: 'orderBookSetSizeOnClk',
        text: 'Order Book Set Size on Click',
        isDefault: true,
    },
    {
        slug: 'showBuysSellsOnChart',
        text: 'Show Buys and Sells on Chart',
        isDefault: true,
    },
    {
        slug: 'hidePnL',
        text: 'Hide PnL',
        isDefault: false,
    },
    {
        slug: 'showAllWarnings',
        text: 'Show All Warnings',
        isDefault: true,
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