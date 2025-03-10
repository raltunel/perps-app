import React from 'react';
import styles from './VaultRow.module.css';

interface SnapshotGraphProps {
  data: number[];
  trend: 'up' | 'down' | 'neutral';
}

export const SnapshotGraph: React.FC<SnapshotGraphProps> = ({ data, trend }) => {
  const getColor = () => {
    switch (trend) {
      case 'up':
        return '#4CAF50'; // Green
      case 'down':
        return '#F44336'; // Red
      case 'neutral':
        return '#03A9F4'; // Blue
      default:
        return '#03A9F4';
    }
  };

  const width = 100;
  const height = 30;
  const points = data.map((value, index) => 
    `${(index / (data.length - 1)) * width},${height - (value / Math.max(...data)) * height}`
  ).join(' ');

  return (
    <div className={styles.snapshotGraph}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points}
          fill="none"
          stroke={getColor()}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};