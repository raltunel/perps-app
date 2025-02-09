import { Link, NavLink } from 'react-router';
import type { Route } from '../+types/home';
import styles from './welcome.module.css';
import { useState } from 'react';
import { MdOutlineClose, MdOutlineMoreHoriz } from 'react-icons/md';
import type { FC } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

interface WelcomeProps {
  title: string;
}

const Welcome: FC<WelcomeProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h1>Welcome to {title}!</h1>
    </div>
  );
};

export default Welcome;
