import { useViewed } from '~/stores/AlreadySeenStore';
import styles from './testpage.module.css';

export default function testpage() {
    const alreadyViewed = useViewed();

    return (
        <div className={styles.testpage}>
            <button onClick={() => alreadyViewed.markAsViewed('aaa')}>
                Click Here!
            </button>
        </div>
    );
}
