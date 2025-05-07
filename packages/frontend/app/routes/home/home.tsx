// Optimized Hero Section
import { memo, useState, useEffect, CSSProperties, type JSX } from 'react';
import { Link } from 'react-router';
import styles from './home.module.css';

import btcImage from '../../assets/tokens/btc.svg';
import ethImage from '../../assets/tokens/eth.svg';
import daiImage from '../../assets/tokens/dai.svg';
import usdtImage from '../../assets/tokens/usdt.svg';

// Memoized token component with proper TypeScript interface
interface FloatingTokenProps {
  src: string;
  size?: number;
  top?: string;
  left?: string;
  duration?: number;
  delay?: number;
  direction?: number;
}

const FloatingBgToken = memo(({ src, size = 90, top = '50%', left = '50%', duration = 60, delay = 0, direction = 1 }: FloatingTokenProps) => (
  <div 
    className={styles.floatingToken}
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
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      animationDirection: direction === 1 ? 'normal' : 'reverse'
    } as CSSProperties}
  >
    <img src={src} alt="token-bg" width={size} height={size} />
  </div>
));

FloatingBgToken.displayName = 'FloatingBgToken';

interface TokenData {
  src: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  direction: number;
}

const tokenData: TokenData[] = [
  { src: btcImage, size: 100, top: '5%', left: '-10%', duration: 90, delay: 0, direction: 1 },
  { src: ethImage, size: 90, top: '65%', left: '-15%', duration: 60, delay: 3, direction: -1 },
  { src: usdtImage, size: 130, top: '85%', left: '-10%', duration: 60, delay: 5, direction: 1 },
  { src: daiImage, size: 95, top: '30%', left: '-12%', duration: 60, delay: 7, direction: -1 },
  { src: ethImage, size: 85, top: '20%', left: '-5%', duration: 60, delay: 1.5, direction: 1 }
];

const Home = memo((): JSX.Element => {
  const [hasVisited, setHasVisited] = useState(false);
  
  useEffect(() => {
    try {
      const visited = sessionStorage.getItem('hasVisitedHome') === 'true';
      setHasVisited(visited);
      
      if (!visited) {
        sessionStorage.setItem('hasVisitedHome', 'true');
      }
    } catch (e) {
        console.error('Session storage error:', e);
      }
    
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.ambientGlow} />
      <div className={styles.sweepLight} />

      {tokenData.map((token, index) => (
        <FloatingBgToken
          key={`token-${index}`}
          src={token.src}
          size={token.size}
          top={token.top}
          left={token.left}
          duration={token.duration}
          delay={token.delay}
          direction={token.direction}
        />
      ))}

      <div className={`${styles.left} ${!hasVisited ? styles.fadeInUp : ''}`}>
        <h1>Trade Perps With Confidence</h1>
        <p>Fast execution. Low fees. Up to 50x leverage.</p>
        <div className={styles.buttons}>
          <Link to="/trade" className={styles.primary}>Start Trading</Link>
          <button className={styles.secondary}>Learn More</button>
        </div>
      </div>

      <div className={`${styles.right} ${!hasVisited ? styles.fadeIn : ''}`}>
        <div className={styles.mockupGlow} />
        <div className={styles.mockupContainer}>
          <Link to="/trade">
            <img
              src="/images/mockup.png"
              alt="Perps App"
              className={styles.mockup}
              width="600"
              height="400"
              loading="eager"
            />
          </Link>
        </div>
      </div>
    </section>
  );
});

Home.displayName = 'Home';

export default Home;

