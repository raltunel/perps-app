import Button from '~/components/Button/Button';
import styles from './createStrategy.module.css';
import InputText from './InputText';
import { useRef, type RefObject } from 'react';
import { useStrategiesStore } from '~/stores/StrategiesStore';
import { useNavigate } from 'react-router';

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

    function handleInput(field: RefObject<string>, val: string) {
        field.current = val;
    }

    return (
        <div className={styles.create_strategy_page}>
            <h2>New Strategy</h2>
            <section className={styles.create_strategy_inputs}>
                <InputText
                    label='Strategy Name'
                    inputId='CREATE_STRATEGY_STRATEGY_NAME'
                    placeholder='Name'
                    handleChange={(text: string) => handleInput(nameRef, text)}
                />
                <InputText
                    label='Market'
                    inputId='CREATE_STRATEGY_MARKET'
                    placeholder='BTC'
                    handleChange={(text: string) =>
                        handleInput(marketRef, text)
                    }
                />
                <InputText
                    label='Distance'
                    inputId='CREATE_STRATEGY_DISTANCE'
                    placeholder='Distance'
                    handleChange={(text: string) =>
                        handleInput(distanceRef, text)
                    }
                />
                <InputText
                    label='Distance Type'
                    inputId='CREATE_STRATEGY_DISTANCE_TYPE'
                    placeholder='Ticks'
                    handleChange={(text: string) =>
                        handleInput(distanceTypeRef, text)
                    }
                />
                <InputText
                    label='Side'
                    inputId='CREATE_STRATEGY_SIDE'
                    placeholder='Both'
                    handleChange={(text: string) => handleInput(sideRef, text)}
                />
                <InputText
                    label='Total Size'
                    inputId='CREATE_STRATEGY_TOTAL_SIZE'
                    placeholder='Total Size'
                    handleChange={(text: string) =>
                        handleInput(totalSizeRef, text)
                    }
                />
                <InputText
                    label='Order Size'
                    inputId='CREATE_STRATEGY_ORDER_SIZE'
                    placeholder='Order Size'
                    handleChange={(text: string) =>
                        handleInput(orderSizeRef, text)
                    }
                />
            </section>
            <section className={styles.create_strategy_buttons}>
                <Button
                    onClick={() => navigate('/strategies')}
                    size={207}
                    disabled
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
