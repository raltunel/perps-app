import { useEffect, useRef } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';

interface AnimationFrameIndicatorProps {
    // tvWidget: any; // TradingView widget referansı
    orderLabel: any;
}

const AnimationFrameIndicator: React.FC<AnimationFrameIndicatorProps> = ({
    // tvWidget,
    orderLabel,
}) => {
    const animationRef = useRef<any>(null);
    const { chart: tvWidget } = useTradingView();

    useEffect(() => {
        if (!tvWidget) return;

        // Animation frame işlevini taklit et
        const animate = () => {
            // Burada her frame'de yapılacak işlemleri yazabilirsiniz
            // console.log('sdadasdasdasdas');

            orderLabel?.then((res: any) => {
                /*                 chart
                            .activeChart()
                            .crossHairMoved()
                            .subscribe(null, ({ price }) => {
                                setIsDrag(true);
                            });
        
         */
                /*          chart
                            .activeChart()
                            .onVisibleRangeChanged()
                            .subscribe(null, ({ from, to }) => {
                                // setUpdatedStartTime({ from: from, to: to });
         */
                const time = tvWidget
                    .activeChart()
                    .getTimeScale()
                    .coordinateToTime(300);

                time && console.log('time', time, new Date(time * 1000));

                if (time) {
                    const RECT_WIDTH_PX = 80;

                    const activeLabel = tvWidget
                        .activeChart()
                        .getShapeById(res);
                    /*
                                    const timeScale = chart
                                        .activeChart()
                                        .getTimeScale();
        
                                    const startTime = from;
                                    const endTime = to;
                                    const chartWidth = Math.floor(timeScale.width());
        
                                    const diff = (endTime - startTime) / 2;
                                    const timePerPixel = Math.floor(
                                        (endTime - startTime) / chartWidth,
                                    ); */
                    const buffer = 2000;

                    // console.log('diff', diff, startTime);

                    // const rectWidthTime = timePerPixel * RECT_WIDTH_PX;
                    const newPrice = 100000;
                    const rectTopLeft = {
                        time: time,
                        price: newPrice + buffer,
                    };

                    const rectBottomRight = {
                        time: time,
                        price: newPrice - buffer,
                    };

                    activeLabel.setPoints([rectTopLeft, rectBottomRight]);
                }
                // });

                // const activeLabel = chart.activeChart().getShapeById(res);

                // const activeLabelPoints = activeLabel.getPoints();

                // const newPrice = linePrice.price;
                // const buffer = 2000;
                // const rectTopLeft = {
                //     time: activeLabelPoints[0].time,
                //     price: newPrice + buffer,
                // };
                // const rectBottomRight = {
                //     time: activeLabelPoints[1].time,
                //     price: newPrice - buffer,
                // };
                // activeLabel.setPoints([rectTopLeft, rectBottomRight]);
            });

            // RequestAnimationFrame gibi fonksiyonun tekrar çalışmasını sağla
            animationRef.current = requestAnimationFrame(animate);
        };

        // İlk animasyonu başlat
        animationRef.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [orderLabel]);

    return <div>Animation Frame Indicator</div>;
};

export default AnimationFrameIndicator;
