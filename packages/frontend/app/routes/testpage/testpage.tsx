import ButtonShowcase from '~/components/Button/ButtonShowcase/ButtonShowcase';
import styles from './testpage.module.css';
import LoadingIndicator from '~/components/LoadingIndicator/LoadingIndicator';

export default function testpage() {
    return (
        <div className={styles.testpage}>
            <ButtonShowcase />
        </div>
    );
}
