import { type ReactNode } from 'react';
import styles from './Modal.module.css';

interface propsIF {
    close: () => void;
    children: ReactNode;
}

export default function Modal(props: propsIF) {
    const { close, children } = props;

    // DOM id for the area outside modal body
    const OUTSIDE_MODAL_DOM_ID = 'outside_modal';

    // fn to handle a click outside the modal body
    function handleOutsideClick(target: HTMLElement): void {
        // close the modal if area outside the body was clicked directly
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
