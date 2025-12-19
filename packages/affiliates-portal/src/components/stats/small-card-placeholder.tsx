"use client";

import { GlassCard } from "@/components/common/glass-card";
import { AffiliateTierCard } from "./affiliate-tier-card";

export function SmallCardPlaceholder() {
  return (
    <GlassCard className="flex h-full w-full">
      <AffiliateTierCard />
    </GlassCard>
  );
}
