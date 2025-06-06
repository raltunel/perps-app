// routes/showcase/showcase.tsx
import { Link } from 'react-router';
import styles from './showcase.module.css';

export default function Showcase() {
    const showcaseItems = [
        {
            title: 'Buttons',
            description:
                'Interactive button components with various states and styles',
            path: '/showcase/buttons',
            icon: '🔘',
        },
        {
            title: 'Dropdowns',
            description: 'Dropdown menus and select components',
            path: '/showcase/dropdowns',
            icon: '📋',
        },
        {
            title: 'Inputs',
            description: 'Form inputs and text fields',
            path: '/showcase/inputs',
            icon: '📝',
        },
        {
            title: 'Modals',
            description: 'Modal dialogs and overlays',
            path: '/showcase/modals',
            icon: '🪟',
        },
        {
            title: 'Cards',
            description: 'Card layouts and containers',
            path: '/showcase/cards',
            icon: '🃏',
        },
        {
            title: 'Tables',
            description: 'Data tables and grids',
            path: '/showcase/tables',
            icon: '📊',
        },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Component Showcase</h1>
                <p className={styles.subtitle}>
                    Interactive gallery of UI components and design patterns
                </p>
            </header>

            <div className={styles.grid}>
                {showcaseItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={styles.card}
                    >
                        <div className={styles.cardIcon}>{item.icon}</div>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <p className={styles.cardDescription}>
                            {item.description}
                        </p>
                        <div className={styles.cardArrow}>→</div>
                    </Link>
                ))}
            </div>

            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    Built with React Router and CSS Modules
                </p>
            </footer>
        </div>
    );
}
