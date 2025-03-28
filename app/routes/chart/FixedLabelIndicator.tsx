import { useEffect, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';

interface FixedLabelIndicatorProps {
    price: number; // Etiketin takip edeceği fiyat seviyesi
    label: string; // Etiket metni
}

const FixedLabelIndicator: React.FC<FixedLabelIndicatorProps> = ({
    price,
    label,
}) => {
    const [yPosition, setYPosition] = useState<number | null>(null);
    const { chart: tvWidget } = useTradingView();

    useEffect(() => {
        if (!tvWidget) return;

        const updateLabelPosition = () => {
            const priceScale = tvWidget.activeChart().getPanes()[0];
            if (!priceScale) return;

            const yPixel = 100; /*  priceScale.priceToCoordinate(price); */
            if (yPixel !== null) {
                setYPosition(yPixel);
            }
        };

        // 📌 İlk yükleme anında pozisyonu güncelle
        updateLabelPosition();

        // 📌 Zoom veya kaydırma olunca güncelle
        tvWidget
            .activeChart()
            .onVisibleRangeChanged()
            .subscribe(null, ({ from, to }) => {
                updateLabelPosition();
            });

        /*     return () => {
            chart.unsubscribeVisibleTimeRangeChange(updateLabelPosition);
            chart.unsubscribeCrossHairMove(updateLabelPosition);
        }; */
    }, [tvWidget, price]);

    return (
        <div
            style={{
                height:'10px',
                position: 'absolute',
                left: '200px', // 📌 X ekseninde sabit kalacak
                top: yPosition ? `${yPosition}px` : '50%', // 📌 Y ekseninde fiyatı takip eder
                padding: '5px 10px',
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '4px',
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            {label}
        </div>
    );
};

export default FixedLabelIndicator;
