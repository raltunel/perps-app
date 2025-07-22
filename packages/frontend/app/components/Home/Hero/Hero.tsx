import TradeButton from '../TradeButton/TradeButton';
import styles from './Hero.module.css';
import animationVideo from './animation.mp4'; // ✅ Import video file

export default function Hero() {
    return (
        <div className={styles.hero_container}>
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className={styles.background_video}
            >
                <source src={animationVideo} type='video/mp4' />
                Your browser does not support the video tag.
            </video>

            {/* Hero Content */}
            <div className={styles.hero_heading}>
                <h2>
                    Zero-to-<span>One</span>{' '}
                </h2>
                <h2>Decentralized Trading Protocol</h2>
            </div>

            <p>
                Ambient is an entirely new kind of decentralized perp DEX
                combining unique DeFi native products with a user experience
                rivaling CEXes
            </p>
            <TradeButton />
        </div>
    );
}
