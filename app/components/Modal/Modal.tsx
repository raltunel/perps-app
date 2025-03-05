import styles from './Modal.module.css';

interface propsIF {
    idForDOM: string;
    children: React.ReactNode;
}

export default function Modal(props: propsIF) {
    const { idForDOM, children } = props;

    return (
        <div className={styles.outside_modal} id={idForDOM}>
            {children}
        </div>
    );
}