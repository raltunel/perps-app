import ButtonShowcase from '~/components/Button/ButtonShowcase/ButtonShowcase';
import type { Route } from '../../+types/root';
import styles from './home.module.css';

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Home() {
    return (
        <div className={styles.container}>
            <ButtonShowcase />
            <div style={{ padding: '100px' }}></div>
        </div>
    );
}
