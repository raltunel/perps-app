import { useEffect, useState } from "react";

export type useModalMethods = [boolean, () => void, () => void,];

export function useModal(dfltState?: 'open'|'closed'|number): useModalMethods {
    let isOpenAtRender: boolean;

    switch (dfltState) {
        case 'open':
            isOpenAtRender = true;
            break;
        case 'closed':
        default:    
            isOpenAtRender = false;
            break;
    }

    const [isOpen, setIsOpen] = useState<boolean>(isOpenAtRender);

    function openModal(): void {
        setIsOpen(true);
    }

    function closeModal(): void {
        setIsOpen(false);
    }

    useEffect(() => {
        if (typeof dfltState !== 'number') return;
        const openAfterDelay = setTimeout(
            () => openModal(),
            dfltState
        );
        return () => clearTimeout(openAfterDelay);
    }, []);

    return [isOpen, openModal, closeModal];
}