import { Link, useLocation } from 'react-router';
import type { Route } from '../+types/home';
import styles from './navbar.module.css';
import { useState } from 'react';
import { MdOutlineClose, MdOutlineMoreHoriz } from 'react-icons/md';
import Button from '../Button/Button';
import DropdownMenu from './DropdownMenu/DropdownMenu';
import { LuMenu, LuWallet } from 'react-icons/lu';
import useOutsideClick from '~/hooks/useOutsideClick';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Navbar({ loaderData }: Route.ComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Trade', path: '/trade' },
    { name: 'Vaults', path: '/vaults' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Referrals', path: '/referrals' },
    { name: 'Points', path: '/points' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'More', path: '/more' },
  ];

  const dropdownMenuRef = useOutsideClick<HTMLDivElement>(() => {
    setIsDropdownMenuOpen(false);
  }, isDropdownMenuOpen);
  const mobileNavbarRef = useOutsideClick<HTMLDivElement>(() => {
    setIsMenuOpen(false);
  }, isMenuOpen);

  return (
    <>
      <header className={styles.container}>
        <Link to='/'>
          <img src='/images/perpsLogo.svg' alt='Perps Logo' width='240px' />
        </Link>
        <nav
          className={`${styles.nav} ${isMenuOpen ? styles.showMenu : ''}`}
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
              onClick={isMenuOpen ? () => setIsMenuOpen(false) : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className={styles.rightSide}>
          {!isUserConnected ? (
            <Button
              size='medium'
              selected
              onClick={() => setIsUserConnected(true)}
            >
              Connect
            </Button>
          ) : (
            <button
              className={styles.walletButton}
              onClick={() => setIsUserConnected(false)}
            >
              <LuWallet color='var(--accent1)' size={18} /> Miyuki.eth
            </button>
          )}

          <button
            className={styles.menuButton}
            onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
          >
            <MdOutlineMoreHoriz size={20} color='var(--text2)' />
          </button>
          <button
            className={styles.menuButtonMobile}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <LuMenu size={20} color='var(--text2)' />
          </button>
        </div>
      </header>
      {isDropdownMenuOpen && (
        <div
          className={`${styles.dropdownMenu} ${
            isDropdownMenuOpen ? styles.open : ''
          }`}
          ref={dropdownMenuRef}
        >
          <DropdownMenu />
        </div>
      )}
    </>
  );
}
