import React from 'react';

import Announcement from '../Announcement/Announcement';
import SimpleButton from '../SimpleButton/SimpleButton';
import styles from './VersionUpdateAnnouncement.module.css';

interface VersionUpdateAnnouncementProps {
    onClose?: () => void;
    onReload?: () => void;
    version?: string;
    className?: string;
}

const VersionUpdateAnnouncement: React.FC<VersionUpdateAnnouncementProps> = ({
    onClose,
    onReload = () => window.location.reload(),
    version,
    className = '',
}) => {
    return (
        <Announcement
            type='update'
            position='bottom-right'
            onClose={onClose}
            className={className}
        >
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.icon}>🚀</div>
                    <div className={styles.textContent}>
                        <h3 className={styles.title}>New Version Available</h3>
                        <p className={styles.description}>
                            {version
                                ? `Version ${version} is ready to install with new features and improvements.`
                                : 'A new version is ready with exciting updates and bug fixes.'}
                        </p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <SimpleButton onClick={onReload}>Update Now</SimpleButton>
                </div>
            </div>
        </Announcement>
    );
};

export default VersionUpdateAnnouncement;
