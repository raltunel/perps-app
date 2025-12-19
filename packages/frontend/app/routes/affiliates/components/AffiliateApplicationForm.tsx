import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { IoAdd, IoClose } from 'react-icons/io5';
import { useUserDataStore } from '~/stores/UserDataStore';
import { notificationService } from '~/services/notificationService';
import { useFormStatusStore } from '../hooks/useFormStatusStore';
import { ApplicationPendingCard } from './ApplicationPendingCard';
import styles from '../affiliates.module.css';

interface SocialChannel {
    id: string;
    platform: string;
    link: string;
    followers: string;
    language: string;
}

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    im: string;
    imHandle: string;
    imOther: string;
    socialName: string;
    socialChannels: SocialChannel[];
    upgradeRequest: 'yes' | 'na' | '';
    recommenderName: string;
    recommenderEmail: string;
    agreementAccepted: boolean;
}

const IM_PLATFORMS = [
    'Telegram',
    'WhatsApp',
    'WeChat',
    'QQ',
    'KakaoTalk',
    'LINE',
    'Others',
];

const SOCIAL_PLATFORMS = [
    'X/Twitter',
    'Youtube',
    'Telegram',
    'Discord',
    'Facebook',
    'Instagram',
    'Tiktok',
    'Twitch',
    'Linkedin',
    'Weibo (微博)',
    'WeChat (微信)',
    'Xiaohongshu (小红书)',
    'Douyin (抖音)',
    'KakaoTalk',
    'Line',
    'VK',
    'Odnoklassniki',
    'Rutube',
    'Other',
];

const LANGUAGE_OPTIONS = [
    'English',
    'Spanish',
    'Chinese',
    'Japanese',
    'Korean',
    'Portuguese',
    'Russian',
    'French',
    'German',
    'Arabic',
    'Hindi',
    'Vietnamese',
    'Other',
];

function makeId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

const initialChannel: SocialChannel = {
    id: 'initial',
    platform: '',
    link: '',
    followers: '',
    language: '',
};

