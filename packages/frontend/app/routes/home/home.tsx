// Optimized Hero Section with performance improvements
import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './home.module.css';

// Import images at component level to avoid unnecessary re-imports
import btcImage from '../../assets/tokens/btc.svg';
import ethImage from '../../assets/tokens/eth.svg';
import daiImage from '../../assets/tokens/dai.svg';
import usdtImage from '../../assets/tokens/usdt.svg';

// Memoized token component to prevent unnecessary re-renders
const FloatingBgToken = memo(({ src, size = 90, top = '50%', left = '50%', duration = 60, delay = 0, direction = 1 }) => {
  // Use CSS animations instead of JS-based animations for better performance
  return (
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
      }}
    >
      <img src={src} alt="token-bg" width={size} height={size} />
    </div>
  );
});

FloatingBgToken.displayName = 'FloatingBgToken';

// Token data defined outside component to prevent recreation on each render
const tokenData = [
  { src: btcImage, size: 100, top: '5%', left: '-10%', duration: 90, delay: 0, direction: 1 },
  { src: ethImage, size: 90, top: '65%', left: '-15%', duration: 60, delay: 3, direction: -1 },
  { src: usdtImage, size: 130, top: '85%', left: '-10%', duration: 60, delay: 5, direction: 1 },
  { src: daiImage, size: 95, top: '30%', left: '-12%', duration: 60, delay: 7, direction: -1 },
  { src: ethImage, size: 85, top: '20%', left: '-5%', duration: 60, delay: 1.5, direction: 1 }
];

// Main component, memoized for performance
const Home = memo(() => {
  // Check for visited state only once when component mounts
  const [hasVisited, setHasVisited] = useState(false);
  
  useEffect(() => {
    // Check session storage once on mount
    const visited = sessionStorage.getItem('hasVisitedHome') === 'true';
    setHasVisited(visited);
    
    if (!visited) {
      sessionStorage.setItem('hasVisitedHome', 'true');
    }
  }, []);

  return (
    <section className={styles.hero}>
      {/* Static background elements */}
      <div className={styles.ambientGlow} />
      <div className={styles.sweepLight} />

      {/* Render floating tokens with keys for proper reconciliation */}
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

      {/* Left content */}
      <div 
        className={`${styles.left} ${!hasVisited ? styles.fadeInUp : ''}`}
      >
        <h1 className={styles.title}>Trade Perps With Confidence</h1>
        <p>Fast execution. Low fees. Up to 50x leverage.</p>
        <div className={styles.buttons}>
          <Link to="/trade" className={styles.primary}>Start Trading</Link>
          <button className={styles.secondary}>Learn More</button>
        </div>
      </div>

      {/* Right content */}
      <div 
        className={`${styles.right} ${!hasVisited ? styles.fadeIn : ''}`}
      >
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

