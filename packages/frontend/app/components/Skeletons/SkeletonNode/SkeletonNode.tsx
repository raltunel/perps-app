import { useState } from 'react';
import styles from './SkeletonNode.module.css';

interface SkeletonNodeProps {
    width?: string;
    height?: string;
    wrapperStyle?: React.CSSProperties;
    nodeStyle?: React.CSSProperties;
}

const SkeletonNode: React.FC<SkeletonNodeProps> = ({
    width = '100%',
    height = '100%',
    wrapperStyle,
    nodeStyle,
}) => {
    return (
        <>
            <div
                className={styles.skeletonNodeWrapper}
                style={{ width: width, height: height, ...wrapperStyle }}
            >
                <div
                    className={styles.skeletonNode}
                    style={{ ...nodeStyle }}
                ></div>
            </div>
        </>
    );
};

export default SkeletonNode;
