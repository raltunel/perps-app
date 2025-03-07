import type { useModalIF } from '~/hooks/useModal';
import styles from './AppOptions.module.css';
import OptionLine from './OptionLine';

export interface appOptionDataIF {
    text: string;
    isDefault: boolean;
}

interface propsIF {
    modalControl: useModalIF;
}

export default function AppOptions(props: propsIF) {
    const { modalControl } = props;

    const optionsTop: appOptionDataIF[] = [
        {
            text: 'Skip Open Order Confirmations',
            isDefault: false,
        },
        {
            text: 'Skip Close Position Confirmations',
            isDefault: false,
        },
        {
            text: 'Opt Out of Spot Dusting',
            isDefault: false,
        },
        {
            text: 'Persist Trading Connection',
            isDefault: false,
        },
    ];

    const optionsBottom: appOptionDataIF[] = [
        {
            text: 'Display Verbose Errors',
            isDefault: false,
        },
        {
            text: 'Disable Background Fill Notifications',
            isDefault: false,
        },
        {
            text: 'Disable Playing Sound for Fills',
            isDefault: true,
        },
        {
            text: 'Animate Order Book',
            isDefault: true,
        },
        {
            text: 'Order Book Set Size on Click',
            isDefault: true,
        },
        {
            text: 'Show Buys and Sells on Chart',
            isDefault: true,
        },
        {
            text: 'Hide PnL',
            isDefault: false,
        },
        {
            text: 'Show All Warnings',
            isDefault: true,
        },
    ];

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
                            />
                        )
                    )
                }
            </ul>
            <footer>
                <button onClick={modalControl.close}>Cancel</button>
                <button>Confirm</button>
            </footer>
        </section>
    );
}