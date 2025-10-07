import {
    isEstablished,
    SessionButton,
    useSession,
} from '@fogo/sessions-sdk-react';
import { useEffect, useRef, useState } from 'react';
// import { AiOutlineQuestionCircle } from 'react-icons/ai';
// import {
//     DFLT_EMBER_MARKET,
//     getUserMarginBucket,
//     USD_MINT,
// } from '@crocswap-libs/ambient-ember';
import { LuChevronDown, LuChevronUp, LuSettings } from 'react-icons/lu';
import { MdOutlineClose, MdOutlineMoreHoriz } from 'react-icons/md';
import { Link, useLocation } from 'react-router';
import { useKeydown } from '~/hooks/useKeydown';
import useMediaQuery, { useShortScreen } from '~/hooks/useMediaQuery';
import { useModal } from '~/hooks/useModal';
import useOutsideClick from '~/hooks/useOutsideClick';
import { useUnifiedMarginData } from '~/hooks/useUnifiedMarginData';
import { usePortfolioModals } from '~/routes/portfolio/usePortfolioModals';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import AppOptions from '../AppOptions/AppOptions';
import Modal from '../Modal/Modal';
import Tooltip from '../Tooltip/Tooltip';
import DropdownMenu from './DropdownMenu/DropdownMenu';
import HelpDropdown from './HelpDropdown/HelpDropdown';
import MoreDropdown from './MoreDropdown/MoreDropdown';
import styles from './PageHeader.module.css';
import RpcDropdown from './RpcDropdown/RpcDropdown';
// import WalletDropdown from './WalletDropdown/WalletDropdown';
import { getDurationSegment } from '~/utils/functions/getSegment';
import DepositDropdown from './DepositDropdown/DepositDropdown';
import { useUserDataStore } from '~/stores/UserDataStore';
import FeedbackModal from '../FeedbackModal/FeedbackModal';
import {
    URL_PARAMS,
    useUrlParams,
    type UrlParamMethodsIF,
} from '~/hooks/useURLParams';
import ReferralCodeModal from './ReferralCodeModal/ReferralCodeModal';
import { useReferralStore, type RefCodeIF } from '~/stores/ReferralStore';
import { useTranslation } from 'react-i18next';
import { Fuul, UserIdentifierType } from '@fuul/sdk';

interface FuulConversionIF {
    user_identifier: string;
    referrer_identifier: string;
    referrer_code: string | null;
}