export function AffiliateApplicationForm() {
    const { userAddress } = useUserDataStore();
    const { addCompletedWallet, isWalletCompleted, _hasHydrated } =
        useFormStatusStore();

    const [values, setValues] = useState<FormValues>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        im: '',
        imHandle: '',
        imOther: '',
        socialName: '',
        socialChannels: [initialChannel],
        upgradeRequest: '',
        recommenderName: '',
        recommenderEmail: '',
        agreementAccepted: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [channelErrors, setChannelErrors] = useState<
        Record<string, Partial<Record<keyof SocialChannel, string>>>
    >({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isCompleted = useMemo(() => {
        return _hasHydrated && userAddress
            ? isWalletCompleted(userAddress)
            : false;
    }, [_hasHydrated, userAddress, isWalletCompleted]);

    const showIMOther = values.im === 'Others';

    const setField = <K extends keyof FormValues>(
        key: K,
        value: FormValues[K],
    ) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const updateChannel = (
        id: string,
        field: keyof SocialChannel,
        value: string,
    ) => {
        setValues((prev) => ({
            ...prev,
            socialChannels: prev.socialChannels.map((c) =>
                c.id === id ? { ...c, [field]: value } : c,
            ),
        }));
    };

    const addSocialChannel = () => {
        const newChannel: SocialChannel = {
            id: makeId(),
            platform: '',
            link: '',
            followers: '',
            language: '',
        };

        setValues((prev) => ({
            ...prev,
            socialChannels: [...prev.socialChannels, newChannel],
        }));
    };

    const removeSocialChannel = (id: string) => {
        setValues((prev) => ({
            ...prev,
            socialChannels: prev.socialChannels.filter((c) => c.id !== id),
        }));
        setChannelErrors((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const validate = (): boolean => {
        const nextErrors: Record<string, string> = {};
        const nextChannelErrors: Record<
            string,
            Partial<Record<keyof SocialChannel, string>>
        > = {};

        if (!values.firstName.trim())
            nextErrors.firstName = 'First name is required';
        if (!values.lastName.trim())
            nextErrors.lastName = 'Last name is required';
        if (!values.email.trim()) nextErrors.email = 'Email is required';
        if (values.email && !/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) {
            nextErrors.email = 'Invalid email address';
        }
        if (!values.phone.trim()) nextErrors.phone = 'Phone number is required';
        if (!values.socialName.trim())
            nextErrors.socialName = 'Social name is required';

        if (!values.im) nextErrors.im = 'IM platform is required';
        if (showIMOther && !values.imOther.trim()) {
            nextErrors.imOther = 'Please specify the IM platform';
        }
        if (!values.imHandle.trim())
            nextErrors.imHandle = 'IM handle is required';

        if (!values.upgradeRequest)
            nextErrors.upgradeRequest = 'Please select an option';

        if (!values.agreementAccepted) {
            nextErrors.agreementAccepted = 'You must accept the agreement';
        }

        const channels = values.socialChannels;
        if (!channels || channels.length === 0) {
            nextErrors.socialChannels =
                'Please add at least one social channel';
        } else {
            for (const channel of channels) {
                const ce: Partial<Record<keyof SocialChannel, string>> = {};
                if (!channel.platform) ce.platform = 'Platform is required';
                if (!channel.link.trim()) ce.link = 'Link is required';
                if (!channel.followers.trim())
                    ce.followers = 'Followers count is required';
                if (!channel.language) ce.language = 'Language is required';
                if (Object.keys(ce).length > 0)
                    nextChannelErrors[channel.id] = ce;
            }
        }

        setErrors(nextErrors);
        setChannelErrors(nextChannelErrors);

        return (
            Object.keys(nextErrors).length === 0 &&
            Object.keys(nextChannelErrors).length === 0
        );
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!userAddress) {
            notificationService.addNotification(
                `affiliate-form-${Date.now()}`,
                {
                    type: 'error',
                    title: 'Wallet required',
                    message: 'Please connect your wallet before submitting.',
                },
            );
            return;
        }

        if (!validate()) {
            notificationService.addNotification(
                `affiliate-form-${Date.now()}`,
                {
                    type: 'error',
                    title: 'Please fix the form',
                    message: 'Some required fields are missing or invalid.',
                },
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/hubspot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    im:
                        values.im === 'Others'
                            ? values.imOther || ''
                            : values.im,
                    imHandle: values.imHandle,
                    socialName: values.socialName,
                    walletAddress: userAddress,
                    socialChannels: values.socialChannels,
                    upgradeRequest:
                        values.upgradeRequest === 'yes' ? 'Yes' : 'NA',
                    recommenderName: values.recommenderName || '',
                    recommenderEmail: values.recommenderEmail || '',
                    affiliateAgreement: values.agreementAccepted,
                }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json?.error || 'Failed to submit form');
            }

            notificationService.addNotification(
                `affiliate-form-${Date.now()}`,
                {
                    type: 'success',
                    title: 'Application submitted',
                    message: 'Your application was submitted successfully.',
                },
            );

            addCompletedWallet(userAddress);
        } catch (err) {
            notificationService.addNotification(
                `affiliate-form-${Date.now()}`,
                {
                    type: 'error',
                    title: 'Submission failed',
                    message:
                        err instanceof Error
                            ? err.message
                            : 'Failed to submit application. Please try again.',
                    duration: 10000,
                },
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCompleted) {
        return <ApplicationPendingCard />;
    }

    return (
        <form onSubmit={onSubmit} className={styles['animate-fade-in']}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                }}
            >
                <div className={styles['glass-card']}>
                    <h2
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--aff-text-primary)',
                            marginBottom: '1rem',
                        }}
                    >
                        Contact Information
                    </h2>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            First Name{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <input
                            className={styles.input}
                            value={values.firstName}
                            onChange={(e) =>
                                setField('firstName', e.target.value)
                            }
                            placeholder='Enter your first name'
                        />
                        {errors.firstName && (
                            <div className={styles['form-error']}>
                                {errors.firstName}
                            </div>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            Last Name{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <input
                            className={styles.input}
                            value={values.lastName}
                            onChange={(e) =>
                                setField('lastName', e.target.value)
                            }
                            placeholder='Enter your last name'
                        />
                        {errors.lastName && (
                            <div className={styles['form-error']}>
                                {errors.lastName}
                            </div>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            Email{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <input
                            className={styles.input}
                            type='email'
                            value={values.email}
                            onChange={(e) => setField('email', e.target.value)}
                            placeholder='your@email.com'
                        />
                        {errors.email && (
                            <div className={styles['form-error']}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            Phone{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <input
                            className={styles.input}
                            type='tel'
                            value={values.phone}
                            onChange={(e) => setField('phone', e.target.value)}
                            placeholder='+1234567890'
                        />
                        {errors.phone && (
                            <div className={styles['form-error']}>
                                {errors.phone}
                            </div>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            Social Name{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <input
                            className={styles.input}
                            value={values.socialName}
                            onChange={(e) =>
                                setField('socialName', e.target.value)
                            }
                            placeholder='Enter your social name'
                        />
                        {errors.socialName && (
                            <div className={styles['form-error']}>
                                {errors.socialName}
                            </div>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            IM Platform{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <select
                            className={styles.select}
                            value={values.im}
                            onChange={(e) => setField('im', e.target.value)}
                        >
                            <option value=''>Select IM platform</option>
                            {IM_PLATFORMS.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        {errors.im && (
                            <div className={styles['form-error']}>
                                {errors.im}
                            </div>
                        )}
                    </div>

                    {showIMOther && (
                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>
                                Other IM Platform{' '}
                                <span className={styles['form-label-required']}>
                                    *
                                </span>
                            </label>
                            <input
                                className={styles.input}
                                value={values.imOther}
                                onChange={(e) =>
                                    setField('imOther', e.target.value)
                                }
                                placeholder='Enter platform name'
                            />
                            {errors.imOther && (
                                <div className={styles['form-error']}>
                                    {errors.imOther}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            {values.im === 'Others' ? 'IM' : values.im || 'IM'}{' '}
                            Handle/Username{' '}
                            <span className={styles['form-label-required']}>
                                *
                            </span>
                        </label>
                        <input
                            className={styles.input}
                            value={values.imHandle}
                            onChange={(e) =>
                                setField('imHandle', e.target.value)
                            }
                            placeholder={
                                values.im === 'Telegram'
                                    ? '@username'
                                    : 'Enter your handle'
                            }
                        />
                        {errors.imHandle && (
                            <div className={styles['form-error']}>
                                {errors.imHandle}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles['glass-card']}>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--aff-text-primary)',
                                marginBottom: '0.25rem',
                            }}
                        >
                            Social Channels
                        </h2>
                        <p
                            style={{
                                fontSize: '0.875rem',
                                color: 'var(--aff-text-muted)',
                            }}
                        >
                            Please share at least one active channel link,
                            follower count and language used.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        {values.socialChannels.map((channel) => {
                            const ce = channelErrors[channel.id] || {};
                            return (
                                <div
                                    key={channel.id}
                                    className={styles['glass-card']}
                                    style={{ padding: '1rem' }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.75rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: 'var(--aff-text-primary)',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Channel
                                        </div>
                                        {values.socialChannels.length > 1 && (
                                            <button
                                                type='button'
                                                className={
                                                    styles['modal-close']
                                                }
                                                onClick={() =>
                                                    removeSocialChannel(
                                                        channel.id,
                                                    )
                                                }
                                                aria-label='Remove channel'
                                            >
                                                <IoClose size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <div className={styles['form-group']}>
                                        <label className={styles['form-label']}>
                                            Platform{' '}
                                            <span
                                                className={
                                                    styles[
                                                        'form-label-required'
                                                    ]
                                                }
                                            >
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className={styles.select}
                                            value={channel.platform}
                                            onChange={(e) =>
                                                updateChannel(
                                                    channel.id,
                                                    'platform',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value=''>
                                                Select platform
                                            </option>
                                            {SOCIAL_PLATFORMS.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </select>
                                        {ce.platform && (
                                            <div
                                                className={styles['form-error']}
                                            >
                                                {ce.platform}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles['form-group']}>
                                        <label className={styles['form-label']}>
                                            Link{' '}
                                            <span
                                                className={
                                                    styles[
                                                        'form-label-required'
                                                    ]
                                                }
                                            >
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className={styles.input}
                                            value={channel.link}
                                            onChange={(e) =>
                                                updateChannel(
                                                    channel.id,
                                                    'link',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder='https://...'
                                        />
                                        {ce.link && (
                                            <div
                                                className={styles['form-error']}
                                            >
                                                {ce.link}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles['form-group']}>
                                        <label className={styles['form-label']}>
                                            Followers/Subscribers{' '}
                                            <span
                                                className={
                                                    styles[
                                                        'form-label-required'
                                                    ]
                                                }
                                            >
                                                *
                                            </span>
                                        </label>
                                        <input
                                            className={styles.input}
                                            value={channel.followers}
                                            onChange={(e) =>
                                                updateChannel(
                                                    channel.id,
                                                    'followers',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder='0'
                                        />
                                        {ce.followers && (
                                            <div
                                                className={styles['form-error']}
                                            >
                                                {ce.followers}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles['form-group']}>
                                        <label className={styles['form-label']}>
                                            Language{' '}
                                            <span
                                                className={
                                                    styles[
                                                        'form-label-required'
                                                    ]
                                                }
                                            >
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className={styles.select}
                                            value={channel.language}
                                            onChange={(e) =>
                                                updateChannel(
                                                    channel.id,
                                                    'language',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value=''>
                                                Select language
                                            </option>
                                            {LANGUAGE_OPTIONS.map((l) => (
                                                <option key={l} value={l}>
                                                    {l}
                                                </option>
                                            ))}
                                        </select>
                                        {ce.language && (
                                            <div
                                                className={styles['form-error']}
                                            >
                                                {ce.language}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {errors.socialChannels && (
                        <div
                            className={styles['form-error']}
                            style={{ marginTop: '0.75rem' }}
                        >
                            {errors.socialChannels}
                        </div>
                    )}

                    <div style={{ paddingTop: '0.75rem' }}>
                        <button
                            type='button'
                            onClick={addSocialChannel}
                            className={`${styles.btn} ${styles['btn-secondary']}`}
                        >
                            <IoAdd size={16} />
                            Add Social Channel
                        </button>
                    </div>
                </div>

                <div className={styles['glass-card']}>
                    <h2
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--aff-text-primary)',
                            marginBottom: '1rem',
                        }}
                    >
                        Referral Upgrade Request (For Referrer to Affiliate
                        ONLY)
                        <span className={styles['form-label-required']}>
                            {' '}
                            *
                        </span>
                    </h2>

                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: 'var(--aff-text-secondary)',
                            marginBottom: '0.75rem',
                        }}
                    >
                        I confirm that I meet the eligibility criteria for a
                        referral to affiliate upgrade:
                    </p>

                    <ul
                        style={{
                            marginBottom: '0.75rem',
                            paddingLeft: '1.25rem',
                            color: 'var(--aff-text-tertiary)',
                            fontSize: '0.875rem',
                        }}
                    >
                        <li>
                            I have successfully invited more than 10 users who
                            have completed their first trades.
                        </li>
                        <li>
                            The cumulative trading volume of my invitees within
                            a 30-day period exceeds $10 million.
                        </li>
                    </ul>

                    <div
                        style={{
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'center',
                        }}
                    >
                        <label className={styles['checkbox-container']}>
                            <input
                                type='radio'
                                name='upgradeRequest'
                                value='yes'
                                checked={values.upgradeRequest === 'yes'}
                                onChange={() =>
                                    setField('upgradeRequest', 'yes')
                                }
                            />
                            <span
                                style={{ color: 'var(--aff-text-secondary)' }}
                            >
                                YES
                            </span>
                        </label>

                        <label className={styles['checkbox-container']}>
                            <input
                                type='radio'
                                name='upgradeRequest'
                                value='na'
                                checked={values.upgradeRequest === 'na'}
                                onChange={() =>
                                    setField('upgradeRequest', 'na')
                                }
                            />
                            <span
                                style={{ color: 'var(--aff-text-secondary)' }}
                            >
                                NA
                            </span>
                        </label>
                    </div>

                    {errors.upgradeRequest && (
                        <div
                            className={styles['form-error']}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {errors.upgradeRequest}
                        </div>
                    )}

                    <p
                        style={{
                            paddingTop: '0.75rem',
                            fontSize: '0.75rem',
                            color: 'var(--aff-text-muted)',
                            fontStyle: 'italic',
                        }}
                    >
                        Note: Eligibility will be verified based on invitee
                        activity and trading volume.
                    </p>
                </div>

                <div className={styles['glass-card']}>
                    <h2
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--aff-text-primary)',
                            marginBottom: '1rem',
                        }}
                    >
                        Recommended By
                    </h2>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            Recommender Name
                        </label>
                        <input
                            className={styles.input}
                            value={values.recommenderName}
                            onChange={(e) =>
                                setField('recommenderName', e.target.value)
                            }
                            placeholder="Enter recommender's name (optional)"
                        />
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>
                            Recommender Email
                        </label>
                        <input
                            className={styles.input}
                            type='email'
                            value={values.recommenderEmail}
                            onChange={(e) =>
                                setField('recommenderEmail', e.target.value)
                            }
                            placeholder='recommender@email.com (optional)'
                        />
                    </div>
                </div>

                <div className={styles['glass-card']}>
                    <h2
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--aff-text-primary)',
                            marginBottom: '1rem',
                        }}
                    >
                        Affiliate Agreement
                        <span className={styles['form-label-required']}>
                            {' '}
                            *
                        </span>
                    </h2>

                    <label className={styles['checkbox-container']}>
                        <input
                            type='checkbox'
                            checked={values.agreementAccepted}
                            onChange={(e) =>
                                setField('agreementAccepted', e.target.checked)
                            }
                        />
                        <span
                            style={{
                                color: 'var(--aff-text-secondary)',
                                fontSize: '0.875rem',
                            }}
                        >
                            I agree to the Ambient Affiliate Agreement and
                            Privacy Policy.
                            <span className={styles['form-label-required']}>
                                {' '}
                                *
                            </span>
                        </span>
                    </label>

                    {errors.agreementAccepted && (
                        <div
                            className={styles['form-error']}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {errors.agreementAccepted}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-lg']}`}
                    >
                        {isSubmitting ? 'Submitting…' : 'Submit'}
                    </button>
                </div>
            </div>
        </form>
    );
}
