import { useState } from "react";

export function useModal(): void {
    const [open, setOpen] = useState<boolean>(false);
    false && open;
    false && setOpen;
}