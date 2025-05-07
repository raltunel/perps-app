// Upgraded Hero Section with advanced effects
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './home.module.css';
import { Link } from 'react-router';

import btcImage from '../../assets/tokens/btc.svg';
import ethImage from '../../assets/tokens/eth.svg';
import daiImage from '../../assets/tokens/dai.svg';
import usdtImage from '../../assets/tokens/usdt.svg';

// const hasVisited =
//   typeof window !== 'undefined' && sessionStorage.getItem('hasVisitedHome');
// if (!hasVisited && typeof window !== 'undefined') {
//   sessionStorage.setItem('hasVisitedHome', 'true');
// }
const hasVisited = false
const FloatingBgToken = ({
  src,
  size = 90,
  top = '50%',
  left = '50%',
  duration = 60,
  delay = 0,
  direction = 1,
}: {
  src: string;
  size?: number;
  top?: string;
  left?: string;
  duration?: number;
  delay?: number;
  direction?: number;
}) => (
  <motion.img
    src={src}
    alt="token-bg"
    initial={{ x: '-30vw', y: direction * -100 }}
    animate={{ x: '130vw', y: direction * 100 }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear',
      delay,
    }}
    style={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      opacity: 0.06,
      zIndex: 4,
      filter: 'blur(1px)',
      pointerEvents: 'none',
    }}
  />
);

export default function Home() {
  const title = useMemo(() => `Ambient`, []);

  return (
    <section className={styles.hero}>
      {/* Ambient background glow pulses */}
      <div className={styles.ambientGlow} />
      <div className={styles.sweepLight} />

      {/* Floating token layers */}
      <FloatingBgToken src={btcImage} size={100} top="5%" left="-10%" duration={90} />
      <FloatingBgToken src={ethImage} size={90} top="65%" left="-15%" delay={3} direction={-1} />
      <FloatingBgToken src={usdtImage} size={130} top="85%" left="-10%" delay={5} />
      <FloatingBgToken src={daiImage} size={95} top="30%" left="-12%" delay={7} direction={-1} />
      <FloatingBgToken src={ethImage} size={85} top="20%" left="-5%" delay={1.5} />

      <motion.div
        className={styles.left}
        initial={!hasVisited ? { opacity: 0, y: 30 } : false}
        animate={!hasVisited ? { opacity: 1, y: 0 } : false}
        transition={!hasVisited ? { delay: 0.2, duration: 0.8, ease: 'easeOut' } : {}}
      >
        <motion.h1
          whileHover={{ textShadow: '0 0 16px rgba(115,113,252,0.6)' }}
          transition={{ duration: 0.3 }}
        >
          Trade Perps With Confidence
        </motion.h1>
        <p>Fast execution. Low fees. Up to 50x leverage.</p>
        <div className={styles.buttons}>
          <Link to="/trade" className={styles.primary}>Start Trading</Link>
          <button className={styles.secondary}>Learn More</button>
        </div>
      </motion.div>

      <motion.div
        className={styles.right}
        initial={!hasVisited ? { opacity: 0, scale: 0.95 } : false}
        animate={!hasVisited ? { opacity: 1, scale: 1 } : false}
        transition={!hasVisited ? { delay: 0.6, duration: 0.8, ease: 'easeOut' } : {}}
      >
        <div className={styles.mockupGlow} />
        <motion.div
  className={styles.right}
  initial={{ scale: 1 }}
  animate={{ scale: [1, 1.02, 1] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
>
          <Link to="/trade">
            <img
              src="/images/mockup.png"
              alt="Perps App"
              className={styles.mockup}
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}