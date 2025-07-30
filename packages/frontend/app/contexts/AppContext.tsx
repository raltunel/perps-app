import { isEstablished, useSession } from '@fogo/sessions-sdk-react';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react';
import { useCallback } from 'react';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useUserDataStore } from '~/stores/UserDataStore';
import { debugWallets } from '~/utils/Constants';

interface AppContextType {
    isUserConnected: boolean;
    setIsUserConnected: Dispatch<SetStateAction<boolean>>;
    assignDefaultAddress: () => void;
}

export const AppContext = createContext<AppContextType>({
    isUserConnected: false,
    setIsUserConnected: () => {},
    assignDefaultAddress: () => {},
});

export interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [isUserConnected, setIsUserConnected] = useState(false);

    const { isDebugWalletActive, debugWallet } = useDebugStore();

    const { setUserAddress } = useUserDataStore();

    const { resetUserData } = useTradeDataStore();

    const sessionState = useSession();
    const [fogoAddress, setFogoAddress] = useState('');

    useEffect(() => {
        if (isEstablished(sessionState)) {
            setFogoAddress(sessionState.walletPublicKey.toString());
        } else {
            setFogoAddress('');
        }
    }, [isEstablished(sessionState)]);

    const bindEmptyAddress = () => {
        setUserAddress(debugWallets[2].address);
        resetUserData();
    };

    const assignDefaultAddress = useCallback(() => {
        if (isDebugWalletActive) {
            if (fogoAddress === '') {
                bindEmptyAddress();
            } else {
                fogoAddress.match(/^[a-zA-Z]/)
                    ? setUserAddress(debugWallets[0].address)
                    : setUserAddress(debugWallets[1].address);
            }
        } else {
            if (fogoAddress === '') {
                bindEmptyAddress();
            } else {
                setUserAddress(fogoAddress);
            }
        }
    }, [fogoAddress, isDebugWalletActive]);

    useEffect(() => {
        assignDefaultAddress();
    }, [isDebugWalletActive, fogoAddress]);

    useEffect(() => {
        if (debugWallet && isDebugWalletActive) {
            setUserAddress(debugWallet.address);
        }
    }, [debugWallet, isDebugWalletActive]);

    return (
        <AppContext.Provider
            value={{
                isUserConnected,
                setIsUserConnected,
                assignDefaultAddress,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
