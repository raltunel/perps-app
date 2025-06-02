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
                    label='Strategy Name'
                    inputId='CREATE_STRATEGY_STRATEGY_NAME'
                    placeholder='Name'
                    blurb='Choose a descriptive name for your trading strategy. This will help you identify and manage your strategies effectively.'
                    handleChange={(text: string) => handleInput(nameRef, text)}
                />
                <InputText
                    label='Market'
                    inputId='CREATE_STRATEGY_MARKET'
                    placeholder='BTC'
                    blurb='Select the market where you want to deploy this trading  strategy. Different markets have varying volatility and liquidity characteristics.'
                    handleChange={(text: string) =>
                        handleInput(marketRef, text)
                    }
                />
                <InputText
                    label='Distance'
                    inputId='CREATE_STRATEGY_DISTANCE'
                    placeholder='Distance'
                    blurb='Define the distance parameter for your strategy. This determines how far from the current price your orders will be placed.'
                    handleChange={(text: string) =>
                        handleInput(distanceRef, text)
                    }
                />
                <InputText
                    label='Distance Type'
                    inputId='CREATE_STRATEGY_DISTANCE_TYPE'
                    placeholder='Ticks'
                    blurb='Choose how the distance is measured. Ticks provide precise control,  while percentage offers proportional scaling with price movements.'
                    handleChange={(text: string) =>
                        handleInput(distanceTypeRef, text)
                    }
                />
                <InputText
                    label='Side'
                    inputId='CREATE_STRATEGY_SIDE'
                    placeholder='Both'
                    blurb='Specify whether the strategy should place buy orders, sell orders, or  both. "Both" enables market making on both sides of the order book.'
                    handleChange={(text: string) => handleInput(sideRef, text)}
                />
                <InputText
                    label='Total Size'
                    inputId='CREATE_STRATEGY_TOTAL_SIZE'
                    placeholder='Total Size'
                    blurb='Set the total amount of capital to allocate to this strategy. This represents the maximum exposure across all active orders.'
                    handleChange={(text: string) =>
                        handleInput(totalSizeRef, text)
                    }
                />
                <InputText
                    label='Order Size'
                    inputId='CREATE_STRATEGY_ORDER_SIZE'
                    placeholder='Order Size'
                    blurb='Define the size of individual orders. Smaller orders provide better granularity but may increase transaction costs.'
                    handleChange={(text: string) =>
                        handleInput(orderSizeRef, text)
                    }
                />
            </section>
            <section className={styles.create_strategy_buttons}>
                <Button onClick={() => navigate('/strategies')} size={207}>
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
                        subAccounts.create(nameRef.current);
                        notifications.add({
                            title: 'Sub Account Created',
                            message: `Made new Sub-Account ${nameRef.current}`,
                            icon: 'check',
                        });
                        navigate('/strategies');
                    }}
                    size='medium'
                    selected
                >
                    Create
                </Button>
            </section>
        </div>
    );
}
