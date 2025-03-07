import styles from './AppOptions.module.css';

interface appOptionDataIF {
    text: string;
}

export default function AppOptions() {

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
                <button>×</button>
            </header>
            <ul>
                {
                    optionsTop.map(
                        (option: appOptionDataIF) => (
                            <li key={JSON.stringify(option)}>{option.text}</li>
                        )
                    )
                }
            </ul>
            <hr />
            <ul>
                {
                    optionsBottom.map(
                        (option: appOptionDataIF) => (
                            <li key={JSON.stringify(option)}>{option.text}</li>
                        )
                    )
                }
            </ul>
            <footer>
                <button>Cancel</button>
                <button>Confirm</button>
            </footer>
        </section>
    );
}