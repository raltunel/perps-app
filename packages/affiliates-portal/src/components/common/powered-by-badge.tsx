"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Powered By Badge Component
 *
 * A persistent, glassmorphic pill badge that floats above all content
 * displaying "Powered by Fuul" branding. Always visible across all pages.
 *
 * Design: Glassmorphic pill with backdrop blur, semi-transparent background,
 * and subtle border. Features the Fuul logo and branding text.
 *
 * Positioning: Fixed to bottom-right corner, floats above all content
 */
export function PoweredByBadge() {
  return (
    <div
      className="fixed bottom-6 right-6 z-[70] animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
      role="contentinfo"
      aria-label="Powered by Fuul"
    >
      <Link
        href="https://fuul.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 px-5 py-2.5 rounded-full
                   bg-surface-hover backdrop-blur-md border border-border-hover
                   shadow-lg shadow-black/10
                   transition-all duration-300 ease-out
                   hover:bg-surface-active hover:border-border-strong hover:shadow-xl hover:shadow-black/20
                   hover:scale-105 active:scale-100
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        aria-label="Powered by Fuul - Visit fuul.xyz"
      >
        {/* "Powered by" text */}
        <span className="text-sm text-text-secondary font-normal transition-colors duration-300 group-hover:text-text-primary">
          Powered by
        </span>

        {/* Fuul logo */}
        <div
          className="relative w-6 h-6 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <Image
            src="/assets/logos/fuul-isologo-color.webp"
            alt="Fuul"
            fill
            className="object-contain"
            sizes="24px"
          />
        </div>
        <span className="text-sm text-text-secondary font-normal transition-colors duration-300 group-hover:text-text-primary">
          Fuul
        </span>
      </Link>
    </div>
  );
}
