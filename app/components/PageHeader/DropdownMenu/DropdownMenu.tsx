import { useState } from 'react';
import styles from './DropdownMenu.module.css';
import {
    FaQuestionCircle,
    FaFileAlt,
    FaTwitter,
    FaDiscord,
    FaMediumM,
    FaUserSecret,
} from 'react-icons/fa';

const menuItems = [
    { name: 'Tutorial', icon: <FaQuestionCircle /> },
    { name: 'Docs', icon: <FaFileAlt /> },
    { name: 'Twitter', icon: <FaTwitter /> },
    { name: 'Discord', icon: <FaDiscord /> },
    { name: 'Medium', icon: <FaMediumM /> },
    { name: 'Privacy', icon: <FaUserSecret /> },
    { name: 'Terms of Service', icon: <FaFileAlt /> },
    { name: 'FAQ', icon: <FaQuestionCircle /> },
];

const DropdownMenu = () => {
    return (
        <div className={styles.container}>
            {menuItems.map((item, index) => (
                <div key={index} className={styles.menuItem}>
                    <span>{item.name}</span>
                    <span>{item.icon}</span>
                </div>
            ))}
            <div className={styles.version}>Version: 1.4</div>
            <button className={styles.logoutButton}>Log Out</button>
        </div>
    );
};

export default DropdownMenu;
