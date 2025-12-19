import { UseFormReturn, Path, PathValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadixSelect,
  RadixSelectContent,
  RadixSelectItem,
  RadixSelectTrigger,
  RadixSelectValue,
} from "@/components/ui/radix-select";
import { AffiliateFormValues } from "@/lib/validations/affiliate-form";
import { LANGUAGES } from "@/lib/constants/languages";

interface SocialChannelInputProps {
  form: UseFormReturn<AffiliateFormValues>;
  name: Path<AffiliateFormValues>;
  label: string;
  chineseName?: string;
}

export function SocialChannelInput({
  form,
  name,
  label,
  chineseName,
}: SocialChannelInputProps) {
  const channelValue = form.watch(name) as { link?: string; followers?: string; language?: string } | undefined;

  return (
    <div className="space-y-3">
      <Label className="text-text-secondary font-medium">
        {label}
        {chineseName && (
          <span className="ml-2 text-text-muted">({chineseName})</span>
        )}
      </Label>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-text-muted mb-1.5 block">Link (URL)</Label>
          <Input
            {...form.register(`${name}.link` as Path<AffiliateFormValues>)}
            placeholder="https://"
            className="bg-surface border-border-default text-white placeholder:text-text-subtle"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm text-text-muted mb-1.5 block">
              Followers/Subscribers
            </Label>
            <Input
              {...form.register(`${name}.followers` as Path<AffiliateFormValues>)}
              type="number"
              placeholder="0"
              className="bg-surface border-border-default text-white placeholder:text-text-subtle"
            />
          </div>

          <div>
            <Label className="text-sm text-text-muted mb-1.5 block">Language</Label>
            <RadixSelect
              value={channelValue?.language || ""}
              onValueChange={(value) =>
                form.setValue(`${name}.language` as Path<AffiliateFormValues>, value as PathValue<AffiliateFormValues, Path<AffiliateFormValues>>)
              }
            >
              <RadixSelectTrigger className="bg-surface border-border-default text-text-primary">
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
          </div>
        </div>
      </div>
    </div>
  );
}
