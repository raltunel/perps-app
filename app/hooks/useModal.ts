import { useState } from "react";

export type useModalMethods = [boolean, () => void, () => void,];

export function useModal(): useModalMethods {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function openModal(): void {
        setIsOpen(true);
    }

    function closeModal(): void {
        setIsOpen(false);
    }

    return [isOpen, openModal, closeModal];
}