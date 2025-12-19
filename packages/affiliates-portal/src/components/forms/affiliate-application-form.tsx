"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  RadixSelect,
  RadixSelectContent,
  RadixSelectItem,
  RadixSelectTrigger,
  RadixSelectValue,
} from "@/components/ui/radix-select";
import {
  DynamicSocialChannel,
  type SocialChannel,
  type SocialChannelErrors,
} from "./dynamic-social-channel";
import { ApplicationPendingCard } from "./application-pending-card";
import { GlassCard } from "@/components/common/glass-card";
import { Plus, Loader2 } from "lucide-react";
import {
  affiliateFormSchema,
  type AffiliateFormValues,
} from "@/lib/validations/affiliate-form";
import { useFormStatusStore } from "@/store/form-status-store";
import { useAuth } from "@/hooks/auth/use-auth";

const IM_PLATFORMS = [
  "Telegram",
  "WhatsApp",
  "WeChat",
  "QQ",
  "KakaoTalk",
  "LINE",
  "Others",
];

const SOCIAL_PLATFORMS = [
  "X/Twitter",
  "Youtube",
  "Telegram",
  "Discord",
  "Facebook",
  "Instagram",
  "Tiktok",
  "Twitch",
  "Linkedin",
  "Weibo (微博)",
  "WeChat (微信)",
  "Xiaohongshu (小红书)",
  "Douyin (抖音)",
  "KakaoTalk",
  "Line",
  "VK",
  "Odnoklassniki",
  "Rutube",
  "Other",
];

const initialChannel: SocialChannel = {
  id: "initial",
  platform: "",
  link: "",
  followers: "",
  language: "",
};

