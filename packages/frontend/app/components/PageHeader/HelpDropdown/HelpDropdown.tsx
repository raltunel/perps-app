import { IoIosClose } from 'react-icons/io';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import { useTutorial } from '~/hooks/useTutorial';
import { usePortfolioModals } from '~/routes/portfolio/usePortfolioModals';
import styles from './HelpDropdown.module.css';

interface propsIF {
    setIsHelpDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HelpDropdown(props: propsIF) {
    const { setIsHelpDropdownOpen } = props;

    const { handleRestartTutorial } = useTutorial();

    const { openWithdrawModal, PortfolioModalsRenderer } = usePortfolioModals();

    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    Need help?
                    <IoIosClose
                        color='var(--text2)'
                        onClick={() => setIsHelpDropdownOpen(false)}
                    />
                </header>
                <div className={styles.content}>
                    <SimpleButton
                        bg='dark4'
                        hoverBg='accent1'
                        onClick={() => {
                            openWithdrawModal();
                            setIsHelpDropdownOpen(false);
                        }}
                    >
                        Withdraw
                    </SimpleButton>
                    <SimpleButton
                        bg='accent1'
                        className={styles.depositButton}
                        onClick={() => {
                            handleRestartTutorial();
                            setIsHelpDropdownOpen(false);
                        }}
                    >
                        Launch Tutorial
                    </SimpleButton>
                </div>
            </div>
            {PortfolioModalsRenderer}
        </>
    );
}
