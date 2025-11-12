import React, { useEffect, useState } from 'react';
import styles from './TradeCartToolbar.module.css';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ToggleSwitch from '../Trade/ToggleSwitch/ToggleSwitch';
import { motion } from 'framer-motion';
import { IoCloseCircleOutline } from 'react-icons/io5';

export interface DraftOrder {
    coin: string;
    px: number;
    side: 'buy' | 'sell';
    sz: number;
}

export interface TradeCartToolbarProps {
    cartModeOpen: boolean;
    setCartModeOpen: (open: boolean) => void;
}

const TradeCartToolbar: React.FC<TradeCartToolbarProps> = ({
    cartModeOpen,
    setCartModeOpen,
}) => {
    const [isDegenMode, setIsDegenMode] = useState(false);
    const [draftOrders, setDraftOrders] = useState<DraftOrder[]>([]);

    const addDraftOrder = (order: DraftOrder) => {
        setDraftOrders([...draftOrders, order]);
    };
    const removeDraftOrder = (index: number) => {
        setDraftOrders(draftOrders.filter((_, i) => i !== index));
    };

    const handleDegenModeToggle = () => {
        setIsDegenMode(!isDegenMode);
    };

    const [cartOpen, setCartOpen] = useState(false);
    const handleCartOpen = () => {
        setCartOpen(!cartOpen);
    };

    useEffect(() => {
        if (isDegenMode) {
            setCartOpen(false);
        }
    }, [isDegenMode]);

    return (
        <div className={styles.tradeCartToolbar}>
            {cartModeOpen ? (
                <>
                    <motion.div
                        className={styles.tradeSizeWrapper}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.1 }}
                    >
                        <div className={styles.tradeSizeLabel}>Trade Size</div>
                        <input placeholder='0.00 USD' />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.1, delay: 0.07 }}
                    >
                        <ToggleSwitch
                            label='Degen Mode'
                            isOn={isDegenMode}
                            onToggle={handleDegenModeToggle}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.1, delay: 0.14 }}
                        className={
                            `${styles.iconBtn} ${cartOpen ? styles.active : ''}` +
                            ' ' +
                            styles.cartTrigger
                        }
                    >
                        <AiOutlineShoppingCart
                            className={styles.iconElement}
                            size={22}
                            onClick={handleCartOpen}
                        />
                        <div
                            className={styles.draftOrdersCount}
                            onClick={handleCartOpen}
                        >
                            {draftOrders.length}
                        </div>

                        {cartOpen && (
                            <motion.div
                                className={styles.cart}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.1, delay: 0.21 }}
                            >
                                {draftOrders.map((order, index) => (
                                    <div key={index}>{order.coin}</div>
                                ))}
                                {draftOrders.length === 0 && (
                                    <div className={styles.cartEmpty}>
                                        No draft orders
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                    <motion.div
                        className={`${styles.iconBtn}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.1, delay: 0.3 }}
                    >
                        <IoCloseCircleOutline
                            className={styles.iconElement}
                            size={22}
                            onClick={() => setCartModeOpen(false)}
                        />
                    </motion.div>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className={styles.cartModeTriggerBtn}
                    onClick={() => setCartModeOpen(true)}
                >
                    Fast Trade
                </motion.div>
            )}
        </div>
    );
};

export default TradeCartToolbar;