export default function PageHeader() {
    // Feedback modal state
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleFeedbackClose = () => {
        setIsFeedbackOpen(false);
    };

    const referralCodeFromURL: UrlParamMethodsIF = useUrlParams(
        URL_PARAMS.referralCode,
    );

    // logic to read a URL referral code and set in state + local storage
    const userDataStore = useUserDataStore();
    // ref to ensure that the intialization only happens once
    // const isRefCodeInitialized = useRef<boolean>(!!userDataStore.refCode.value);
    // initialize ref code if relevant
    // if (!isRefCodeInitialized.current) {
    //     isRefCodeInitialized.current = true;
    //     referralCodeFromURL.value &&
    //         userDataStore.initializeRefCode(referralCodeFromURL.value);
    // }
    // useEffect(() => {
    //     if (referralCodeURL.value) {
    //         userDataStore.setReferralCode(referralCodeURL.value);
    //         // const newSearchParams = new URLSearchParams(
    //         //     searchParams.toString(),
    //         // );
    //         // newSearchParams.delete(REFERRAL_CODE_URL_PARAM);
    //         // const newUrl = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
    //         // window.history.replaceState({}, '', newUrl); // remove referral code from URL
    //     }
    // }, [referralCodeURL.value]);

    const referralStore = useReferralStore();
    const { t } = useTranslation();

    const sessionState = useSession();

    const isUserConnected = isEstablished(sessionState);

    const sessionButtonRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const button = sessionButtonRef.current;
        if (button) {
            const handleClick = () => {
                if (!isUserConnected) {
                    localStorage.setItem(
                        'loginButtonClickTime',
                        Date.now().toString(),
                    );
                }
            };

            button.addEventListener('click', handleClick);
            return () => button.removeEventListener('click', handleClick);
        }
    }, [isUserConnected]);

    // state values to track whether a given menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
    const [isRpcDropdownOpen, setIsRpcDropdownOpen] = useState(false);
    const [isDepositDropdownOpen, setIsDepositDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
    const showRPCButton = false;
    const location = useLocation();

    // symbol for active market
    const { symbol } = useTradeDataStore();

    // Use unified margin data
    const { marginBucket } = useUnifiedMarginData();

    const landingTime = useRef<number>(Date.now());

    // data to generate nav links in page header
    const navLinks = [
        { name: t('navigation.trade'), path: `/v2/trade/${symbol}` },
        // { name: 'Vaults', path: '/v2/vaults' },
        // { name: 'Portfolio', path: '/v2/portfolio' },
        { name: 'Referrals', path: '/v2/referrals' },
        // { name: 'Points', path: '/points' },
        // { name: 'Leaderboard', path: '/v2/leaderboard' },
        // { name: 'Strategies', path: '/strategies' },
        // { name: 'Docs', path: '/docs' },
    ];

    // refs for dropdown menu handline
    const dropdownMenuRef = useOutsideClick<HTMLDivElement>(() => {
        setIsDropdownMenuOpen(false);
    }, isDropdownMenuOpen);
    const mobileNavbarRef = useOutsideClick<HTMLDivElement>(() => {
        setIsMenuOpen(false);
    }, isMenuOpen);
    const walletMenuRef = useOutsideClick<HTMLDivElement>(() => {
        setIsWalletMenuOpen(false);
    }, isWalletMenuOpen);
    const rpcMenuRef = useOutsideClick<HTMLDivElement>(() => {
        setIsRpcDropdownOpen(false);
    }, isRpcDropdownOpen);
    const depositMenuRef = useOutsideClick<HTMLDivElement>(() => {
        setIsDepositDropdownOpen(false);
    }, isDepositDropdownOpen);

    const moreDropdownRef = useOutsideClick<HTMLDivElement>(() => {
        setIsMoreDropdownOpen(false);
    }, isMoreDropdownOpen);

    const helpDropdownRef = useOutsideClick<HTMLDivElement>(() => {
        setIsHelpDropdownOpen(false);
    }, isHelpDropdownOpen);

    // logic to open and close modals
    const appSettingsModal = useModal('closed');
    const referralCodeModal = useModal('closed');

    // temp handler to manually toggle referral code modal
    useKeydown('m', referralCodeModal.toggle, [
        JSON.stringify(referralCodeModal),
    ]);

    // event handler to close dropdown menus on `Escape` keydown
    useKeydown(
        'Escape',
        () => {
            setIsDepositDropdownOpen(false);
            setIsRpcDropdownOpen(false);
            setIsWalletMenuOpen(false);
            setIsHelpDropdownOpen(false);
            setIsMoreDropdownOpen(false);
            setIsDropdownMenuOpen(false);
        },
        [],
    );

    const shortA = useShortScreen();
    const shortB = useMediaQuery('(max-width: 600px)');
    const isShortScreen: boolean = shortA || shortB;

    const { openDepositModal, openWithdrawModal, PortfolioModalsRenderer } =
        usePortfolioModals();

    // Holds previous user connection status
    const prevIsUserConnected = useRef(isUserConnected);

    // boolean to prevent the confirmation modal from opening multiple times
    const hasDismissedRef = useRef<boolean>(false);

    // determine if user is on the home page (all other perps pages are v2)
    const onHomePage: boolean = !location.pathname.includes('v2');

    useEffect(() => {
        if (prevIsUserConnected.current === false && isUserConnected === true) {
            if (typeof plausible === 'function') {
                const loginButtonClickTime = Number(
                    localStorage.getItem('loginButtonClickTime'),
                );
                plausible('Session Established', {
                    props: {
                        loginTime: loginButtonClickTime
                            ? getDurationSegment(
                                  loginButtonClickTime,
                                  Date.now(),
                              )
                            : 'no login button clicked',
                        loginRefreshTime: !loginButtonClickTime
                            ? getDurationSegment(
                                  landingTime.current,
                                  Date.now(),
                              )
                            : 'login button clicked',
                    },
                });
            }
            localStorage.removeItem('loginButtonClickTime');
        } else if (
            prevIsUserConnected.current === true &&
            isUserConnected === false
        ) {
            if (typeof plausible === 'function') {
                plausible('Session Ended');
            }
        }

        // fn to check FUUL for conversion data on a given wallet address
        async function checkForFuulConversion(
            address: string,
        ): Promise<FuulConversionIF | null> {
            // options config for FUUL API call
            const OPTIONS = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization:
                        'Bearer ae8178229c5e89378386e6f6535c12212b12693dab668eb4dc9200600ae698b6',
                },
            };

            // attempt to check for conversion and resolve referrer address and code
            try {
                // const affiliates = await Fuul.getConversions({ user_identifier: address,
                //     identifier_type: UserIdentifierType.SolanaAddress });
                // console.log('affiliates', affiliates);
                // conversion endpoint
                const USER_ID_ENDPOINT = `https://api.fuul.xyz/api/v1/user/referrer?user_identifier=${address}&user_identifier_type=solana_address`;
                // fetch raw data from FUUL API
                const res = await fetch(USER_ID_ENDPOINT, OPTIONS);
                // format response as a JSON object
                const data = await res.json();
                console.log('data', data);

                // if user has converted, ask FUUL for readable ref code associated with address
                if (data.referrer_identifier) {
                    const affiliateCode: string | null =
                        await Fuul.getAffiliateCode(
                            data.referrer_identifier,
                            UserIdentifierType.SolanaAddress,
                        );

                    // format return obj with relevant addresses and the referrer code
                    const output: FuulConversionIF = {
                        user_identifier: data.user_identifier,
                        referrer_identifier: data.referrer_identifier,
                        referrer_code: affiliateCode,
                    };
                    console.log('output', output);

                    return output;
                }

                // return `null` if API response indicates no conversion
                return null;
            } catch (err) {
                console.error(err);
                return null;
            }
        }

        // cache the referral value from the URL if one is present
        referralCodeFromURL.value &&
            referralStore.cache(referralCodeFromURL.value);

        if (userDataStore.userAddress) {
            // const isConverted = true;
            // // check FUUL for conversion
            // if (isConverted) {
            //     // if converted => nothing, get rid of temp val from LS, record ref code to LS under address
            //     // add affiliate code param to URL (if local storage does not have the ref code saved for address already)
            //     const refCode = referralStore.getCode(userDataStore.userAddress);
            // } else {
            //     // if not converted => open modal to let user confirm ref code (if not homepage AND `hasDismissed` === false)
            //     //      user confirms: record ref code to LS under address
            //     //      user declines: set `hasDismissed` to true (refCode was recorded in first render)
            //     referralCodeModal.open();
            // }

            checkForFuulConversion(userDataStore.userAddress).then(
                (response: FuulConversionIF | null): void => {
                    if (response?.referrer_code) {
                        referralCodeFromURL.set(response.referrer_code);
                    } else if (!hasDismissedRef.current) {
                        onHomePage || referralCodeModal.open();
                    }
                },
            );

            // IF REF CODE IS RECORDED UNDER A USER ADDRESS, ASSUME IT WAS CONFIRMED, GATEKEEP AT USER FUNCTIONAL LEVEL
            // later: prevent modal from opening on home page (should open once user hits a different page)

            // `identifyUser` => connects refCode to address
            // incentived event => triggers permanent attribution by FUUL
        } else if (referralCodeFromURL.value) {
            referralStore.activateCode(referralCodeFromURL.value);
        }

        prevIsUserConnected.current = isUserConnected;
    }, [isUserConnected, userDataStore.userAddress, onHomePage]);

    return (
        <>
            <header id={'pageHeader'} className={styles.container}>
                <Link to='/' style={{ marginLeft: '10px' }} viewTransition>
                    <img
                        src='/images/favicon.svg'
                        alt='Perps Logo'
                        width='70px'
                        height='70px'
                        loading='eager'
                    />
                </Link>
                <nav
                    className={`${styles.nav} ${
                        isMenuOpen ? styles.showMenu : ''
                    }`}
                    ref={isMenuOpen ? mobileNavbarRef : null}
                >
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className={styles.mobileNavCloseButton}
                        aria-label={t('aria.closeNav')}
                    >
                        <MdOutlineClose size={20} color='var(--text1)' />
                    </button>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={
                                location.pathname.includes(link.path)
                                    ? styles.activeNavLink
                                    : styles.navLink
                            }
                            onClick={() => {
                                if (isMenuOpen) setIsMenuOpen(false);
                            }}
                            viewTransition
                        >
                            {link.name}
                        </Link>
                    ))}
                    <section
                        style={{
                            position: 'relative',
                        }}
                        ref={moreDropdownRef}
                    >
                        <button
                            className={styles.moreButton}
                            onClick={() =>
                                setIsMoreDropdownOpen(!isMoreDropdownOpen)
                            }
                        >
                            More
                            {isMoreDropdownOpen ? (
                                <LuChevronUp size={15} />
                            ) : (
                                <LuChevronDown size={15} />
                            )}
                        </button>
                        {isMoreDropdownOpen && (
                            <MoreDropdown
                                setIsMoreDropdownOpen={setIsMoreDropdownOpen}
                            />
                        )}
                    </section>
                    <Tooltip content='Ambient v1 Spot DEX' position='bottom'>
                        <a
                            href='/trade'
                            // target='_blank'
                            // rel='noopener noreferrer'
                            className={styles.ambientmm}
                        >
                            Ambient AMM
                        </a>
                    </Tooltip>
                </nav>
                <div className={styles.rightSide}>
                    <span className={styles.depositSlot}>
                        {isUserConnected ? (
                            <section
                                style={{ position: 'relative' }}
                                ref={depositMenuRef}
                            >
                                <button
                                    className={styles.depositButton}
                                    onClick={() => {
                                        if (isShortScreen) {
                                            setIsDepositDropdownOpen(
                                                !isDepositDropdownOpen,
                                            );
                                        } else {
                                            openDepositModal();
                                        }
                                    }}
                                >
                                    {isShortScreen
                                        ? t('common.transfer')
                                        : t('common.deposit')}
                                </button>
                                {isDepositDropdownOpen && (
                                    <DepositDropdown
                                        isDropdown
                                        marginBucket={marginBucket}
                                        openDepositModal={openDepositModal}
                                        openWithdrawModal={openWithdrawModal}
                                    />
                                )}
                            </section>
                        ) : (
                            <div
                                className={styles.depositButtonPlaceholder}
                                aria-hidden
                            />
                        )}
                    </span>

                    {isUserConnected && showRPCButton && (
                        <section
                            style={{ position: 'relative' }}
                            ref={rpcMenuRef}
                        >
                            {isUserConnected && (
                                <button
                                    className={styles.rpcButton}
                                    onClick={() =>
                                        setIsRpcDropdownOpen(!isRpcDropdownOpen)
                                    }
                                >
                                    <span>RPC</span>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='16'
                                        height='16'
                                        viewBox='0 0 16 16'
                                        fill='none'
                                    >
                                        <circle
                                            cx='8'
                                            cy='8'
                                            r='8'
                                            fill='#26A69A'
                                        />
                                    </svg>
                                </button>
                            )}

                            {isRpcDropdownOpen && isUserConnected && (
                                <RpcDropdown />
                            )}
                        </section>
                    )}
                    <span
                        className={`${!isUserConnected ? `plausible-event-name=Login+Button+Click plausible-event-buttonLocation=Page+Header` : ''}`}
                        ref={sessionButtonRef}
                    >
                        <SessionButton />
                    </span>

                    {isUserConnected && (
                        <section
                            style={{ position: 'relative' }}
                            ref={walletMenuRef}
                        >
                            {/* {isUserConnected && (
                                <button
                                    className={styles.walletButton}
                                    onClick={() =>
                                        setIsWalletMenuOpen(!isWalletMenuOpen)
                                    }
                                >
                                    <LuWallet size={18} /> Miyuki.eth
                                </button>
                            )} */}

                            {/* {isWalletMenuOpen && isUserConnected && (
                                <WalletDropdown
                                    isWalletMenuOpen={isWalletMenuOpen}
                                    setIsWalletMenuOpen={setIsWalletMenuOpen}
                                    setIsUserConnected={setIsUserConnected}
                                    isDropdown
                                />
                            )} */}
                        </section>
                    )}
                    <section
                        style={{
                            position: 'relative',
                        }}
                        ref={helpDropdownRef}
                    >
                        {/* <button
                            className={styles.helpButton}
                            onClick={() =>
                                setIsHelpDropdownOpen(!isHelpDropdownOpen)
                            }
                        >
                            <LuCircleHelp
                                size={18}
                                color='var(--text2)'
                            />
                        </button> */}

                        {isHelpDropdownOpen && (
                            <HelpDropdown
                                setIsHelpDropdownOpen={setIsHelpDropdownOpen}
                            />
                        )}
                    </section>

                    <button
                        className={styles.internationalButton}
                        onClick={() => appSettingsModal.open()}
                        aria-label={t('aria.openSettings')}
                    >
                        <LuSettings size={20} />
                    </button>
                    <section
                        style={{ position: 'relative' }}
                        ref={dropdownMenuRef}
                    >
                        <button
                            className={styles.menuButton}
                            onClick={() =>
                                setIsDropdownMenuOpen(!isDropdownMenuOpen)
                            }
                            aria-label={t('aria.openMoreOptionsMenu')}
                        >
                            <MdOutlineMoreHoriz size={20} />
                        </button>
                        {isDropdownMenuOpen && (
                            <DropdownMenu
                                setIsDropdownMenuOpen={setIsDropdownMenuOpen}
                                onFeedbackClick={() => setIsFeedbackOpen(true)}
                            />
                        )}
                    </section>
                </div>
            </header>

            {appSettingsModal.isOpen && (
                <Modal
                    close={() => appSettingsModal.close()}
                    position={'center'}
                    title={t('appSettings.title')}
                >
                    <AppOptions />
                </Modal>
            )}
            {referralCodeModal.isOpen && referralStore.cached && (
                <Modal
                    close={(): void => {
                        referralCodeModal.close();
                        hasDismissedRef.current = true;
                    }}
                    position='center'
                    title='Referral Code'
                >
                    <ReferralCodeModal
                        refCode={referralStore.cached}
                        close={(): void => {
                            referralCodeModal.close();
                            hasDismissedRef.current = true;
                        }}
                        handleConfirm={(rc: string): void => {
                            if (userDataStore.userAddress) {
                                // register ref code for address in data store
                                referralStore.confirmCode(
                                    userDataStore.userAddress,
                                    rc,
                                );
                                // populate ref code in URL to create pageview event
                                referralCodeFromURL.set(rc);
                            }
                            referralCodeModal.close();
                        }}
                    />
                </Modal>
            )}
            {PortfolioModalsRenderer}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={handleFeedbackClose}
            />
        </>
    );
}
