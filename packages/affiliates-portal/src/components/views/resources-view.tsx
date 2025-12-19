"use client";

import { ViewLayout } from "./view-layout";
import {
  ExternalLink,
  MessageCircle,
  MessageCircleQuestion,
} from "lucide-react";

export function ResourcesView() {
  return (
    <ViewLayout title="Resources">
      <div className="space-y-4">
        {/* Welcome Package */}
        <div className="rounded-xl border border-border-default bg-surface p-4 backdrop-blur-sm sm:p-5">
          <h2 className="mb-1 text-base font-semibold text-text-primary">
            Welcome Package
          </h2>
          <p className="mb-4 text-sm text-text-tertiary">
            Get started with our comprehensive guide covering everything you
            need to know about the affiliate program
          </p>
          <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            Go to Welcome Package
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Program Rules */}
        <div className="rounded-xl border border-border-default bg-surface p-4 backdrop-blur-sm sm:p-5">
          <h2 className="mb-4 text-base font-semibold text-text-primary">Program Rules</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-semibold text-text-primary">
                1
              </div>
              <div>
                <h3 className="mb-0.5 text-sm font-medium text-text-primary">
                  Eligible Activities
                </h3>
                <p className="text-xs text-text-tertiary">
                  Earn commissions on all trading activities from users who sign
                  up through your referral link
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-semibold text-text-primary">
                2
              </div>
              <div>
                <h3 className="mb-0.5 text-sm font-medium text-text-primary">
                  Commission Structure
                </h3>
                <p className="text-xs text-text-tertiary">
                  Commission rates are tiered based on your affiliate level and
                  total referral volume
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-semibold text-text-primary">
                3
              </div>
              <div>
                <h3 className="mb-0.5 text-sm font-medium text-text-primary">Payment Terms</h3>
                <p className="text-xs text-text-tertiary">
                  Commissions are paid out weekly in your preferred
                  cryptocurrency with no minimum threshold
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-semibold text-text-primary">
                4
              </div>
              <div>
                <h3 className="mb-0.5 text-sm font-medium text-text-primary">
                  Code of Conduct
                </h3>
                <p className="text-xs text-text-tertiary">
                  Maintain honest marketing practices and comply with all
                  applicable regulations and platform guidelines
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-hover text-xs font-semibold text-text-primary">
                5
              </div>
              <div>
                <h3 className="mb-0.5 text-sm font-medium text-text-primary">
                  Prohibited Activities
                </h3>
                <p className="text-xs text-text-tertiary">
                  Self-referrals, spam, misleading claims, and fraudulent
                  activities are strictly prohibited and may result in
                  termination
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Still Have Questions */}
        <div className="rounded-xl border border-border-default bg-surface p-4 backdrop-blur-sm sm:p-5">
          <div className="mb-4 text-center">
            <MessageCircleQuestion className="mx-auto mb-2 h-7 w-7 text-text-subtle" />
            <h2 className="mb-1 text-base font-semibold text-text-primary">
              Still have questions?
            </h2>
            <p className="text-sm text-text-tertiary">
              Can't find the answer you're looking for? Reach out to our
              community
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-surface-hover px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-active"
            >
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}
