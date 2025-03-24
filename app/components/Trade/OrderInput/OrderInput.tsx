import { useState } from 'react';
import styles from './OrderInput.module.css';
import OrderDropdown from './OrderDropdown/OrderDropdown';
import LeverageSlider from './LeverageSlider/LeverageSlider';
import Tooltip from '~/components/Tooltip/Tooltip';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import SizeInput from './SizeInput/SizeInput';
import PriceInput from './PriceInput/PriceInput';
import StopPrice from './StopPrice/StopPrice';
import PositionSize from './PositionSIze/PositionSize';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import ReduceAndProfitToggle from './ReduceAndProfitToggle/ReduceAndProfitToggle';
import ChasePrice from './ChasePrice/ChasePrice';

export interface OrderTypeOption {
    value: string;
    label: string;
}

const marketOrderTypes: OrderTypeOption[] = [
    { value: 'market', label: 'Market' },
    { value: 'limit', label: 'Limit' },
    { value: 'scale', label: 'Scale' },
    { value: 'stop_limit', label: 'Stop Limit' },
    { value: 'stop_market', label: 'Stop Market' },
    { value: 'twap', label: 'TWAP' },
    { value: 'chase_limit', label: 'Chase Limit' },
];
const isolatedOrderTypes: OrderTypeOption[] = [
    { value: 'isolated', label: 'Isolated' },
];
const chaseOptionTypes: OrderTypeOption[] = [
    { value: 'bid1ask1', label: 'Bid1/Ask1' },
    { value: 'distancebidask1', label: 'Distance from Bid1/Ask1' },
];

const leverageOptions = [
    { value: 1, label: '1x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' },
    { value: 50, label: '50x' },
    { value: 100, label: '100x' },
];
const positionSizeOptions = [
    { value: 0, label: '0%' },
    { value: 25, label: '5%' },
    { value: 50, label: '10%' },
    { value: 75, label: '50%' },
    { value: 100, label: '100%' },
];

export default function OrderInput() {
    const [marketOrderType, setMarketOrderType] = useState<string>('market');
    const [isolatedOrderType, setIsolatedOrderType] =
        useState<string>('isolated');
    const [leverage, setLeverage] = useState(100);
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [stopPrice, setStopPrice] = useState('');
    const [positionSize, setPositionSize] = useState(0);
    const [chaseOption, setChaseOption] = useState<string>('bid1ask1');
    const [isReduceOnlyEnabled, setIsReduceOnlyEnabled] = useState(false);
    const [isTakeProfitEnabled, setIsTakeProfitEnabled] = useState(false);

    const inputDetailsData = [
        {
            label: 'Available to Trade',
            tooltipLabel: 'available to trade',
            value: '0.00',
        },
        {
            label: 'Current Position',
            tooltipLabel: 'current position',
            value: '0.000 ETH',
        },
    ];

    const handleMarketOrderTypeChange = (value: string) => {
        setMarketOrderType(value);
        console.log(`Order type changed to: ${value}`);
    };
    const handleIsolatedOrderTypeChange = (value: string) => {
        setIsolatedOrderType(value);
        console.log(`isolated type changed to: ${value}`);
    };
    const handleLeverageChange = (value: number) => {
        setLeverage(value);
        console.log(`Leverage changed to: ${value}x`);
    };

    // SIZE INPUT-----------------------------
    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(event.target.value);
    };

    const handleSizeBlur = () => {
        console.log('Input lost focus');
    };

    const handleSizeKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            console.log('Enter pressed:', size);
        }
    };
    // PRICE INPUT----------------------------------
    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    };

    const handlePriceBlur = () => {
        console.log('Input lost focus');
    };

    const handlePriceKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            console.log('Enter pressed:', price);
        }
    };
    // STOP PRICE----------------------------------------------------------
    const handleStopPriceChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setStopPrice(event.target.value);
    };

    const handleStopPriceBlur = () => {
        console.log('Input lost focus');
    };

    const handleStopPriceKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            console.log('Enter pressed:', price);
        }
    };

    // POSITION SIZE------------------------------
    const handlePositionSizeChange = (value: number) => {
        setPositionSize(value);
        console.log(`PositionSize changed to: ${value}x`);
    };
    // CHASE OPTION---------------------------------------------------
    const handleChaseOptionChange = (value: string) => {
        setChaseOption(value);
        console.log(`Chase Option changed to: ${value}`);
    };


    // REDUCE AND PROFIT STOP LOSS -----------------------------------------------------

    const handleToggleReduceOnly = (newState?: boolean) => {
        const newValue =
            newState !== undefined ? newState : !isReduceOnlyEnabled;
        setIsReduceOnlyEnabled(newValue);
    };
    const handleToggleProfitOnly = (newState?: boolean) => {
        const newValue =
            newState !== undefined ? newState : !isTakeProfitEnabled;
        setIsTakeProfitEnabled(newValue);
    };

  
   


    return (
        <div className={styles.mainContainer}>
            <div className={styles.orderTypeDropdownContainer}>
                <OrderDropdown
                    options={marketOrderTypes}
                    value={marketOrderType}
                    onChange={handleMarketOrderTypeChange}
                />
                <OrderDropdown
                    options={isolatedOrderTypes}
                    value={isolatedOrderType}
                    onChange={handleIsolatedOrderTypeChange}
                />
            </div>
            <LeverageSlider
                options={leverageOptions}
                value={leverage}
                onChange={handleLeverageChange}
            />{' '}
            <div className={styles.inputDetailsDataContainer}>
                {inputDetailsData.map((data, idx) => (
                    <div className={styles.inputDetailsDataContent}>
                        <div className={styles.inputDetailsLabel}>
                            <span>{data.label}</span>
                            <Tooltip
                                content={data?.tooltipLabel}
                                position='right'
                            >
                                <AiOutlineQuestionCircle size={13} />
                            </Tooltip>
                        </div>
                        <span className={styles.inputDetailValue}>
                            {data.value}
                        </span>
                    </div>
                ))}
            </div>
            <ChasePrice
                chaseOption={chaseOption}
                chaseOptionTypes={chaseOptionTypes}
                handleChaseOptionChange={handleChaseOptionChange}
                

                />
            <SizeInput
                value={size}
                onChange={handleSizeChange}
                onBlur={handleSizeBlur}
                onKeyDown={handleSizeKeyDown}
                className='custom-input'
                ariaLabel='Size input'
            />
            <PriceInput
                value={price}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                onKeyDown={handlePriceKeyDown}
                className='custom-input'
                ariaLabel='Price input'
            />
            <StopPrice
                value={stopPrice}
                onChange={handleStopPriceChange}
                onBlur={handleStopPriceBlur}
                onKeyDown={handleStopPriceKeyDown}
                className='custom-input'
                ariaLabel='stop price input'
            />
            <PositionSize
                options={positionSizeOptions}
                value={positionSize}
                onChange={handlePositionSizeChange}
            />
            <ReduceAndProfitToggle
                isReduceOnlyEnabled={isReduceOnlyEnabled}
                isTakeProfitEnabled={isTakeProfitEnabled}
                handleToggleProfitOnly={handleToggleProfitOnly}
                handleToggleReduceOnly={handleToggleReduceOnly}
            
            />
        </div>
    );
}
