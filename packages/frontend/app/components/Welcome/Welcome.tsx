import type { FC } from 'react';
import type { Route } from '../../+types/root';
import styles from './Welcome.module.css';

export function meta() {
    return [
        { title: 'New React Router App' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
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
