import React, { createContext, useContext, useState, useEffect } from 'react';
import { Fuul } from '@fuul/sdk';
import { FUUL_API_KEY } from '../utils/Constants';

interface FuulContextType {
    isInitialized: boolean;
}

const FuulContext = createContext<FuulContextType>({
    isInitialized: false,
});

export const useFuul = () => {
    const context = useContext(FuulContext);
    if (!context) {
        throw new Error('useFuul must be used within a FuulProvider');
    }
    return context;
};

export const FuulProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        console.log('fuul', { isInitialized });
        if (FUUL_API_KEY && !isInitialized) {
            try {
                Fuul.init({
                    apiKey: FUUL_API_KEY,
                });
                // Assume initialization is successful if no error is thrown
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize Fuul:', error);
            }
        }
    }, [FUUL_API_KEY, isInitialized]);

    return (
        <FuulContext.Provider value={{ isInitialized }}>
            {children}
        </FuulContext.Provider>
    );
};
