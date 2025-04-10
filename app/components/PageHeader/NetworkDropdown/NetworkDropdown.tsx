import styles from './NetworkDropdown.module.css';

export default function NetworkDropdown() {
    const networkData = [
        { network: 'Ethereum', logo: ethereumSvg, testnet: false },
        { network: 'Ethereum', logo: ethereumSvg, testnet: false },
        { network: 'Ethereum', logo: ethereumSvg, testnet: false, link: '' },
        { network: 'Ethereum', logo: ethereumSvg, testnet: true, link: '' },
        { network: 'Ethereum', logo: ethereumSvg, testnet: true, link: '' },
    ];

    return (
        <div className={styles.container}>
            {networkData.map((network, idx) => (
                <div key={idx} className={styles.networkContent}>
                    <div className={styles.leftSide}>
                        {network.logo}
                        <p>{network.network}</p>
                    </div>
                    {network?.testnet && (
                        <p className={styles.testnet}>Testnet</p>
                    )}
                    {network?.link && <a href='#'>{linkSvg}</a>}
                </div>
            ))}
        </div>
    );
}

const linkSvg = (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='11'
        height='11'
        viewBox='0 0 11 11'
        fill='none'
    >
        <path
            d='M9.6875 5.9375V8.5625C9.6875 8.79456 9.59531 9.01712 9.43122 9.18122C9.26712 9.34531 9.04456 9.4375 8.8125 9.4375H2.6875C2.45544 9.4375 2.23288 9.34531 2.06878 9.18122C1.90469 9.01712 1.8125 8.79456 1.8125 8.5625V2.4375C1.8125 2.20544 1.90469 1.98288 2.06878 1.81878C2.23288 1.65469 2.45544 1.5625 2.6875 1.5625H5.3125M9.6875 1.5625L5.75 5.5M9.6875 1.5625H7.0625M9.6875 1.5625V4.1875'
            stroke='#6A6A6D'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
);

const ethereumSvg = (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='21'
        height='21'
        viewBox='0 0 21 21'
        fill='none'
    >
        <rect width='21' height='21' rx='10.5' fill='white' />
        <path
            d='M10.2713 1.40002L10.1539 1.79883V13.3702L10.2713 13.4873L15.6425 10.3124L10.2713 1.40002Z'
            fill='#343434'
        />
        <path
            d='M10.2713 1.40002L4.90002 10.3124L10.2713 13.4873L10.2714 7.87091L10.2713 1.40002Z'
            fill='#8C8C8C'
        />
        <path
            d='M10.2714 14.5043L10.2052 14.585V18.7069L10.2714 18.9L15.6458 11.331L10.2714 14.5043Z'
            fill='#3C3C3B'
        />
        <path
            d='M10.2714 18.9V14.5043L4.90002 11.331L10.2714 18.9Z'
            fill='#8C8C8C'
        />
        <path
            d='M10.2713 13.4873L15.6425 10.3124L10.2714 7.87091L10.2713 13.4873Z'
            fill='#141414'
        />
        <path
            d='M4.90002 10.3124L10.2713 13.4873L10.2714 7.87091L4.90002 10.3124Z'
            fill='#393939'
        />
        <path
            d='M10.5 21C16.299 21 21 16.299 21 10.5C21 4.70101 16.299 0 10.5 0C4.70101 0 0 4.70101 0 10.5C0 16.299 4.70101 21 10.5 21Z'
            fill='#627EEA'
        />
        <path
            d='M10.8268 2.625V8.44594L15.7467 10.6444L10.8268 2.625Z'
            fill='white'
            fill-opacity='0.602'
        />
        <path
            d='M10.8268 2.625L5.90625 10.6444L10.8268 8.44594V2.625Z'
            fill='white'
        />
        <path
            d='M10.8268 14.4165V18.3717L15.75 11.5605L10.8268 14.4165Z'
            fill='white'
            fill-opacity='0.602'
        />
        <path
            d='M10.8268 18.3717V14.4158L5.90625 11.5605L10.8268 18.3717Z'
            fill='white'
        />
        <path
            d='M10.8268 13.501L15.7467 10.6444L10.8268 8.44727V13.501Z'
            fill='white'
            fill-opacity='0.2'
        />
        <path
            d='M5.90625 10.6444L10.8268 13.501V8.44727L5.90625 10.6444Z'
            fill='white'
            fill-opacity='0.602'
        />
    </svg>
);
