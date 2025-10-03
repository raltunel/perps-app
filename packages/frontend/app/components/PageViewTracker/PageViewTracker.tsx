import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Fuul } from '@fuul/sdk';
import { useFuul } from '../../contexts/FuulContext';

export const PageViewTracker = () => {
    const location = useLocation();
    const { isInitialized } = useFuul();

    useEffect(() => {
        if (isInitialized) {
            console.log({ location, Fuul });
            Fuul.sendPageview();
        }
    }, [location, isInitialized]);

    return null;
};

export default PageViewTracker;
