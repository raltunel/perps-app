'use client';

import { Info } from 'lucide-react';
import { GlassCard } from '@/components/common/glass-card';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface SingleStatCardProps {
  label: string;
  value: string | number;
  tooltip?: string;
  className?: string;
}

export function SingleStatCard({ label, value, tooltip, className }: SingleStatCardProps) {
  return (
    <GlassCard className={`w-full h-full ${className || ''}`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-text-muted">{label}</span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 cursor-help text-text-subtle" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="border border-border-default bg-slate-900 text-white"
              >
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
    </GlassCard>
  );
}
