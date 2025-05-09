import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './CollateralPieChart.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import Button from '~/components/Button/Button';

type PieData = { label: string; value: number };

const CollateralPieChart: React.FC = () => {
    const pieData: PieData[] = [
        { label: 'UPnL', value: 20 },
        { label: 'USDC', value: 36 },
        { label: 'BTC', value: 25 },
        { label: 'SOL', value: 10 },
        { label: 'FOGO', value: 9 },
    ];

    const dataColorSet = [
        '#7371fc',
        '#2775CA',
        '#FF9900',
        '#10D094',
        '#F83E03',
    ];

    const vaultOptions = [
        { label: 'Perps', value: 'perps' },
        { label: 'Vaults', value: 'vaults' },
        { label: 'Perps + Vaults', value: 'all' },
    ];

    const periodOptions = [
        { label: '1D', value: '86400' },
        { label: '7D', value: '604800' },
        { label: '30D', value: '2592000' },
    ];

    const [selectedVault, setSelectedVault] = useState<{
        label: string;
        value: string;
    }>({ label: 'Perps', value: 'perps' });

    const [selectedPeriod, setSelectedPeriod] = useState<{
        label: string;
        value: string;
    }>({ label: '30D', value: '2592000' });

    const color = d3
        .scaleOrdinal<string>()
        .domain(pieData.map((d) => d.label))
        .range(dataColorSet);

    useEffect(() => {
        const canvas = document.getElementById(
            'pie-canvas',
        ) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const radius = Math.min(width, height) / 2;

        const pie = d3.pie<PieData>().value((d) => d.value);
        const arcs = pie(pieData);

        function drawArc(
            ctx: CanvasRenderingContext2D,
            arc: d3.PieArcDatum<PieData>,
            color: string,
        ) {
            const startAngle = arc.startAngle;
            const endAngle = arc.endAngle;

            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.arc(width / 2, height / 2, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

        arcs.forEach((arc) => {
            drawArc(ctx, arc, color(arc.data.label));
        });
    }, [pieData]);

    const filter = (
        <div className={styles.filterContainer}>
            <div className={styles.vaultFilter}>
                <ComboBox
                    value={selectedVault.label}
                    options={vaultOptions}
                    fieldName='label'
                    onChange={(value) =>
                        setSelectedVault({
                            label: value,
                            value:
                                vaultOptions.find((opt) => opt.label === value)
                                    ?.value || '',
                        })
                    }
                />
            </div>

            <div className={styles.vaultFilter}>
                <ComboBox
                    value={selectedPeriod.label}
                    options={periodOptions}
                    fieldName='label'
                    onChange={(value) =>
                        setSelectedPeriod({
                            label: value,
                            value:
                                vaultOptions.find((opt) => opt.label === value)
                                    ?.value || '',
                        })
                    }
                />
            </div>
        </div>
    );

    const legend = (
        <div className={styles.legendContainer}>
            {pieData.map((d, i) => (
                <div key={i} className={styles.legendItem}>
                    <div className={styles.legendLabel}>
                        <div
                            className={styles.legendColor}
                            style={{ backgroundColor: dataColorSet[i] }}
                        ></div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <span style={{ color: color(d.label) }}>
                                {d.label}
                            </span>
                            <span style={{ color: color(d.label) }}>
                                {d.value + '%'}
                            </span>
                        </div>
                    </div>

                    <Button size='medium'>Convert</Button>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.collateralChartContainer}>
            {filter}
            <div className={styles.dataContainer}>
                <div className={styles.dataLabel}>
                    <canvas id='pie-canvas' width='250' height='250'></canvas>
                </div>
                {legend}
            </div>
        </div>
    );
};

export default CollateralPieChart;
