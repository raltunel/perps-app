import { NextRequest, NextResponse } from "next/server";

interface SocialChannel {
  id: string;
  platform: string;
  link: string;
  followers: string;
  language: string;
}

interface ContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  im: string;
  imHandle: string;
  socialName: string;
  walletAddress: string;
  socialChannels: SocialChannel[];
  upgradeRequest: string;
  recommenderName?: string;
  recommenderEmail?: string;
  affiliateAgreement?: boolean;
}

// Map form platform names to HubSpot property prefixes
const PLATFORM_TO_HUBSPOT: Record<string, string> = {
  "X/Twitter": "x_twitter",
  "Youtube": "youtube",
  "Telegram": "telegram",
  "Discord": "discord",
  "Facebook": "facebook",
  "Instagram": "instagram",
  "Tiktok": "tiktok",
  "Twitch": "twitch",
  "Linkedin": "linkedin",
  "Weibo (微博)": "weibo",
  "WeChat (微信)": "wechat",
  "Xiaohongshu (小红书)": "xiaohongshu",
  "Douyin (抖音)": "douyin",
  "KakaoTalk": "kakaotalk",
  "Line": "line",
  "VK": "vk",
  "Odnoklassniki": "odnoklassniki",
  "Rutube": "rutube",
  "Other": "others",
};

// Map form IM platform names to HubSpot IM property names
const IM_TO_HUBSPOT: Record<string, string> = {
  "Telegram": "im___telegram",
  "WhatsApp": "hs_whatsapp_phone_number",
  "WeChat": "im___wechat",
  "QQ": "im___qq",
  "KakaoTalk": "im___kakaotalk",
  "LINE": "im___line",
};

// Map language names to HubSpot language codes
const LANGUAGE_TO_CODE: Record<string, string> = {
  "English": "en",
  "Spanish": "es",
  "Chinese": "zh-cn",
  "Japanese": "ja",
  "Korean": "ko",
  "Portuguese": "pt",
  "Russian": "ru",
  "French": "fr",
  "German": "de",
  "Arabic": "ar",
  "Hindi": "hi",
  "Vietnamese": "vi",
  "Other": "other",
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();

    const hubspotToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;

    if (!hubspotToken) {
      return NextResponse.json(
        { error: "HubSpot configuration missing" },
        { status: 500 }
      );
    }

    // Build HubSpot properties object
    const properties: Record<string, string | number | boolean> = {
      email: body.email,
      firstname: body.firstName,
      lastname: body.lastName,
      phone: body.phone,
      instant_messenger: body.im,
      social_identity_name: body.socialName,
      wallet_address: body.walletAddress,
      lifecyclestage: "lead",
      referral_update_request: body.upgradeRequest,
    };

    // Add optional recommender fields
    if (body.recommenderName) {
      properties.recommender_name = body.recommenderName;
    }
    if (body.recommenderEmail) {
      properties.recommender_email = body.recommenderEmail;
    }
    // Add affiliate agreement (checkbox)
    if (body.affiliateAgreement !== undefined) {
      properties.affiliate_agreement = body.affiliateAgreement;
    }

    // Add IM handle to the appropriate HubSpot property
    const imProperty = IM_TO_HUBSPOT[body.im];
    if (imProperty) {
      properties[imProperty] = body.imHandle;
    } else {
      // For "Other" or unknown IMs, use im___others
      properties["im___others"] = body.imHandle;
    }

    // If WhatsApp is selected, also set the whatsapp phone number
    if (body.im === "WhatsApp") {
      properties["hs_whatsapp_phone_number"] = body.phone;
    }

    // Add social channels
    for (const channel of body.socialChannels) {
      const hubspotPrefix = PLATFORM_TO_HUBSPOT[channel.platform];
      if (hubspotPrefix && channel.link) {
        properties[`${hubspotPrefix}_link`] = channel.link;

        if (channel.followers) {
          const followersNum = parseInt(channel.followers, 10);
          if (!isNaN(followersNum)) {
            properties[`${hubspotPrefix}_followers_subscribers`] = followersNum;
          }
        }

        if (channel.language) {
          const langCode = LANGUAGE_TO_CODE[channel.language] || channel.language.toLowerCase();
          properties[`${hubspotPrefix}_language`] = langCode;
        }
      }
    }

    const hubspotUrl = "https://api.hubapi.com/crm/v3/objects/contacts";

    const hubspotResponse = await fetch(hubspotUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hubspotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    });

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error("HubSpot API error:", errorText);

      // Try to parse the error response
      let errorCode = "UNKNOWN";
      let errorMessage = "Failed to create contact in HubSpot";

      try {
        const errorData = JSON.parse(errorText);
        errorCode = errorData.category || "UNKNOWN";

        if (errorCode === "CONFLICT" && errorData.message?.includes("Contact already exists")) {
          errorMessage = "This email is already registered. Please use a different email address.";
        } else if (errorCode === "VALIDATION_ERROR") {
          errorMessage = "Invalid data provided. Please check your information and try again.";
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If parsing fails, use default error message
      }

      return NextResponse.json(
        { error: errorMessage, code: errorCode, details: errorText },
        { status: hubspotResponse.status }
      );
    }

    const responseData = await hubspotResponse.json();

    return NextResponse.json(
      {
        success: true,
        message: "Contact created successfully",
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating HubSpot contact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
