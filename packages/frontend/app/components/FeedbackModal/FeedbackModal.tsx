import { FaThumbsUp, FaThumbsDown, FaTimes } from 'react-icons/fa';
import { useMemo, useState } from 'react';
import styles from './FeedbackModal.module.css';

type FeedbackType = 'positive' | 'negative' | null;

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const truncatedFeedbackText = useMemo(() => {
        let truncatedFeedbackText = feedbackText;
        const maxBytes = 2000;
        const encoder = new TextEncoder();
        const encoded = encoder.encode(truncatedFeedbackText);
        if (encoded.length > maxBytes) {
            const truncated = new Uint8Array(maxBytes);
            truncated.set(encoded.subarray(0, maxBytes - 3));
            truncated.set([0x2e, 0x2e, 0x2e], maxBytes - 3);
            truncatedFeedbackText = new TextDecoder('utf-8', {
                fatal: false,
            }).decode(truncated);
        }
        return truncatedFeedbackText;
    }, [feedbackText]);

    const truncatedMatchesOriginal = useMemo(() => {
        return feedbackText === truncatedFeedbackText;
    }, [feedbackText, truncatedFeedbackText]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackType && !feedbackText.trim()) return;
        setIsSubmitting(true);

        try {
            if (typeof plausible === 'function') {
                plausible('Feedback', {
                    props: {
                        rating: feedbackType,
                        feedback: truncatedFeedbackText,
                    },
                });
            }
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFeedbackType(null);
        setFeedbackText('');
        setIsSubmitted(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
            onClick={handleClose}
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeIcon}
                    onClick={handleClose}
                    aria-label='Close feedback form'
                >
                    <FaTimes />
                </button>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>
                                Share Your Feedback
                            </h2>
                        </div>

                        <div>
                            <label className={styles.label}>
                                How would you rate your experience?
                            </label>
                            <div className={styles.feedbackButtons}>
                                <button
                                    type='button'
                                    className={`${styles.feedbackButton} ${feedbackType === 'positive' ? styles.selected : ''}`}
                                    onClick={() => setFeedbackType('positive')}
                                >
                                    <FaThumbsUp className={styles.icon} />
                                </button>
                                <button
                                    type='button'
                                    className={`${styles.feedbackButton} ${feedbackType === 'negative' ? styles.selected : ''}`}
                                    onClick={() => setFeedbackType('negative')}
                                >
                                    <FaThumbsDown className={styles.icon} />
                                </button>
                            </div>

                            <div className={styles.textAreaContainer}>
                                <label
                                    htmlFor='feedback-text'
                                    className={styles.label}
                                >
                                    {feedbackType === 'positive'
                                        ? 'What do you like most?'
                                        : 'What can we improve?'}
                                </label>
                                <textarea
                                    id='feedback-text'
                                    className={styles.textArea}
                                    value={feedbackText}
                                    onChange={(e) =>
                                        setFeedbackText(e.target.value)
                                    }
                                    placeholder='Your feedback helps us improve...'
                                    rows={5}
                                />
                                {!truncatedMatchesOriginal && (
                                    <div className={styles.warningText}>
                                        Your feedback exceeds the maximum length
                                        and will be truncated.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                type='button'
                                className={styles.cancelButton}
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                className={styles.submitButton}
                                disabled={
                                    (!feedbackType && !feedbackText.trim()) ||
                                    isSubmitting
                                }
                            >
                                {isSubmitting ? 'Sending...' : 'Send Feedback'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <h2 className={styles.successTitle}>Thank You!</h2>
                        <p className={styles.successText}>
                            We appreciate your feedback.
                        </p>
                        <button
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
