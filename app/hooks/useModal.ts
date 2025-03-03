import { useEffect, useState } from "react";

// interface for return value of hook
export interface useModalIF {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

// main fn body for hook
export function useModal(dfltState?: 'open'|'closed'|number): useModalIF {
    // variable to track if modal is open on initial render
    let isOpenAtRender: boolean;

    // logic tree to determine if modal is open on initial render
    switch (dfltState) {
        // open if hook is instantiated that way
        case 'open':
            isOpenAtRender = true;
            break;
        // closed if hook is called that way, with number, or with
        // ... no explicit state provided
        case 'closed':
        default:    
            isOpenAtRender = false;
            break;
    }

    // state value to track if modal is currently open
    const [isOpen, setIsOpen] = useState<boolean>(isOpenAtRender);

    // modal control functions
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const toggleModal = () => setIsOpen(!isOpen);

    // logic to open the modal after a delay
    useEffect(() => {
        // do not execute unless hook instantiated with a number
        if (typeof dfltState !== 'number') return;
        // timeout to open modal after time set in parameter
        const openAfterDelay = setTimeout(
            () => openModal(),
            dfltState
        );
        // clear the effect from the DOM when elem dismounts
        return () => clearTimeout(openAfterDelay);
    }, []);

    // return obj
    return {
        isOpen,
        open: openModal,
        close: closeModal,
        toggle: toggleModal,
    };
}