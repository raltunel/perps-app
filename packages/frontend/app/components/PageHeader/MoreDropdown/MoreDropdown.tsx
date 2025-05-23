import { Link } from 'react-router';
import styles from './MoreDropdown.module.css';

interface propsIF {
    setIsMoreDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MoreDropdown(props: propsIF) {
    const { setIsMoreDropdownOpen } = props;
    const submenuData = [
        { name: 'Testnet', path: '/testnet' },
        { name: 'Explorer', path: '/explorer' },
        { name: 'Sub-Accounts', path: '/subaccounts' },
        { name: 'API', path: '/api' },
        { name: 'Multi-Sig', path: '/multi-sig' },
        { name: 'Funding Comparison', path: '/funding-comparison' },
        { name: 'Stats', path: '/stats' },
        { name: 'Docs', path: '/docs' },
        { name: 'Strategies', path: '/strategies' },
    ];

    return (
        <div className={styles.container}>
            {submenuData.map((menu, idx) => (
                <Link
                    to={menu.path}
                    key={idx}
                    className={styles.row}
                    viewTransition
                    onClick={() => setIsMoreDropdownOpen(false)}
                >
                    {menu.name}
                </Link>
            ))}
        </div>
    );
}
