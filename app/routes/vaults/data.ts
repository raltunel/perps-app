// TypeScript interfaces for vault data
export interface SnapshotData {
    data: number[];
    trend: 'up' | 'down' | 'neutral';
  }
  
  export interface VaultDataIF {
    name: string;
    leader: string;
    apr: number;
    tvl: number;
    yourDeposit: number;
    age: number;
    snapshot: SnapshotData;
  }
  
  // Helper function to generate random wallet addresses
  const generateWalletAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    
    // Generate 40 random hex characters (20 bytes)
    for (let i = 0; i < 40; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Format for display as 0x0000...0000
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };
  
  // Helper function to generate random trending data
  const generateTrendData = (points = 10, trend: 'up' | 'down' | 'volatile' | 'stable' = 'volatile') => {
    const data: number[] = [];
    let value = Math.random() * 50 + 20; // Start between 20-70
    
    for (let i = 0; i < points; i++) {
      switch (trend) {
        case 'up':
          value += Math.random() * 10; // Consistently trending up
          break;
        case 'down':
          value -= Math.random() * 8; // Consistently trending down
          break;
        case 'volatile':
          value += Math.random() * 20 - 10; // High volatility
          break;
        case 'stable':
          value += Math.random() * 6 - 3; // Low volatility
          break;
      }
      
      // Ensure values stay positive
      value = Math.max(5, value);
      data.push(Math.round(value * 100) / 100);
    }
    
    return data;
  };
  
  // Helper function to determine trend direction from data
  const determineTrend = (data: number[]): 'up' | 'down' | 'neutral' => {
    if (data.length < 2) return 'neutral';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.05) return 'up';
    if (secondAvg < firstAvg * 0.95) return 'down';
    return 'neutral';
  };
  
  // Generate 20 mock vault entries with various characteristics
  export const mockVaultData: VaultDataIF[] = [
    // Protocol Vaults (10 entries)
    {
      name: "ETH-USDC LP Vault",
      leader: generateWalletAddress(),
      apr: 12.54,
      tvl: 238457982134.76,
      yourDeposit: 0.00,
      age: 124,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "BTC Staking Vault",
      leader: generateWalletAddress(),
      apr: 8.76,
      tvl: 589102340981.25,
      yourDeposit: 0.00,
      age: 256,
      snapshot: {
        data: generateTrendData(10, 'stable'),
        trend: 'neutral'
      }
    },
    {
      name: "Arbitrum Yield Aggregator",
      leader: generateWalletAddress(),
      apr: 15.89,
      tvl: 124587902345.12,
      yourDeposit: 0.00,
      age: 78,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "Optimism Liquidity Pool",
      leader: generateWalletAddress(),
      apr: 9.34,
      tvl: 87645309871.45,
      yourDeposit: 0.00,
      age: 189,
      snapshot: {
        data: generateTrendData(10, 'volatile'),
        trend: 'down'
      }
    },
    {
      name: "AVAX Flash Loan Strategy",
      leader: generateWalletAddress(),
      apr: 21.76,
      tvl: 42567890123.67,
      yourDeposit: 0.00,
      age: 42,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "Solana Yield Farming",
      leader: generateWalletAddress(),
      apr: 14.23,
      tvl: 98765432198.76,
      yourDeposit: 0.00,
      age: 134,
      snapshot: {
        data: generateTrendData(10, 'down'),
        trend: 'down'
      }
    },
    {
      name: "Polygon Auto-Compounding",
      leader: generateWalletAddress(),
      apr: 18.97,
      tvl: 56789023456.89,
      yourDeposit: 0.00,
      age: 67,
      snapshot: {
        data: generateTrendData(10, 'volatile'),
        trend: 'up'
      }
    },
    {
      name: "Base L2 Stablecoin Vault",
      leader: generateWalletAddress(),
      apr: 6.85,
      tvl: 345678901234.56,
      yourDeposit: 0.00,
      age: 234,
      snapshot: {
        data: generateTrendData(10, 'stable'),
        trend: 'neutral'
      }
    },
    {
      name: "Binance Smart Chain Yield",
      leader: generateWalletAddress(),
      apr: 11.32,
      tvl: 123456789012.34,
      yourDeposit: 0.00,
      age: 156,
      snapshot: {
        data: generateTrendData(10, 'down'),
        trend: 'down'
      }
    },
    {
      name: "NEAR Protocol Strategy",
      leader: generateWalletAddress(),
      apr: 16.43,
      tvl: 67890123456.78,
      yourDeposit: 0.00,
      age: 92,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    
    // User Vaults (10 entries with deposit values)
    {
      name: "My ETH Savings",
      leader: generateWalletAddress(),
      apr: 10.21,
      tvl: 34567890123.45,
      yourDeposit: 12500.00,
      age: 45,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "BTC-ETH Portfolio",
      leader: generateWalletAddress(),
      apr: 9.87,
      tvl: 78901234567.89,
      yourDeposit: 7890.50,
      age: 112,
      snapshot: {
        data: generateTrendData(10, 'volatile'),
        trend: 'down'
      }
    },
    {
      name: "Stablecoin Income",
      leader: generateWalletAddress(),
      apr: 7.65,
      tvl: 12345678901.23,
      yourDeposit: 25000.00,
      age: 78,
      snapshot: {
        data: generateTrendData(10, 'stable'),
        trend: 'neutral'
      }
    },
    {
      name: "DeFi Aggregator #42",
      leader: generateWalletAddress(),
      apr: 14.32,
      tvl: 56789012345.67,
      yourDeposit: 3450.75,
      age: 34,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "Layer 2 Growth Fund",
      leader: generateWalletAddress(),
      apr: 18.76,
      tvl: 89012345678.90,
      yourDeposit: 9870.25,
      age: 67,
      snapshot: {
        data: generateTrendData(10, 'down'),
        trend: 'down'
      }
    },
    {
      name: "Yield Booster Alpha",
      leader: generateWalletAddress(),
      apr: 24.53,
      tvl: 23456789012.34,
      yourDeposit: 1750.80,
      age: 23,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "Passive Income Strategy",
      leader: generateWalletAddress(),
      apr: 8.92,
      tvl: 67890123456.78,
      yourDeposit: 42500.00,
      age: 189,
      snapshot: {
        data: generateTrendData(10, 'stable'),
        trend: 'neutral'
      }
    },
    {
      name: "High Risk / High Reward",
      leader: generateWalletAddress(),
      apr: 32.65,
      tvl: 9012345678.90,
      yourDeposit: 2100.00,
      age: 19,
      snapshot: {
        data: generateTrendData(10, 'volatile'),
        trend: 'down'
      }
    },
    {
      name: "Long-Term Hodl",
      leader: generateWalletAddress(),
      apr: 6.54,
      tvl: 123456789012.34,
      yourDeposit: 67000.00,
      age: 324,
      snapshot: {
        data: generateTrendData(10, 'up'),
        trend: 'up'
      }
    },
    {
      name: "Multi-Chain Yield",
      leader: generateWalletAddress(),
      apr: 16.87,
      tvl: 34567890123.45,
      yourDeposit: 8900.50,
      age: 87,
      snapshot: {
        data: generateTrendData(10, 'down'),
        trend: 'down'
      }
    }
  ];
  
  // To use this data: 
  // import { mockVaultData } from './mockVaultData';
  
  // You can also split it into protocol and user vaults:
  export const protocolVaults = mockVaultData.slice(0, 3);
  export const userVaults = mockVaultData.slice(10);