import { useState } from "react";

export type useModalMethods = [boolean, () => void, () => void,];

const DEFAULT_MODAL_STATE = false;

export function useModal(def: boolean = DEFAULT_MODAL_STATE): useModalMethods {
    const [isOpen, setIsOpen] = useState<boolean>(def);

    function openModal(): void {
        setIsOpen(true);
    }

    function closeModal(): void {
        setIsOpen(false);
    }

    return [isOpen, openModal, closeModal];
}