import styles from './testpage.module.css';
import LoadingIndicator from '~/components/LoadingIndicator/LoadingIndicator';

export default function testpage() {
    return (
        <div className={styles.testpage}>
            <LoadingIndicator />
        </div>
    );
}
