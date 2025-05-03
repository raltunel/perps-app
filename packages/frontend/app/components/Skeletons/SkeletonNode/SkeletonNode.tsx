import { useState } from 'react';
import styles from './SkeletonNode.module.css';

interface SkeletonNodeProps {
    width?: number;
    height?: string;
}

const SkeletonNode: React.FC<SkeletonNodeProps> = ({
    width = 100,
    height = '100%',
}) => {

    return (
        <>
        <div className={styles.skeletonNodeWrapper} style={{ width: width + '%', height: height }}>
            <div className={styles.skeletonNode}></div>
            </div>
        </>
    );
};

export default SkeletonNode;
