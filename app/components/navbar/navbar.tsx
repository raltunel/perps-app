import { Link, NavLink } from 'react-router';
import type { Route } from '../+types/home';
import styles from './navbar.module.css';
import { useState } from 'react';
import { MdOutlineClose, MdOutlineMoreHoriz } from 'react-icons/md';
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

  const navLinks = [
    { name: 'Trade', path: '/trade' },
    { name: 'Vaults', path: '/vaults' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Referrals', path: '/referrals' },
    { name: 'Points', path: '/points' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'More', path: '/more' },
  ];
  return (
    <header className={styles.container}>
      <Link to='/'>
        <img src='/images/perpsLogo.svg' alt='Perps Logo' />
      </Link>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.showMenu : ''}`}>
        <button onClick={ () => setIsMenuOpen(false)} className={styles.mobileNavCloseButton}>
          <MdOutlineClose size={20} color='var(--text1)' />
        </button>
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            }
            onClick={isMenuOpen ? () => setIsMenuOpen(false) : undefined} 

          >
            {link.name}
          </NavLink>
        ))}
      </nav>
      <button
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MdOutlineMoreHoriz size={20} color='var(--text2)' />
      </button>
    </header>
  );
}
