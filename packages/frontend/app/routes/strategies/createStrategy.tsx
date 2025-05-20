import Button from '~/components/Button/Button';
import styles from './createStrategy.module.css';
import InputText from './InputText';

export default function createStrategy() {
    return (
        <div className={styles.create_strategy_page}>
            <h2>New Strategy</h2>
            <section className={styles.create_strategy_inputs}>
                <InputText
                    label='Strategy Name'
                    inputId='CREATE_STRATEGY_STRATEGY_NAME'
                    placeholder='Name'
                />
                <InputText
                    label='Market'
                    inputId='CREATE_STRATEGY_MARKET'
                    placeholder='BTC'
                />
                <InputText
                    label='Distance'
                    inputId='CREATE_STRATEGY_DISTANCE'
                    placeholder='Distance'
                />
                <InputText
                    label='Distance Type'
                    inputId='CREATE_STRATEGY_DISTANCE_TYPE'
                    placeholder='Ticks'
                />
                <InputText
                    label='Strategy Name'
                    inputId='CREATE_STRATEGY_STRATEGY_NAME'
                    placeholder='Both'
                />
                <InputText
                    label='Strategy Name'
                    inputId='CREATE_STRATEGY_STRATEGY_NAME'
                    placeholder='Total Size'
                />
                <InputText
                    label='Strategy Name'
                    inputId='CREATE_STRATEGY_STRATEGY_NAME'
                    placeholder='Order Size'
                />
            </section>
            <section className={styles.create_strategy_buttons}>
                <Button
                    onClick={() => console.log('canceling strategy creation')}
                    size={207}
                    disabled
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => console.log('creating new strategy')}
                    size='medium'
                    selected
                >
                    Create
                </Button>
            </section>
        </div>
    );
}
