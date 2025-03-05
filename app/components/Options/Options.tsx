import type { useModalIF } from '~/hooks/useModal';
import styles from './Options.module.css';

interface propsIF {
    modalControl: useModalIF;
}

export default function Options(props: propsIF) {
    const { modalControl } = props;
    return (
        <>
        <button onClick={modalControl.close}>Close</button>
        <h2 className={styles.options}>Options Menu!</h2>
        </>
    );
}