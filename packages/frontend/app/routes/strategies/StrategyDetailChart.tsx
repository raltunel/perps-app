import React, { useState } from 'react';
import LineChart from '~/components/LineChart/LineChart';

const StrategyDetailChart: React.FC = () => {
    const lineData = [
        { time: 1743446400000, value: 101.2 },
        { time: 1743532800000, value: 102.5 },
        { time: 1743619200000, value: 100.8 },
        { time: 1743705600000, value: 99.4 },
        { time: 1743792000000, value: 101.9 },
        { time: 1743878400000, value: 103.3 },
        { time: 1743964800000, value: 104.0 },
        { time: 1744051200000, value: 102.1 },
        { time: 1744137600000, value: 100.7 },
        { time: 1744224000000, value: 99.5 },
        { time: 1744310400000, value: 98.9 },
        { time: 1744396800000, value: 97.6 },
        { time: 1744483200000, value: 99.2 },
        { time: 1744569600000, value: 100.3 },
        { time: 1744656000000, value: 101.0 },
        { time: 1744742400000, value: 102.6 },
        { time: 1744828800000, value: 104.3 },
        { time: 1744915200000, value: 105.1 },
        { time: 1745001600000, value: 103.7 },
        { time: 1745088000000, value: 102.4 },
    ];

    const [chartWidth, setChartWidth] = useState<number>(370);
    const [chartHeight, setChartHeight] = useState<number>(230);

    return (
        <LineChart
            lineData={lineData}
            curve={'step'}
            chartName={'strategy'}
            width={chartWidth}
            height={chartHeight}
        />
    );
};

export default StrategyDetailChart;
