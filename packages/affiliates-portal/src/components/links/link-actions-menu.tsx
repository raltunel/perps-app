"use client";

import { MoreVertical, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LinkActionsMenuProps {
  code: string;
  currentSplit: number;
  onEditCommission: (code: string, currentSplit: number) => void;
}

export function LinkActionsMenu({ code, currentSplit, onEditCommission }: LinkActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4 text-text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-surface backdrop-blur-sm border border-border-default"
      >
        <DropdownMenuItem
          onClick={() => onEditCommission(code, currentSplit)}
          className="flex items-center gap-3 text-text-primary hover:text-white hover:bg-surface-hover cursor-pointer transition-colors [&_svg]:!text-[currentColor]"
        >
          <Pencil className="w-4 h-4" />
          <span>Edit Commission</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
