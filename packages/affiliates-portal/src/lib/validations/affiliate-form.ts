import { z } from "zod";

const socialChannelSchema = z.object({
  id: z.string(),
  platform: z.string().min(1, "Platform is required"),
  link: z.string().min(1, "Link is required"),
  followers: z.string().min(1, "Followers count is required"),
  language: z.string().min(1, "Language is required"),
});

export const affiliateFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  im: z.string().min(1, "IM platform is required"),
  imHandle: z.string().min(1, "IM handle is required"),
  imOther: z.string().optional(),
  socialName: z.string().min(1, "Social name is required"),

  socialChannels: z.array(socialChannelSchema).min(1, "Please add at least one social channel"),

  upgradeRequest: z.enum(["yes", "na"], {
    required_error: "Please select an option",
  }),

  recommenderName: z.string().optional(),
  recommenderEmail: z.string().email("Invalid email address").optional().or(z.literal("")),

  agreementAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the agreement",
  }),
}).refine(
  (data) => {
    if (data.im === "Others") {
      return !!data.imOther && data.imOther.length > 0;
    }
    return true;
  },
  {
    message: "Please specify the IM platform",
    path: ["imOther"],
  }
);

export type AffiliateFormValues = z.infer<typeof affiliateFormSchema>;
