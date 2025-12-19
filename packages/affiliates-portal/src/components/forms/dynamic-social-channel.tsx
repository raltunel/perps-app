"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadixSelect,
  RadixSelectContent,
  RadixSelectItem,
  RadixSelectTrigger,
  RadixSelectValue,
} from "@/components/ui/radix-select";
import { LANGUAGES } from "@/lib/constants/languages";

export interface SocialChannel {
  id: string;
  platform: string;
  link: string;
  followers: string;
  language: string;
}

export interface SocialChannelErrors {
  platform?: { message?: string };
  link?: { message?: string };
  followers?: { message?: string };
  language?: { message?: string };
}

interface DynamicSocialChannelProps {
  channel: SocialChannel;
  onUpdate: (id: string, field: keyof SocialChannel, value: string) => void;
  onRemove: (id: string) => void;
  availablePlatforms: string[];
  canRemove: boolean;
  errors?: SocialChannelErrors;
}

export function DynamicSocialChannel({
  channel,
  onUpdate,
  onRemove,
  availablePlatforms,
  canRemove,
  errors,
}: DynamicSocialChannelProps) {
  return (
    <div className="space-y-4 p-6 rounded-xl bg-surface border border-border-default relative">
      {canRemove && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => onRemove(channel.id)}
            className="text-text-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div>
        <Label className="text-text-secondary mb-2 block">
          Social Platform <span className="text-destructive">*</span>
        </Label>
        <RadixSelect
          value={channel.platform}
          onValueChange={(value) => onUpdate(channel.id, "platform", value)}
        >
          <RadixSelectTrigger className="bg-surface border-border-default text-white hover:bg-surface-hover hover:border-border-hover transition-colors">
            <RadixSelectValue placeholder="Select platform" />
          </RadixSelectTrigger>
          <RadixSelectContent>
            {availablePlatforms.map((platform) => (
              <RadixSelectItem key={platform} value={platform}>
                {platform}
              </RadixSelectItem>
            ))}
          </RadixSelectContent>
        </RadixSelect>
        {errors?.platform && (
          <p className="mt-1 text-sm text-destructive">
            {errors.platform.message}
          </p>
        )}
      </div>

      <div>
        <Label className="text-text-secondary mb-2 block">
          Link (URL) <span className="text-destructive">*</span>
        </Label>
        <Input
          value={channel.link}
          onChange={(e) => onUpdate(channel.id, "link", e.target.value)}
          placeholder="https://"
          className="bg-surface border-border-default text-white placeholder:text-text-subtle"
        />
        {errors?.link && (
          <p className="mt-1 text-sm text-destructive">
            {errors.link.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-text-secondary mb-2 block">
            Followers/Subscribers <span className="text-destructive">*</span>
          </Label>
          <Input
            value={channel.followers}
            onChange={(e) => onUpdate(channel.id, "followers", e.target.value)}
            type="number"
            placeholder="0"
            className="bg-surface border-border-default text-white placeholder:text-text-subtle h-10"
          />
          {errors?.followers && (
            <p className="mt-1 text-sm text-destructive">
              {errors.followers.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-text-secondary mb-2 block">
            Language <span className="text-destructive">*</span>
          </Label>
          <RadixSelect
            value={channel.language}
            onValueChange={(value) => onUpdate(channel.id, "language", value)}
          >
            <RadixSelectTrigger className="bg-surface border-border-default text-white h-10 hover:bg-surface-hover hover:border-border-hover transition-colors">
              <RadixSelectValue placeholder="Select language" />
            </RadixSelectTrigger>
            <RadixSelectContent>
              {LANGUAGES.map((lang) => (
                <RadixSelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </RadixSelectItem>
              ))}
            </RadixSelectContent>
          </RadixSelect>
          {errors?.language && (
            <p className="mt-1 text-sm text-destructive">
              {errors.language.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
