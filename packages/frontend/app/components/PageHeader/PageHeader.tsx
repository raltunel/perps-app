import { useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import {
    LuChevronDown,
    LuChevronUp,
    LuSettings,
    LuWallet,
} from 'react-icons/lu';
import { MdOutlineClose, MdOutlineMoreHoriz } from 'react-icons/md';
import { Link, useLocation } from 'react-router';
import { useApp } from '~/contexts/AppContext';
import { type useModalIF, useModal } from '~/hooks/useModal';
import useOutsideClick from '~/hooks/useOutsideClick';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import AppOptions from '../AppOptions/AppOptions';
import Modal from '../Modal/Modal';
import DepositDropdown from './DepositDropdown/DepositDropdown';
import DropdownMenu from './DropdownMenu/DropdownMenu';
import HelpDropdown from './HelpDropdown/HelpDropdown';
import MoreDropdown from './MoreDropdown/MoreDropdown';
import styles from './PageHeader.module.css';
import RpcDropdown from './RpcDropdown/RpcDropdown';
import WalletDropdown from './WalletDropdown/WalletDropdown';
import { useKeydown } from '~/hooks/useKeydown';

export default function PageHeader() {
    const { isUserConnected, setIsUserConnected } = useApp();

    // state values to track whether a given menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
    const [isRpcDropdownOpen, setIsRpcDropdownOpen] = useState(false);
    const [isDepositDropdownOpen, setIsDepositDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
    const location = useLocation();

    // symbol for active market
    const { symbol } = useTradeDataStore();

    // data to generate nav links in page header
    const navLinks = [
        { name: 'Trade', path: `/trade/${symbol}` },
        { name: 'Vaults', path: '/vaults' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Referrals', path: '/referrals' },
        // { name: 'Points', path: '/points' },
        { name: 'Leaderboard', path: '/leaderboard' },
        // { name: 'Strategies', path: '/strategies' },
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

    // logic to open and close the app settings modal
    const appSettingsModal: useModalIF = useModal('closed');

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

    return (
        <>
            <header id={'pageHeader'} className={styles.container}>
                <Link to='/' style={{ marginLeft: '10px' }} viewTransition>
                    <img
                        src='/images/favicon.svg'
                        alt='Perps Logo'
                        width='70px'
                        height='70px'
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
                            more
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
                    <a
                        href='https://ambient.finance/trade'
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.ambientmm}
                    >
                        Ambient AMM
                    </a>
                </nav>
                <div className={styles.rightSide}>
                    {isUserConnected && (
                        <section
                            style={{
                                position: 'relative',
                            }}
                            ref={depositMenuRef}
                        >
                            <button
                                className={styles.depositButton}
                                onClick={() =>
                                    setIsDepositDropdownOpen(
                                        !isDepositDropdownOpen,
                                    )
                                }
                            >
                                Deposit
                            </button>

                            {isDepositDropdownOpen && (
                                <DepositDropdown isDropdown />
                            )}
                        </section>
                    )}

                    {isUserConnected && (
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
                    {!isUserConnected && (
                        <button
                            className={styles.depositButton}
                            onClick={() => setIsUserConnected(true)}
                        >
                            Connect
                        </button>
                    )}
                    {isUserConnected && (
                        <section
                            style={{ position: 'relative' }}
                            ref={walletMenuRef}
                        >
                            {isUserConnected && (
                                <button
                                    className={styles.walletButton}
                                    onClick={() =>
                                        setIsWalletMenuOpen(!isWalletMenuOpen)
                                    }
                                >
                                    <LuWallet size={18} /> Miyuki.eth
                                </button>
                            )}

                            {isWalletMenuOpen && isUserConnected && (
                                <WalletDropdown
                                    isWalletMenuOpen={isWalletMenuOpen}
                                    setIsWalletMenuOpen={setIsWalletMenuOpen}
                                    setIsUserConnected={setIsUserConnected}
                                    isDropdown
                                />
                            )}
                        </section>
                    )}
                    <section
                        style={{
                            position: 'relative',
                        }}
                        ref={helpDropdownRef}
                    >
                        <button
                            className={styles.helpButton}
                            onClick={() =>
                                setIsHelpDropdownOpen(!isHelpDropdownOpen)
                            }
                        >
                            <AiOutlineQuestionCircle
                                size={18}
                                color='var(--text2)'
                            />
                        </button>

                        {isHelpDropdownOpen && (
                            <HelpDropdown
                                setIsHelpDropdownOpen={setIsHelpDropdownOpen}
                            />
                        )}
                    </section>

                    <button
                        className={styles.internationalButton}
                        onClick={appSettingsModal.open}
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
                        >
                            <MdOutlineMoreHoriz size={20} />
                        </button>
                        {isDropdownMenuOpen && <DropdownMenu />}
                    </section>
                </div>
            </header>

            {appSettingsModal.isOpen && (
                <Modal
                    close={appSettingsModal.close}
                    position={'center'}
                    title='Options'
                >
                    <AppOptions />
                </Modal>
            )}
        </>
    );
}
