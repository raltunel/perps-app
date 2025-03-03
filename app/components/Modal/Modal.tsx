import styles from './Modal.module.css';

interface propsIF {
    idForDOM: string;
    close: () => void;
}

export default function Modal(props: propsIF) {
    const { idForDOM, close } = props;

    return (
        <dialog className={styles.modal} id={idForDOM}>
            This is my modal!
            <button onClick={close}>Close Modal</button>
        </dialog>
    );
}