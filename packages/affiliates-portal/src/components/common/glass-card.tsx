import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default p-6",
        className
      )}
    >
      <CardContent className="p-0 h-full">{children}</CardContent>
    </Card>
  );
}
