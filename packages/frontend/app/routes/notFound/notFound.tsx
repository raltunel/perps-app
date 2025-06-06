import React from 'react';
import { useNavigate } from 'react-router';
import styles from './notFound.module.css';
import SimpleButton from '~/components/SimpleButton/SimpleButton';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.errorCode}>404</div>
                <h1 className={styles.title}>Page Not Found</h1>
                <p className={styles.message}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className={styles.actions}>
                    <SimpleButton
                        bg='accent1'
                        onClick={() => navigate('/', { viewTransition: true })}
                    >
                        Back to Home
                    </SimpleButton>
                    <SimpleButton bg='dark4' onClick={() => navigate(-1)}>
                        Go Back
                    </SimpleButton>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
