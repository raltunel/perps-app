import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import {
    isEstablished,
    SessionButton,
    useSession,
} from '@fogo/sessions-sdk-react';
import { UserIdentifierType } from '@fuul/sdk';
import styles from './CodeTabs.module.css';
import Tabs from '~/components/Tabs/Tabs';
import { motion } from 'framer-motion';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import { useUserDataStore } from '~/stores/UserDataStore';
import { Fuul } from '@fuul/sdk';
import { URL_PARAMS, useUrlParams } from '~/hooks/useURLParams';
import { useReferralStore } from '~/stores/ReferralStore';
import { useNarrowScreen } from '~/hooks/useMediaQuery';
import { Trans, useTranslation } from 'react-i18next';
import getReferrerAsync from '~/utils/functions/getReferrerAsync';
import { FaCheck } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';

interface PropsIF {
    initialTab?: string;
}

const COPY_PER_SCREEN_WIDTH = {
    enterCode: {
        full: 'referrals.enterCode',
        short: 'common.enter',
    },
    createCode: {
        full: 'referrals.createCode',
        short: 'common.create',
    },
    claim: {
        full: 'common.claim',
        short: 'common.claim',
    },
};

// fee amounts for affiliate and the referred user
const AFFILIATE_PERCENT = '10%';
const USER_PERCENT = '4%';

