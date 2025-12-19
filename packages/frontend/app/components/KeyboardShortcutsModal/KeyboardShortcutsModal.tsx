import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FaKeyboard } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './KeyboardShortcutsModal.module.css';

import {
    formatKeyboardShortcutKey,
    getKeyboardShortcutCategories,
} from '~/utils/keyboardShortcuts';

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const KeyboardShortcutsModal = ({
    isOpen,
    onClose,
}: KeyboardShortcutsModalProps) => {
    const { t } = useTranslation();
    const shortcutCategories = getKeyboardShortcutCategories(t);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
                aria-labelledby='keyboard-shortcuts-title'
            >
                <header className={styles.header}>
                    <div className={styles.titleRow}>
                        <FaKeyboard className={styles.titleIcon} />
                        <h2 id='keyboard-shortcuts-title'>
                            {t('keyboardShortcuts.title')}
                        </h2>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label={t('keyboardShortcuts.aria.close')}
                    >
                        <MdClose size={20} />
                    </button>
                </header>

                <div className={styles.content}>
                    {shortcutCategories.map((category) => (
                        <section
                            key={category.title}
                            className={styles.category}
                        >
                            <h3 className={styles.categoryTitle}>
                                {category.title}
                            </h3>
                            <ul className={styles.shortcutList}>
                                {category.shortcuts.map((shortcut, index) => (
                                    <li
                                        key={index}
                                        className={styles.shortcutItem}
                                    >
                                        <span className={styles.description}>
                                            {shortcut.description}
                                        </span>
                                        <span className={styles.keys}>
                                            {shortcut.keys.map(
                                                (key, keyIndex) => (
                                                    <span key={keyIndex}>
                                                        <kbd
                                                            className={
                                                                styles.key
                                                            }
                                                        >
                                                            {formatKeyboardShortcutKey(
                                                                key,
                                                                t,
                                                            )}
                                                        </kbd>
                                                        {keyIndex <
                                                            shortcut.keys
                                                                .length -
                                                                1 && (
                                                            <span
                                                                className={
                                                                    styles.keySeparator
                                                                }
                                                            >
                                                                +
                                                            </span>
                                                        )}
                                                    </span>
                                                ),
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                <footer className={styles.footer}>
                    <span className={styles.hint}>
                        {t('keyboardShortcuts.hintPress')}{' '}
                        <kbd className={styles.key}>
                            {formatKeyboardShortcutKey('esc', t)}
                        </kbd>{' '}
                        {t('keyboardShortcuts.hintToClose')}
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
