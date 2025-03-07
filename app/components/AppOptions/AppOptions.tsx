import styles from './AppOptions.module.css';

export default function AppOptions() {
    return (
        <section className={styles.app_options}>
            <header>
                <div />
                <h2>Options</h2>
                <button>×</button>
            </header>
            <ul>
                <li>First option here</li>
                <li>Second option here</li>
                <li>Third option here</li>
            </ul>
            <hr />
            <ul>
                <li>Fourth option here</li>
                <li>Fifth option here</li>
            </ul>
            <footer>
                <button>Cancel</button>
                <button>Confirm</button>
            </footer>
        </section>
    );
}