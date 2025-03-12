import { useEffect, type ReactNode } from 'react';
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

    useEffect(() => {
        const EVENT_TYPE = 'keydown';
        function handleEscape(evt: KeyboardEvent) {
            evt.key === 'Escape' && close();
        }
        document.addEventListener(EVENT_TYPE, handleEscape);
        return (() => document.removeEventListener(EVENT_TYPE, handleEscape));
    }, []);

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
