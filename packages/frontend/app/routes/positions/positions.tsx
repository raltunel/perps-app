import { useMemo } from 'react';
import PositionsTable from '~/components/Trade/PositionsTable/PositionsTable';
import type { Route } from '../../+types/root';
import WebDataConsumer from '../trade/webdataconsumer';
import styles from './positions.module.css';
export function meta() {
    return [
        { title: 'Perps - Positions' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

function Positions() {
    const isFullScreen = true;

    // Memoize the container class name
    const containerClassName = useMemo(() => {
        return `${styles.container} ${isFullScreen ? styles.fullScreen : ''}`;
    }, [isFullScreen]);

    return (
        <div className={containerClassName}>
            <WebDataConsumer />
            <header>Positions</header>

            <div className={styles.content}>
                <PositionsTable pageMode={true} />
            </div>
        </div>
    );
}
export default Positions;
