import styles from './testpage.module.css';
import { useViewed } from '~/stores/AlreadySeenStore';

export default function testpage() {
    const alreadyViewed = useViewed();

    return (
        <div className={styles.testpage}>
            <button onClick={() => alreadyViewed.markAsViewed('aaa')}>
                Click Me!
            </button>
        </div>
    );
}
