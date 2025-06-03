import Button from '~/components/Button/Button';
import styles from './createStrategy.module.css';
import InputText from './InputText';
import { useRef, type MutableRefObject } from 'react';
import { useStrategiesStore } from '~/stores/StrategiesStore';
import { useNavigate } from 'react-router';
import { type useAccountsIF, useAccounts } from '~/stores/AccountsStore';
import {
    type NotificationStoreIF,
    useNotificationStore,
} from '~/stores/NotificationStore';

export interface textInputIF {
    label: string;
    input: string|string[];
    blurb: string;
};

const inputData = {
    name: {
        label: 'Strategy Name',
        input: 'Name',
        blurb: 'Choose a descriptive name for your trading strategy. This will help you identify and manage your strategies effectively.',
    },
    market: {
        label: 'Market',
        input: ['BTC', 'ETH', 'SOL'],
        blurb: 'Select the market where you want to deploy this trading  strategy. Different markets have varying volatility and liquidity characteristics.',
    },
    distance: {
        label: 'Distance',
        input: 'Distance',
        blurb: 'Define the distance parameter for your strategy. This determines how far from the current price your orders will be placed.',
    },
    distanceType: {
        label: 'Distance Type',
        input: ['Ticks', '%'],
        blurb: 'Choose how the distance is measured. Ticks provide precise control, while percentage offers proportional scaling with price movements.'
    },
    side: {
        label: 'Side',
        input: ['Both', 'Above', 'Below'],
        blurb: 'Specify whether the strategy should place buy orders, sell orders, or  both. "Both" enables market making on both sides of the order book.',
    },
    totalSize: {
        label: 'Total Size',
        input: 'Total Size',
        blurb: 'Set the total amount of capital to allocate to this strategy. This represents the maximum exposure across all active orders.',
    },
    orderSize: {
        label: 'Order Size',
        input: 'Order Size',
        blurb: 'Define the size of individual orders. Smaller orders provide better granularity but may increase transaction costs.',
    },
}

export default function createStrategy() {
    const makeStrategy = useStrategiesStore().add;
    const navigate = useNavigate();

    const nameRef = useRef<string>('');
    const marketRef = useRef<string>('');
    const distanceRef = useRef<string>('');
    const distanceTypeRef = useRef<string>('');
    const sideRef = useRef<string>('');
    const totalSizeRef = useRef<string>('');
    const orderSizeRef = useRef<string>('');

    // TODO:    write a function to validate inputs on change and
    // TODO:    ... and enable disable the CTA accordingly

    function handleInput(field: MutableRefObject<string>, val: string): void {
        field.current = val;
    }

    // logic to dispatch a notification for sub-account creation
    const notifications: NotificationStoreIF = useNotificationStore();
    // state data for subaccounts
    const subAccounts: useAccountsIF = useAccounts();

    return (
        <div className={styles.create_strategy_page}>
            <h2>New Strategy</h2>
            <section className={styles.create_strategy_inputs}>
                <InputText
                    data={inputData.name}
                    handleChange={(text: string) => handleInput(nameRef, text)}
                />
                <InputText
                    data={inputData.market}
                    handleChange={(text: string) =>
                        handleInput(marketRef, text)
                    }
                />
                <InputText
                    data={inputData.distance}
                    handleChange={(text: string) =>
                        handleInput(distanceRef, text)
                    }
                />
                <InputText
                    data={inputData.distanceType}
                    handleChange={(text: string) =>
                        handleInput(distanceTypeRef, text)
                    }
                />
                <InputText
                    data={inputData.side}
                    handleChange={(text: string) => handleInput(sideRef, text)}
                />
                <InputText
                    data={inputData.totalSize}
                    handleChange={(text: string) =>
                        handleInput(totalSizeRef, text)
                    }
                />
                <InputText
                    data={inputData.orderSize}
                    handleChange={(text: string) =>
                        handleInput(orderSizeRef, text)
                    }
                />
            </section>
            <section className={styles.create_strategy_buttons}>
                <Button
                    // size='medium'
                    size={100}
                    onClick={() => console.log('RESET FORM')}
                >
                    Reset
                </Button>
                <div className={styles.buttons_right}>
                    <Button
                        // size='medium'
                        size={100}
                        onClick={() => navigate('/strategies')}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            makeStrategy({
                                name: nameRef.current,
                                market: marketRef.current,
                                distance: parseFloat(distanceRef.current),
                                distanceType: distanceTypeRef.current,
                                side: sideRef.current,
                                totalSize: totalSizeRef.current,
                                orderSize: orderSizeRef.current,
                            });
                            console.log({
                                name: nameRef.current,
                                market: marketRef.current,
                                distance: parseFloat(distanceRef.current),
                                distanceType: distanceTypeRef.current,
                                side: sideRef.current,
                                totalSize: totalSizeRef.current,
                                orderSize: orderSizeRef.current,
                            });
                            subAccounts.create(nameRef.current);
                            notifications.add({
                                title: 'Sub Account Created',
                                message: `Made new Sub-Account ${nameRef.current}`,
                                icon: 'check',
                            });
                            navigate('/strategies');
                        }}
                        // size='medium'
                        size={100}
                        selected
                    >
                        Create
                    </Button>
                </div>
            </section>
        </div>
    );
}
