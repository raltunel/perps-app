import React, { useEffect, useState } from 'react';
import { useChartElementStore } from '~/stores/ChartElementStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { getResolutionListForSymbol } from '~/utils/orderbook/OrderBookUtils';

interface ChartElementControlPanelProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chart?: any;
    canvasHeight?: number;
    canvasWidth?: number;
}

export const ChartElementControlPanel: React.FC<
    ChartElementControlPanelProps
> = ({ chart, canvasHeight, canvasWidth }) => {
    const {
        focusedElement,
        previewPrice,
        adjustPreview,
        commit,
        cancel,
        clearFocus,
        hasChanges,
    } = useChartElementStore();

    const symbolInfo = useTradeDataStore((state) => state.symbolInfo);

    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null,
    );

    useEffect(() => {
        if (focusedElement && chart && canvasHeight && canvasWidth) {
            const dpr = window.devicePixelRatio || 1;
            const cssCanvasHeight = canvasHeight / dpr;
            const cssCanvasWidth = canvasWidth / dpr;

            setPosition({
                x: cssCanvasWidth / 2,
                y: cssCanvasHeight,
            });
        } else {
            setPosition(null);
        }
    }, [focusedElement, chart, canvasHeight, canvasWidth]);

    const calculateStep = () => {
        if (!symbolInfo) return 0.01;

        const resolutionList = getResolutionListForSymbol(symbolInfo);
        if (resolutionList.length === 0) return 0.01;

        return resolutionList[0].val;
    };

    if (!focusedElement || previewPrice === null || !position || !chart) {
        return null;
    }
    const chartDiv =
        typeof document !== 'undefined'
            ? document.getElementById('tv_chart')
            : null;
    const iframe = chartDiv?.querySelector('iframe') as HTMLIFrameElement;
    const iframeRect = iframe?.getBoundingClientRect();

    return (
        <div
            style={{
                position: 'fixed',
                display: 'flex',
                top: iframeRect
                    ? `${iframeRect.top + position.y}px`
                    : `${position.y}px`,
                left: iframeRect
                    ? `${iframeRect.left + position.x}px`
                    : `${position.x}px`,
                zIndex: 10000,
                pointerEvents: 'auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '6px',
                    padding: '4px',
                }}
            >
                <button
                    onClick={() => adjustPreview('up', calculateStep())}
                    style={{
                        width: '28px',
                        height: '28px',
                        padding: '0',
                        backgroundColor: 'transparent',
                        color: '#999',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    title='Increase'
                >
                    ▲
                </button>
                <button
                    onClick={() => adjustPreview('down', calculateStep())}
                    style={{
                        width: '28px',
                        height: '28px',
                        padding: '0',
                        backgroundColor: 'transparent',
                        color: '#999',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    title='Decrease'
                >
                    ▼
                </button>
            </div>
            <div
                style={{
                    gap: '6px',
                    padding: '4px',
                    display: 'flex',
                }}
            >
                {hasChanges() && (
                    <button
                        onClick={commit}
                        style={{
                            width: '28px',
                            height: '28px',
                            padding: '0',
                            backgroundColor: 'transparent',
                            color: '#999',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title='Save'
                    >
                        ✓
                    </button>
                )}
                <button
                    onClick={() => {
                        cancel();
                        clearFocus();
                    }}
                    style={{
                        width: '28px',
                        height: '28px',
                        padding: '0',
                        backgroundColor: 'transparent',
                        color: '#999',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    title='Cancel'
                >
                    ✕
                </button>
            </div>
        </div>
    );
};
