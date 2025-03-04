import React from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { FiCopy } from 'react-icons/fi';
import styles from './WalletDropdown.module.css';

interface PropsIF {
  isWalletMenuOpen: boolean;
  setIsWalletMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUserConnected: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdown?: boolean;
}

const tokenImg = 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png';

const TokenDisplay = () => {
  return (
    <div className={styles.tokenDisplayContainer}>
      <div className={styles.tokenDisplayLeft}>
        <div className={styles.tokenDisplayImg}>
          <img src={tokenImg} alt='token image' />
        </div>
        <p className={styles.tokenDisplayName}>USDC</p>
      </div>
      <div className={styles.tokenDisplayRight}>
        <h3>27.35</h3>
        <p>$44,2213</p>
      </div>
    </div>
  );
};

export default function WalletDropdown(props: PropsIF) {
  const {  setIsUserConnected, isDropdown } = props;

  return (
    <div className={`${styles.container}`} style={{width: isDropdown ? '347px' : 'auto'}}>
      <section className={styles.profileContainer}>
        <div className={styles.imgContainer}>
          <img src='' alt='' />
        </div>
        <div className={styles.profileRight}>
          <div className={styles.profileRightTop}>
            Miyuki.eth
            <BiLinkExternal />
            <FiCopy />
          </div>
          <div className={styles.profileRightBottom}>
            <p>MetaMask</p>
            <p>0xAbCd...5587</p>
          </div>
        </div>
      </section>

      <section className={styles.tokensContainer}>
        <TokenDisplay />
        <TokenDisplay />
      </section>

      <section className={styles.actionButtons}>
        <button className={styles.accountButton}>Account</button>
        <button className={styles.logoutButton}
        onClick={() => setIsUserConnected(false)}
        >Logout</button>
      </section>
    </div>
  );
}
