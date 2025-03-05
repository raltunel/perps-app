import type { useModalIF } from '~/hooks/useModal';
import styles from './Options.module.css';

interface propsIF {
    modalControl: useModalIF;
}

export default function Options(props: propsIF) {
    const { modalControl } = props;
    return (
        <section className={styles.options}>
            <button onClick={modalControl.close}>Close</button>
            <h2>Options Menu!</h2>
        </section>
    );
}