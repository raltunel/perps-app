import type { useModalIF } from '~/hooks/useModal';
import styles from './AppOptions.module.css';
import OptionLine from './OptionLine';

export interface appOptionDataIF {
    text: string;
}

interface propsIF {
    modalControl: useModalIF;
}

export default function AppOptions(props: propsIF) {
    const { modalControl } = props;

    const optionsTop: appOptionDataIF[] = [
        {
            text: 'Skip Open Order Confirmations',
        },
        {
            text: 'Skip Close Position Confirmations',
        },
        {
            text: 'Opt Out of Spot Dusting',
        },
        {
            text: 'Persist Trading Connection',
        },
    ];

    const optionsBottom: appOptionDataIF[] = [
        {
            text: 'Display Verbose Errors',
        },
        {
            text: 'Disable Background Fill Notifications',
        },
        {
            text: 'Disable Playing Sound for Fills',
        },
        {
            text: 'Animate Order Book',
        },
        {
            text: 'Order Book Set Size on Click',
        },
        {
            text: 'Show Buys and Sells on Chart',
        },
        {
            text: 'Hide PnL',
        },
        {
            text: 'Show All Warnings',
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