export function AffiliateApplicationForm() {
  const { addCompletedWallet, isWalletCompleted, _hasHydrated } = useFormStatusStore();
  const { walletAddress } = useAuth();

  const [socialChannels, setSocialChannels] = useState<SocialChannel[]>([
    initialChannel,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      im: "",
      imHandle: "",
      imOther: "",
      socialName: "",
      socialChannels: [initialChannel],
      upgradeRequest: undefined,
      recommenderName: "",
      recommenderEmail: "",
      agreementAccepted: false,
    },
  });

  const selectedIM = form.watch("im");
  const showIMOther = selectedIM === "Others";

  const isCompleted = _hasHydrated && walletAddress ? isWalletCompleted(walletAddress) : false;

  if (isCompleted) {
    return <ApplicationPendingCard />;
  }

  const addSocialChannel = () => {
    const newChannel: SocialChannel = {
      id: Math.random().toString(36).substring(7),
      platform: "",
      link: "",
      followers: "",
      language: "",
    };
    setSocialChannels([...socialChannels, newChannel]);
    form.setValue("socialChannels", [...socialChannels, newChannel]);
  };

  const updateSocialChannel = (
    id: string,
    field: keyof SocialChannel,
    value: string
  ) => {
    const updated = socialChannels.map((channel) =>
      channel.id === id ? { ...channel, [field]: value } : channel
    );
    setSocialChannels(updated);
    form.setValue("socialChannels", updated);
  };

  const removeSocialChannel = (id: string) => {
    const updated = socialChannels.filter((channel) => channel.id !== id);
    setSocialChannels(updated);
    form.setValue("socialChannels", updated);
  };

  const onSubmit = async (data: AffiliateFormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/hubspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          im: data.im === "Others" ? data.imOther || "" : data.im,
          imHandle: data.imHandle,
          socialName: data.socialName,
          walletAddress: walletAddress || "",
          socialChannels: data.socialChannels,
          upgradeRequest: data.upgradeRequest === "yes" ? "Yes" : "NA",
          recommenderName: data.recommenderName || "",
          recommenderEmail: data.recommenderEmail || "",
          affiliateAgreement: data.agreementAccepted,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      toast.success("Application submitted successfully!");

      if (walletAddress) {
        addCompletedWallet(walletAddress);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: typeof form.formState.errors) => {
    console.log("Form validation errors:", errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
      <GlassCard>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">Contact Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-text-secondary">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register("firstName")}
                  placeholder="Enter your first name"
                  className="border-border-default bg-surface text-white placeholder:text-text-subtle"
                />
                {form.formState.errors.firstName && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2 block text-text-secondary">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register("lastName")}
                  placeholder="Enter your last name"
                  className="border-border-default bg-surface text-white placeholder:text-text-subtle"
                />
                {form.formState.errors.lastName && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-text-secondary">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="your@email.com"
                className="border-border-default bg-surface text-white placeholder:text-text-subtle"
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-text-secondary">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                {...form.register("phone")}
                type="tel"
                placeholder="+1234567890"
                className="border-border-default bg-surface text-white placeholder:text-text-subtle"
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-text-secondary">
                Social Name <span className="text-destructive">*</span>
              </Label>
              <Input
                {...form.register("socialName")}
                placeholder="Enter your social name"
                className="border-border-default bg-surface text-white placeholder:text-text-subtle"
              />
              {form.formState.errors.socialName && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.socialName.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-text-secondary">
                IM Platform <span className="text-destructive">*</span>
              </Label>
              <RadixSelect
                value={selectedIM}
                onValueChange={(value) => form.setValue("im", value)}
              >
                <RadixSelectTrigger className="border-border-default bg-surface text-white transition-colors hover:border-border-hover hover:bg-surface-hover">
                  <RadixSelectValue placeholder="Select IM platform" />
                </RadixSelectTrigger>
                <RadixSelectContent>
                  {IM_PLATFORMS.map((platform) => (
                    <RadixSelectItem key={platform} value={platform}>
                      {platform}
                    </RadixSelectItem>
                  ))}
                </RadixSelectContent>
              </RadixSelect>
              {form.formState.errors.im && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.im.message}
                </p>
              )}
            </div>

            {showIMOther && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <Label className="mb-2 block text-text-secondary">
                  Other IM Platform <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register("imOther")}
                  placeholder="Enter platform name"
                  className="border-border-default bg-surface text-white placeholder:text-text-subtle"
                />
                {form.formState.errors.imOther && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.imOther.message}
                  </p>
                )}
              </div>
            )}

            {selectedIM && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <Label className="mb-2 block text-text-secondary">
                  {selectedIM === "Others" ? "IM" : selectedIM} Handle/Username{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register("imHandle")}
                  placeholder={
                    selectedIM === "Telegram"
                      ? "@username"
                      : "Enter your handle"
                  }
                  className="border-border-default bg-surface text-white placeholder:text-text-subtle"
                />
                {form.formState.errors.imHandle && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.imHandle.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-bold text-text-primary">
              Social Channels
            </h2>
            <p className="text-sm text-text-muted">
              Please share at least one active channel link, follower count and
              language used.
            </p>
          </div>

          <div className="space-y-4">
            {socialChannels.map((channel, index) => (
              <DynamicSocialChannel
                key={channel.id}
                channel={channel}
                onUpdate={updateSocialChannel}
                onRemove={removeSocialChannel}
                availablePlatforms={SOCIAL_PLATFORMS}
                canRemove={socialChannels.length > 1}
                errors={form.formState.errors.socialChannels?.[index] as SocialChannelErrors | undefined}
              />
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={addSocialChannel}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-hover py-4 font-medium text-text-secondary transition-all hover:border-border-strong hover:bg-surface hover:text-text-primary"
            >
              <Plus className="h-4 w-4" />
              Add Social Channel
            </button>
          </div>

          {form.formState.errors.socialChannels && (
            <p className="text-sm text-destructive">
              {form.formState.errors.socialChannels.message}
            </p>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">
            Referral Upgrade Request (For Referrer to Affiliate ONLY){" "}
            <span className="text-destructive">*</span>
          </h2>

          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              I confirm that I meet the eligibility criteria for a referral to
              affiliate upgrade:
            </p>
            <ul className="ml-2 list-inside list-disc space-y-2 text-sm text-text-tertiary">
              <li>
                I have successfully invited more than 10 users who have
                completed their first trades.
              </li>
              <li>
                The cumulative trading volume of my invitees within a 30-day
                period exceeds $10 million.
              </li>
            </ul>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
                <input
                  type="radio"
                  name="upgradeRequest"
                  value="yes"
                  checked={form.watch("upgradeRequest") === "yes"}
                  onChange={() => form.setValue("upgradeRequest", "yes")}
                  className="text-primary focus:ring-primary h-4 w-4 cursor-pointer border-border-hover bg-surface"
                />
                <span className="text-text-secondary">YES</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80">
                <input
                  type="radio"
                  name="upgradeRequest"
                  value="na"
                  checked={form.watch("upgradeRequest") === "na"}
                  onChange={() => form.setValue("upgradeRequest", "na")}
                  className="text-primary focus:ring-primary h-4 w-4 cursor-pointer border-border-hover bg-surface"
                />
                <span className="text-text-secondary">NA</span>
              </label>
            </div>

            {form.formState.errors.upgradeRequest && (
              <p className="text-sm text-destructive">
                {form.formState.errors.upgradeRequest.message}
              </p>
            )}

            <p className="pt-2 text-xs text-text-muted italic">
              Note: Eligibility will be verified based on invitee activity and
              trading volume.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">Recommended By</h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-text-secondary">
                Recommender Name
              </Label>
              <Input
                {...form.register("recommenderName")}
                placeholder="Enter recommender's name (optional)"
                className="border-border-default bg-surface text-white placeholder:text-text-subtle"
              />
            </div>

            <div>
              <Label className="mb-2 block text-text-secondary">
                Recommender Email
              </Label>
              <Input
                {...form.register("recommenderEmail")}
                type="email"
                placeholder="recommender@email.com (optional)"
                className="border-border-default bg-surface text-white placeholder:text-text-subtle"
              />
              {form.formState.errors.recommenderEmail && (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.recommenderEmail.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">
            Affiliate Agreement <span className="text-destructive">*</span>
          </h2>

          <div className="space-y-6">
            <label className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80">
              <Checkbox
                checked={form.watch("agreementAccepted")}
                onCheckedChange={(checked) =>
                  form.setValue("agreementAccepted", checked === true)
                }
                className="border-border-hover"
              />
              <span className="text-sm text-text-secondary">
                I agree to the Ambient Affiliate Agreement and Privacy Policy.{" "}
                <span className="text-destructive">*</span>
              </span>
            </label>
            {form.formState.errors.agreementAccepted && (
              <p className="text-sm text-destructive">
                {form.formState.errors.agreementAccepted.message}
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="min-w-[200px] cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
