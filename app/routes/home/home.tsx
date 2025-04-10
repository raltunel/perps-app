import Tooltip from '~/components/Tooltip/Tooltip';
import type { Route } from '../../+types/root';
import styles from './home.module.css';
import ButtonShowcase from '~/components/Button/ButtonShowcase/ButtonShowcase';
export function meta({}: Route.MetaArgs) {
    return [
        { title: 'New React Router App' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (
        <div className={styles.container}>
            <ButtonShowcase />
            <div style={{ padding: '100px' }}></div>
        </div>
    );
}
