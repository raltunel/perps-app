import {
    FaDiscord,
    FaFileAlt,
    FaMediumM,
    FaQuestionCircle,
    FaTwitter,
    FaUserSecret,
} from 'react-icons/fa';
import styles from './DropdownMenu.module.css';

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
