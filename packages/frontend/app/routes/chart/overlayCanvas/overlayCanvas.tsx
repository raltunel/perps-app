import React, { useEffect, useRef, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import OrderLines from '../orders/OrderLines';

const OverlayCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { chart } = useTradingView();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [canvasSize, setCanvasSize] = useState<any>();
    useEffect(() => {
        if (!chart) return;

        const chartDiv = document.getElementById('tv_chart');
        const iframe = chartDiv?.querySelector('iframe') as HTMLIFrameElement;
        const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;

        if (!iframeDoc) return;

        const paneCanvas = iframeDoc.querySelector(
            'canvas[data-name="pane-canvas"]',
        ) as HTMLCanvasElement;

        if (!paneCanvas || !paneCanvas.parentNode) return;

        if (!canvasRef.current) {
            const newCanvas = iframeDoc.createElement('canvas');
            newCanvas.id = 'overlay-canvas';
            newCanvas.style.position = 'absolute';
            newCanvas.style.top = '0';
            newCanvas.style.left = '0';
            newCanvas.style.pointerEvents = 'none';
            newCanvas.style.zIndex = '5';
            newCanvas.width = paneCanvas.width;
            newCanvas.height = paneCanvas?.height;
            paneCanvas.parentNode.appendChild(newCanvas);
            canvasRef.current = newCanvas;
        }

        const canvas = canvasRef.current;

        const updateCanvasSize = () => {
            const width = paneCanvas.width;
            const height = paneCanvas?.height;

            canvas.width = width;
            canvas.style.width = `${width}px`;

            canvas.height = height;
            canvas.style.height = `${height}px`;
        };

        updateCanvasSize();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const observer = new ResizeObserver((result: any) => {
            if (result) {
                setCanvasSize({
                    styleWidth: result[0].contentRect.width,
                    styleHeight: result[0].contentRect?.height,
                    width: paneCanvas.width,
                    height: paneCanvas?.height,
                });
            }
        });

        observer.observe(paneCanvas);

        return () => {
            observer.disconnect();
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            canvasRef.current = null;
        };
    }, [chart]);

    return <OrderLines overlayCanvasRef={canvasRef} canvasSize={canvasSize} />;
};

export default OverlayCanvas;
