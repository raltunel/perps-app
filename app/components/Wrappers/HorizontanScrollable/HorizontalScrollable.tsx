


import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './HorizontalScrollable.module.css';

interface HorizontalScrollableProps {
    children: React.ReactNode;
}

export function HorizontalScrollable(props: HorizontalScrollableProps) {
  const { children } = props;
  
  return (
    <div className={styles.horizontalScrollable}>
        <div className={styles.horizontalScrollableContent}>
            {children}
        </div>
    </div>
  );
}
