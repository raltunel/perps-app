import type { FC } from 'react';
import styles from './Welcome.module.css';

export function meta() {
    return [
        { title: 'Welcome | Ambient' },
        { name: 'description', content: 'Trade Perps with Ambient' },
    ];
}

interface WelcomeProps {
    title: string;
}

const Welcome: FC<WelcomeProps> = ({ title }) => {
    return (
        <div className={styles.container}>
            <h1>Welcome to {title}!</h1>
        </div>
    );
};

export default Welcome;
