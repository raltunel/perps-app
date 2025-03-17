import styles from './testpage.module.css';
import Notifications from '~/components/Notifications/Notifications';

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    return (
        <div className={styles.testpage}>
            <Notifications />
        </div>
    );
}
