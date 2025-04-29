import { useMemo } from 'react';
import type { Route } from '../../+types/root';
import styles from './positions.module.css';
import PositionsTable from '~/components/Trade/PositionsTable/PositionsTable';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Perps - Positions' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

function Positions({ loaderData }: Route.ComponentProps) {
    const isFullScreen = true;

    // Memoize the container class name
    const containerClassName = useMemo(() => {
        return `${styles.container} ${isFullScreen ? styles.fullScreen : ''}`;
    }, [isFullScreen]);

    return (
        <div className={containerClassName}>
            <header>Positions</header>

            <div className={styles.content}>
                <PositionsTable pageMode={true} />
            </div>
        </div>
    );
}
export default Positions;