export default function CodeTabs(props: PropsIF) {
    const { initialTab = 'referrals.enterCode' } = props;
    const [activeTab, setActiveTab] = useState(initialTab);
    const [temporaryAffiliateCode, setTemporaryAffiliateCode] = useState('');
    const [isTemporaryAffiliateCodeValid, setIsTemporaryAffiliateCodeValid] =
        useState<boolean | undefined>();
    const [affiliateCode, setAffiliateCode] = useState('');
    const sessionState = useSession();
    const userDataStore = useUserDataStore();
    const referralStore = useReferralStore();

    const { t } = useTranslation();

    const [editModeReferral, setEditModeReferral] = useState<boolean>(false);
    const [editModeAffiliate, setEditModeAffiliate] = useState<boolean>(false);
    const [userIsConverted, setUserIsConverted] = useState<boolean>(false);

    useEffect(() => {
        if (!referralStore.cached) {
            setEditModeReferral(true);
        }
    }, [referralStore.cached]);

    const handleTabChange = (tab: string) => {
        if (affiliateCode) {
            setEditModeAffiliate(false);
        }
        setTemporaryAffiliateCode('');
        setActiveTab(tab);
    };

    const isSessionEstablished = useMemo<boolean>(
        () => isEstablished(sessionState),
        [sessionState],
    );

    const handleReferralURLParam = useUrlParams(URL_PARAMS.referralCode);

    const [invalidCode, setInvalidCode] = useState<string>('');
    // fn to update a referral code and trigger FUUL confirmation workflow
    async function handleUpdateReferralCode(r: string): Promise<void> {
        // Don't make API calls with empty or whitespace-only codes
        if (!r || !r.trim()) {
            return;
        }

        // check FUUL API to see if code is claimed or free
        const codeIsFree: boolean = await Fuul.isAffiliateCodeFree(r);
        // if code is unclaimed, record as invalid and exit fn
        // else, execute workflows for a valid referral code
        if (codeIsFree) {
            setInvalidCode(r);
            setIsCachedValueValid(false);
        } else {
            invalidCode && setInvalidCode('');
            handleReferralURLParam.set(r);
            referralStore.cache(r);
            setIsCachedValueValid(true);
            setEditModeReferral(false);
        }
    }

    // pixel-width breakpoint to toggle shorter copy
    const NARROW_SCREEN_COPY_BREAKPOINT = 900;
    // boolean tracking whether the screen is "narrow"
    const narrowScreenForCopy: boolean = useNarrowScreen(
        NARROW_SCREEN_COPY_BREAKPOINT,
    );

    // array of tab name strings based on screen width
    const avTabs = useMemo<string[]>(() => {
        // return an array of tab names based on the screen width type
        return Object.values(COPY_PER_SCREEN_WIDTH).map(
            (tab) => tab[narrowScreenForCopy ? 'short' : 'full'],
        );
    }, [narrowScreenForCopy]);

    // keep the correct tab highlighted when screen width changes
    useEffect(() => {
        // find which key in COPY_PER_SCREEN_WIDTH matches the current activeTab
        const currentKey = Object.entries(COPY_PER_SCREEN_WIDTH).find(
            ([_, value]) =>
                value.full === activeTab || value.short === activeTab,
        )?.[0] as keyof typeof COPY_PER_SCREEN_WIDTH | undefined;

        if (currentKey) {
            const currentTabCopySet = COPY_PER_SCREEN_WIDTH[currentKey];
            // get the updated tab name based on new screen width type
            const updatedTabName =
                currentTabCopySet[narrowScreenForCopy ? 'short' : 'full'];
            // update the value `activeTab` to the updated tab name
            setActiveTab(updatedTabName);
        }
    }, [narrowScreenForCopy]);

    const affiliateAddress = userDataStore.userAddress;
    const prevAffiliateAddress = useRef<string | undefined>(undefined);

    useEffect(() => {
        // Only clear when switching between different wallets, not on initial connect
        if (
            prevAffiliateAddress.current &&
            prevAffiliateAddress.current !== affiliateAddress?.toString()
        ) {
            setTemporaryAffiliateCode('');
            referralStore.clear();
        }
        prevAffiliateAddress.current = affiliateAddress?.toString();
    }, [affiliateAddress]);

    const updateReferralCodeInputRef = useRef<HTMLInputElement>(null);

    const [isCachedValueValid, setIsCachedValueValid] = useState<
        boolean | undefined
    >(undefined);

    useEffect(() => {
        if (isCachedValueValid !== undefined) {
            return;
        }

        // Don't validate if there's no cached code
        if (!referralStore.cached) {
            return;
        }

        (async () => {
            try {
                const isCachedCodeFree: boolean =
                    await Fuul.isAffiliateCodeFree(referralStore.cached);

                if (isCachedCodeFree) {
                    referralStore.clear();
                    setEditModeReferral(true);
                }
                setIsCachedValueValid(!isCachedCodeFree);
            } catch (error) {
                console.error(
                    '[CodeTabs] Error validating cached code:',
                    error,
                );
                // On error, assume invalid to be safe
                setIsCachedValueValid(false);
            }
        })();
    }, [referralStore.cached]);

    const currentCodeElem = (
        <section className={styles.sectionWithButton}>
            <div className={styles.enterCodeContent}>
                <h6>{t('referrals.usingAffiliateCode')}</h6>
                {isCachedValueValid && <p>{referralStore.cached}</p>}
            </div>
            {!userIsConverted && referralStore.cached && (
                <div className={styles.refferal_code_buttons}>
                    <SimpleButton
                        bg='dark3'
                        onClick={() => setEditModeReferral(true)}
                    >
                        {t('common.edit')}
                    </SimpleButton>
                </div>
            )}
        </section>
    );

    const tempAffiliateCodeCharsValidate = useMemo<boolean>(() => {
        return checkForPermittedCharacters(temporaryAffiliateCode);
    }, [temporaryAffiliateCode]);

    const [refCodeLength, setRefCodeLength] = useState<number>(
        referralStore.cached.length,
    );

    const enterNewCodeElem = (
        <section className={styles.sectionWithButton}>
            <div className={styles.enterCodeContent}>
                <h6>
                    {referralStore.cached
                        ? t('referrals.overwriteCurrentReferralCode') + ': '
                        : t('referrals.enterReferralCode') + ': '}
                    <span style={{ color: 'var(--accent3)' }}>
                        {referralStore.cached}
                    </span>
                </h6>
                <input
                    ref={updateReferralCodeInputRef}
                    type='text'
                    defaultValue={referralStore.cached}
                    onChange={async (e) => {
                        // set refCodeLength to length of input
                        setRefCodeLength(e.target.value.length);
                        // determine if ref code exists in FUUL system
                        const isCachedCodeFree: boolean =
                            await Fuul.isAffiliateCodeFree(e.target.value);
                        setInvalidCode(isCachedCodeFree ? e.target.value : '');
                    }}
                />
                <div className={styles.validation_item}>
                    {refCodeLength <= 30 && refCodeLength >= 2 ? (
                        <FaCheck size={10} color='var(--green)' />
                    ) : (
                        <GiCancel size={10} color='var(--red)' />
                    )}
                    <p>2 - 30 characters</p>
                </div>
                <div className={styles.validation_item}>
                    {tempAffiliateCodeCharsValidate ? (
                        <FaCheck size={10} color='var(--green)' />
                    ) : (
                        <GiCancel size={10} color='var(--red)' />
                    )}
                    <p>Alphanumeric and hyphens (A-Z, a-z, 0-9, -)</p>
                </div>
                {invalidCode && (
                    <p>
                        <Trans
                            i18nKey='referrals.referralCodeNotValidPleaseConfirm'
                            values={{ invalidCode }}
                            components={[
                                <span style={{ color: 'var(--accent3)' }} />,
                            ]}
                        />
                    </p>
                )}
            </div>
            <div className={styles.refferal_code_buttons}>
                <SimpleButton
                    bg='accent1'
                    disabled={refCodeLength < 2 || refCodeLength > 30}
                    onClick={(): void => {
                        handleUpdateReferralCode(
                            updateReferralCodeInputRef.current?.value || '',
                        );
                    }}
                >
                    {t('common.confirm')}
                </SimpleButton>
                {referralStore.cached && isCachedValueValid && (
                    <SimpleButton
                        bg='dark3'
                        hoverBg='accent1'
                        onClick={() => {
                            setEditModeReferral(false);
                            setInvalidCode('');
                        }}
                    >
                        {t('common.cancel')}2as
                    </SimpleButton>
                )}
            </div>
        </section>
    );

    useEffect(() => {
        (async () => {
            if (isEstablished(sessionState)) {
                const userWalletKey =
                    sessionState.walletPublicKey ||
                    sessionState.sessionPublicKey;

                const affiliateCode = await Fuul.getAffiliateCode(
                    userWalletKey.toString(),
                    UserIdentifierType.SolanaAddress,
                );

                if (affiliateCode) {
                    setAffiliateCode(affiliateCode);
                }

                const referrer = await getReferrerAsync(
                    userWalletKey.toString(),
                );
                if (referrer?.referrer_identifier) {
                    setUserIsConverted(true);
                    const affiliateCode = await Fuul.getAffiliateCode(
                        referrer.referrer_identifier as string,
                        UserIdentifierType.SolanaAddress,
                    );
                    if (affiliateCode) {
                        handleUpdateReferralCode(affiliateCode);
                    }
                } else {
                    setUserIsConverted(false);
                }
            } else {
                console.error('No wallet connected');
                setAffiliateCode('');
            }
        })();
    }, [sessionState]);

    useEffect(() => {
        // If no temporary code, immediately set as valid
        if (!temporaryAffiliateCode) {
            setIsTemporaryAffiliateCodeValid(undefined);
            return;
        }

        // Set up debounced validation
        const timer = setTimeout(async () => {
            try {
                const codeIsFree = await Fuul.isAffiliateCodeFree(
                    temporaryAffiliateCode,
                );
                setIsTemporaryAffiliateCodeValid(codeIsFree);
            } catch (error) {
                console.error(
                    'Error checking affiliate code availability:',
                    error,
                );
                setIsTemporaryAffiliateCodeValid(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [temporaryAffiliateCode]);

    /**
     * Creates an affiliate code for the user
     */
    const createAffiliateCode = async () => {
        try {
            // Get the user's wallet address from the session
            // @ts-ignore - The session type might not be fully typed
            if (isEstablished(sessionState)) {
                const userWalletKey =
                    sessionState.walletPublicKey ||
                    sessionState.sessionPublicKey;

                if (!userWalletKey) {
                    console.error('No wallet connected');
                    return;
                }

                // Create the message to sign
                // this text must match FUUL requirements exactly, coordinate changes with @Ben
                const message = `I confirm that I am creating the ${temporaryAffiliateCode} code`;

                // Convert message to Uint8Array
                const messageBytes = new TextEncoder().encode(message);

                try {
                    // Get the signature from the session
                    const signatureBytes =
                        await sessionState.signMessage(messageBytes);

                    // Convert the signature to base64
                    const signatureArray = Array.from(
                        new Uint8Array(signatureBytes),
                    );
                    const binaryString = String.fromCharCode.apply(
                        null,
                        signatureArray,
                    );
                    const signature = btoa(binaryString);

                    // Call the Fuul SDK to create the affiliate code
                    await Fuul.createAffiliateCode({
                        userIdentifier: userWalletKey.toString(),
                        identifierType: UserIdentifierType.SolanaAddress,
                        signature,
                        signaturePublicKey: userWalletKey.toString(),
                        code: temporaryAffiliateCode,
                    });

                    setTemporaryAffiliateCode('');
                    setAffiliateCode(temporaryAffiliateCode);
                } catch (error) {
                    console.error(
                        'Error signing message or creating affiliate code:',
                        error,
                    );
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error creating affiliate code:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const updateAffiliateCode = async () => {
        try {
            if (isEstablished(sessionState)) {
                const userWalletKey =
                    sessionState.walletPublicKey ||
                    sessionState.sessionPublicKey;

                if (!userWalletKey) {
                    console.error('No wallet connected');
                    return;
                }

                // Create the message to sign
                // this text must match FUUL requirements exactly, coordinate changes with @Ben
                const message = `I confirm that I am updating my code to ${temporaryAffiliateCode}`;

                // Convert message to Uint8Array
                const messageBytes = new TextEncoder().encode(message);
                // Get the signature from the session
                const signatureBytes =
                    await sessionState.signMessage(messageBytes);

                // Convert the signature to base64
                const signatureArray = Array.from(
                    new Uint8Array(signatureBytes),
                );
                const binaryString = String.fromCharCode.apply(
                    null,
                    signatureArray,
                );
                const signature = btoa(binaryString);

                await Fuul.updateAffiliateCode({
                    userIdentifier: userWalletKey.toString(), // the address of the user
                    identifierType: UserIdentifierType.SolanaAddress, // evm_address | solana_address | xrpl_address
                    signature,
                    signaturePublicKey: userWalletKey.toString(), // Only for XRPL type signatures
                    code: temporaryAffiliateCode,
                });

                setAffiliateCode(temporaryAffiliateCode);
                setTemporaryAffiliateCode('');
                setEditModeAffiliate(false);
            }
        } catch (error) {
            console.error('Error updating affiliate code:', error);
        }
    };

    const [trackingLink, setTrackingLink] = useState('');

    // reset affiliate address input when user changes wallet
    useEffect(() => setTemporaryAffiliateCode(''), [affiliateAddress]);

    useEffect(() => {
        (async () => {
            if (!affiliateCode || !affiliateAddress) return '';
            const trackingLinkUrl = await Fuul.generateTrackingLink(
                'https://perps.ambient.finance',
                affiliateAddress.toString(),
                UserIdentifierType.SolanaAddress,
            );
            setTrackingLink(trackingLinkUrl);
        })();
    }, [affiliateCode]);

    function checkForPermittedCharacters(input: string): boolean {
        if (input.length === 0) return true;
        for (let i: number = 0; i < input.length; i++) {
            const char: string = input[i];
            const isAlphanumeric: boolean =
                (char >= 'A' && char <= 'Z') ||
                (char >= 'a' && char <= 'z') ||
                (char >= '0' && char <= '9');
            const isHyphen: boolean = char === '-';

            if (!isAlphanumeric && !isHyphen) {
                return false;
            }
        }
        return true;
    }

    const affiliateCodeElem = isSessionEstablished ? (
        affiliateCode && !editModeAffiliate ? (
            <section className={styles.sectionWithButton}>
                <div className={styles.createCodeContent}>
                    <p>{t('referrals.yourCodeIs', { affiliateCode })}</p>

                    {trackingLink && (
                        <div className={styles.walletLink}>
                            <a href={trackingLink} target='_blank'>
                                {trackingLink}
                            </a>
                        </div>
                    )}
                    <p className={styles.trackingLinkExplanation}>
                        <Trans
                            i18nKey='referrals.trackingLinkExplanation'
                            values={{
                                affiliatePercent: AFFILIATE_PERCENT,
                                userPercent: USER_PERCENT,
                            }}
                            components={[<span />, <span />]}
                        />
                    </p>
                </div>
                <SimpleButton
                    bg='accent1'
                    onClick={() => setEditModeAffiliate(true)}
                >
                    {t('common.edit')}
                </SimpleButton>
            </section>
        ) : (
            <section className={styles.sectionWithButton}>
                <div className={styles.enterCodeContent}>
                    <h6>{t('referrals.createAnAffiliateCode')}</h6>
                    <input
                        type='text'
                        value={temporaryAffiliateCode}
                        onChange={(e) =>
                            setTemporaryAffiliateCode(e.target.value)
                        }
                        onKeyDown={async (e) => {
                            if (
                                e.key === 'Enter' &&
                                temporaryAffiliateCode.trim()
                            ) {
                                editModeAffiliate
                                    ? updateAffiliateCode()
                                    : createAffiliateCode();
                            }
                        }}
                    />
                    <div className={styles.validation_item}>
                        {temporaryAffiliateCode.length <= 30 &&
                        temporaryAffiliateCode.length >= 2 ? (
                            <FaCheck size={10} color='var(--green)' />
                        ) : (
                            <GiCancel size={10} color='var(--red)' />
                        )}
                        <p>2 - 30 characters</p>
                    </div>
                    <div className={styles.validation_item}>
                        {tempAffiliateCodeCharsValidate ? (
                            <FaCheck size={10} color='var(--green)' />
                        ) : (
                            <GiCancel size={10} color='var(--red)' />
                        )}
                        <p>Alphanumeric and hyphens (A-Z, a-z, 0-9, -)</p>
                    </div>
                    <h6>{t('referrals.createAUniqueCodeToEarn')}</h6>
                </div>
                <div className={styles.refferal_code_buttons}>
                    <SimpleButton
                        bg='accent1'
                        onClick={
                            editModeAffiliate
                                ? updateAffiliateCode
                                : createAffiliateCode
                        }
                        disabled={
                            !temporaryAffiliateCode.trim() ||
                            !isTemporaryAffiliateCodeValid ||
                            !tempAffiliateCodeCharsValidate ||
                            temporaryAffiliateCode.length > 30 ||
                            temporaryAffiliateCode.length < 2
                        }
                    >
                        {isTemporaryAffiliateCodeValid === false
                            ? t('referrals.codeAlreadyInUse')
                            : t(
                                  editModeAffiliate
                                      ? 'common.update'
                                      : 'common.create',
                              )}
                    </SimpleButton>
                    {editModeAffiliate && !referralStore.cached && (
                        <SimpleButton
                            bg='dark4'
                            hoverBg='accent1'
                            onClick={() => {
                                setEditModeAffiliate(false);
                                setTemporaryAffiliateCode('');
                            }}
                        >
                            {t('common.cancel')}1
                        </SimpleButton>
                    )}
                </div>
            </section>
        )
    ) : (
        <section className={styles.sectionWithButton}>
            <div className={styles.enterCodeContent}>
                <h6>{t('referrals.connectYourWallet.affiliate')}</h6>
            </div>
            <SessionButton />
        </section>
    );

    const claimElem = isSessionEstablished ? (
        <section className={styles.sectionWithButton}>
            <div className={styles.claimContent}>
                <p>
                    {t('referrals.claimRewardsWithAmount', { amount: '$0.00' })}
                </p>
            </div>
            <SimpleButton bg='accent1'>{t('common.claim')}</SimpleButton>
        </section>
    ) : (
        <section className={styles.sectionWithButton}>
            <div className={styles.enterCodeContent}>
                <h6>{t('referrals.connectYourWallet.claim')}</h6>
            </div>
            <SessionButton />
        </section>
    );

    const renderTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'referrals.enterCode':
            case 'common.enter':
                // Show input form when:
                // - User is in edit mode
                // - There's no cached code
                // - Cached code was validated as invalid
                const shouldShowInput =
                    editModeReferral ||
                    !referralStore.cached ||
                    isCachedValueValid === false;
                return shouldShowInput ? enterNewCodeElem : currentCodeElem;
            case 'referrals.createCode':
            case 'common.create':
                return affiliateCodeElem;
            case 'common.claim':
                return claimElem;
            default:
                return (
                    <div className={styles.emptyState}>
                        {t('referrals.selectATabToViewData')}
                    </div>
                );
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <Tabs
                tabs={avTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                wrapperId='codeTabs'
                layoutIdPrefix='codeTabIndicator'
                flex
            />
            <motion.div
                className={styles.tableContent}
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {renderTabContent()}
            </motion.div>
        </div>
    );
}
