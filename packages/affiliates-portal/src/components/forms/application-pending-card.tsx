"use client";

import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/common/glass-card";

export function ApplicationPendingCard() {
  return (
    <GlassCard>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-text-primary">
          Application Submitted
        </h2>
        <p className="max-w-md text-text-secondary">
          Your application is being processed. We&apos;ll notify you once it&apos;s
          approved.
        </p>
      </div>
    </GlassCard>
  );
}
