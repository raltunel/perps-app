import styles from './Modal.module.css';

interface propsIF {
    close: () => void;
    children: React.ReactNode;
}

export default function Modal(props: propsIF) {
    const { close, children } = props;

    const OUTSIDE_MODAL_DOM_ID = 'outside_modal';

    function handleOutsideClick(target: HTMLElement): void {
        target.id === OUTSIDE_MODAL_DOM_ID && close();
    }

    return (
        <div
            onClick={
                (
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => handleOutsideClick(e.target as HTMLDivElement)
            }
            id={OUTSIDE_MODAL_DOM_ID}
            className={styles.outside_modal}
        >
            {children}
        </div>
    );
}
