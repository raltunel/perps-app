import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number.parseInt(process.env.PORT || '3000');

const HOST_PORT = process.env.HOST_PORT || undefined;

const app = express();
app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));

// Enable gzip compression
app.use(compression());

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

app.post('/api/hubspot', async (req, res) => {
    try {
        const hubspotToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
        if (!hubspotToken) {
            return res
                .status(500)
                .json({ error: 'HubSpot configuration missing' });
        }

        const body = req.body || {};

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

            return res.status(hubspotResponse.status).json({
                error: errorMessage,
                code: errorCode,
                details: errorText,
            });
        }

        const responseData = await hubspotResponse.json();
        return res.status(200).json({
            success: true,
            message: 'Contact created successfully',
            data: responseData,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

console.log('Starting static production server');

// Serve static files from the build directory
const clientBuildPath = path.join(__dirname, 'build');
app.use(
    express.static(clientBuildPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
            // Cache hashed assets aggressively
            if (filePath.includes('/assets/')) {
                res.setHeader(
                    'Cache-Control',
                    'public, max-age=31536000, immutable',
                );
            }
            // Don't cache HTML files
            else if (filePath.endsWith('.html')) {
                res.setHeader(
                    'Cache-Control',
                    'no-cache, no-store, must-revalidate',
                );
            }
            // Cache service worker for 24 hours
            else if (filePath.endsWith('sw.js')) {
                res.setHeader('Cache-Control', 'public, max-age=86400');
            }
        },
    }),
);

// SPA fallback - Express 5 requires explicit wildcard syntax
app.use(async (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    try {
        const indexPath = path.join(clientBuildPath, 'index.html');
        const html = await readFile(indexPath, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
        console.error('SPA fallback error:', error);
        next(error);
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    if (HOST_PORT) {
        console.log(
            `Production server is running on http://localhost:${HOST_PORT}`,
        );
    } else {
        console.log(`Production server is running on http://localhost:${PORT}`);
    }
});
