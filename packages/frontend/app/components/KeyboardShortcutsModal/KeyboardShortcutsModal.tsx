import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FaKeyboard } from 'react-icons/fa';
import styles from './KeyboardShortcutsModal.module.css';

interface KeyboardShortcut {
    keys: string[];
    description: string;
}

interface ShortcutCategory {
    title: string;
    shortcuts: KeyboardShortcut[];
}

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcutCategories: ShortcutCategory[] = [
    {
        title: 'General',
        shortcuts: [
            { keys: ['Shift', '/'], description: 'Open keyboard shortcuts' },
            { keys: ['Esc'], description: 'Close modal / Cancel' },
            { keys: ['C'], description: 'Open/close wallet connector' },
            { keys: ['D'], description: 'Open deposit' },
            { keys: ['W'], description: 'Open withdraw' },
        ],
    },
    {
        title: 'Trading',
        shortcuts: [
            { keys: ['B'], description: 'Focus buy order' },
            { keys: ['S'], description: 'Focus sell order' },
            { keys: ['L'], description: 'Switch to limit order' },
            { keys: ['M'], description: 'Switch to market order' },
        ],
    },
    {
        title: 'Navigation',
        shortcuts: [
            { keys: ['T'], description: 'Go to Trade page' },
            // { keys: ['P'], description: 'Go to Portfolio page' },
            { keys: ['H'], description: 'Go to Home page' },
        ],
    },
];

const KeyboardShortcutsModal = ({
    isOpen,
    onClose,
}: KeyboardShortcutsModalProps) => {
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
                            Keyboard Shortcuts
                        </h2>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label='Close keyboard shortcuts'
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
                                                            {key}
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
                        Press <kbd className={styles.key}>Esc</kbd> to close
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
