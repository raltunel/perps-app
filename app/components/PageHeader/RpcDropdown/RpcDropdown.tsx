import { Link } from 'react-router';
import styles from './RpcDropdown.module.css';

interface PropsIF {
  isRpcDropdownOpen: boolean;
  setIsRpcDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface RowPropsIF {
  label: string;
}
export default function RpcDropdown() {
  const RpcRow = (props: RowPropsIF) => {
    const { label } = props;
    return (
      <div className={styles.rpcRowContainer}>
        <p>{label}</p>
        {rpcSvg}
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <section>
        <h3>Transaction RPC</h3>
        <RpcRow label='https://scroll-mainnet-public.unifra.io' />
      </section>

      <section>
        <h3>Data RPC</h3>
        <RpcRow label='https://1rpc.io/scroll' />
        <RpcRow label='ambient indexer' />
      </section>

      <Link to='/' className={styles.viewMoreButton}>
        View More Available Rpcs
      </Link>
    </div>
  );
}

const rpcSvg = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
  >
    <g clipPath='url(#clip0_3877_8036)'>
      <circle cx='8' cy='8' r='6' fill='#26A69A' />
    </g>
    <defs>
      <clipPath id='clip0_3877_8036'>
        <path
          d='M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z'
          fill='white'
        />
      </clipPath>
    </defs>
  </svg>
);
