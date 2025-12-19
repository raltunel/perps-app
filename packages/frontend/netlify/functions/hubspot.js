const PLATFORM_TO_HUBSPOT = {
    'X/Twitter': 'x_twitter',
    Youtube: 'youtube',
    Telegram: 'telegram',
    Discord: 'discord',
    Facebook: 'facebook',
    Instagram: 'instagram',
    Tiktok: 'tiktok',
    Twitch: 'twitch',
    Linkedin: 'linkedin',
    'Weibo (微博)': 'weibo',
    'WeChat (微信)': 'wechat',
    'Xiaohongshu (小红书)': 'xiaohongshu',
    'Douyin (抖音)': 'douyin',
    KakaoTalk: 'kakaotalk',
    Line: 'line',
    VK: 'vk',
    Odnoklassniki: 'odnoklassniki',
    Rutube: 'rutube',
    Other: 'others',
};

const IM_TO_HUBSPOT = {
    Telegram: 'im___telegram',
    WhatsApp: 'hs_whatsapp_phone_number',
    WeChat: 'im___wechat',
    QQ: 'im___qq',
    KakaoTalk: 'im___kakaotalk',
    LINE: 'im___line',
};

const LANGUAGE_TO_CODE = {
    English: 'en',
    Spanish: 'es',
    Chinese: 'zh-cn',
    Japanese: 'ja',
    Korean: 'ko',
    Portuguese: 'pt',
    Russian: 'ru',
    French: 'fr',
    German: 'de',
    Arabic: 'ar',
    Hindi: 'hi',
    Vietnamese: 'vi',
    Other: 'other',
};

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    try {
        const hubspotToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
        if (!hubspotToken) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'HubSpot configuration missing',
                }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        const body = event.body ? JSON.parse(event.body) : {};

        const properties = {
            email: body.email,
            firstname: body.firstName,
            lastname: body.lastName,
            phone: body.phone,
            instant_messenger: body.im,
            social_identity_name: body.socialName,
            wallet_address: body.walletAddress,
            lifecyclestage: 'lead',
            referral_update_request: body.upgradeRequest,
        };

        if (body.recommenderName) {
            properties.recommender_name = body.recommenderName;
        }
        if (body.recommenderEmail) {
            properties.recommender_email = body.recommenderEmail;
        }
        if (body.affiliateAgreement !== undefined) {
            properties.affiliate_agreement = body.affiliateAgreement;
        }

        const imProperty = IM_TO_HUBSPOT[body.im];
        if (imProperty) {
            properties[imProperty] = body.imHandle;
        } else {
            properties.im___others = body.imHandle;
        }

        if (body.im === 'WhatsApp') {
            properties.hs_whatsapp_phone_number = body.phone;
        }

        const socialChannels = Array.isArray(body.socialChannels)
            ? body.socialChannels
            : [];

        for (const channel of socialChannels) {
            const hubspotPrefix = PLATFORM_TO_HUBSPOT[channel.platform];
            if (hubspotPrefix && channel.link) {
                properties[`${hubspotPrefix}_link`] = channel.link;

                if (channel.followers) {
                    const followersNum = parseInt(channel.followers, 10);
                    if (!Number.isNaN(followersNum)) {
                        properties[`${hubspotPrefix}_followers_subscribers`] =
                            followersNum;
                    }
                }

                if (channel.language) {
                    const langCode =
                        LANGUAGE_TO_CODE[channel.language] ||
                        String(channel.language).toLowerCase();
                    properties[`${hubspotPrefix}_language`] = langCode;
                }
            }
        }

        const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
        const hubspotResponse = await fetch(hubspotUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${hubspotToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ properties }),
        });

        if (!hubspotResponse.ok) {
            const errorText = await hubspotResponse.text();

            let errorCode = 'UNKNOWN';
            let errorMessage = 'Failed to create contact in HubSpot';

            try {
                const errorData = JSON.parse(errorText);
                errorCode = errorData.category || 'UNKNOWN';

                if (
                    errorCode === 'CONFLICT' &&
                    errorData.message?.includes('Contact already exists')
                ) {
                    errorMessage =
                        'This email is already registered. Please use a different email address.';
                } else if (errorCode === 'VALIDATION_ERROR') {
                    errorMessage =
                        'Invalid data provided. Please check your information and try again.';
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch {
                // ignore
            }

            return {
                statusCode: hubspotResponse.status,
                body: JSON.stringify({
                    error: errorMessage,
                    code: errorCode,
                    details: errorText,
                }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        const responseData = await hubspotResponse.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Contact created successfully',
                data: responseData,
            }),
            headers: { 'Content-Type': 'application/json' },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
            }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
};
