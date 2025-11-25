import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useParams } from 'react-router';
import { useSdk } from '~/hooks/useSdk';
import { getMarkFillData } from '~/routes/chart/data/candleDataCache';
import {
    createDataFeed,
    type CustomDataFeedType,
} from '~/routes/chart/data/customDataFeed';
import {
    drawingEvent,
    drawingEventUnsubscribe,
    intervalChangedSubscribe,
    intervalChangedUnsubscribe,
    studyEvents,
    studyEventsUnsubscribe,
    visibleRangeChangedSubscribe,
    visibleRangeChangedUnsubscribe,
} from '~/routes/chart/data/utils/chartEvents';
import {
    getChartLayout,
    saveChartLayout,
} from '~/routes/chart/data/utils/chartStorage';
import {
    checkDefaultColors,
    customThemes,
    defaultDrawingToolColors,
    getChartDefaultColors,
    getChartThemeColors,
    mapI18nToTvLocale,
    priceFormatterFactory,
    type ChartLayout,
} from '~/routes/chart/data/utils/utils';
import { useAppOptions } from '~/stores/AppOptionsStore';
import { useAppSettings, type colorSetIF } from '~/stores/AppSettingsStore';
import { useAppStateStore } from '~/stores/AppStateStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useUserDataStore } from '~/stores/UserDataStore';
import type {
    IBasicDataFeed,
    IChartingLibraryWidget,
    LanguageCode,
    ResolutionString,
    TradingTerminalFeatureset,
} from '~/tv/charting_library';
import { processSymbolUrlParam } from '~/utils/AppUtils';
import {
    useOrderPlacementStore,
    type TradeType,
} from '~/routes/chart/hooks/useOrderPlacement';

import i18n from 'i18next';

interface TradingViewContextType {
    chart: IChartingLibraryWidget | null;
    isChartReady: boolean;
}

export const TradingViewContext = createContext<TradingViewContextType>({
    chart: null,
    isChartReady: false,
});

export interface ChartContainerProps {
    symbolName: string;
    libraryPath: string;
    chartsStorageUrl: string;
    chartsStorageApiVersion: string;
    clientId: string;
    userId: string;
    fullscreen: boolean;
    autosize: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    studiesOverrides: any;
    container: string;
}

export const TradingViewProvider: React.FC<{
    children: React.ReactNode;
    tradingviewLib?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        widget?: new (opts: any) => IChartingLibraryWidget;
    } | null;
    setChartLoadingStatus: React.Dispatch<
        React.SetStateAction<'loading' | 'error' | 'ready'>
    >;
}> = ({ children, tradingviewLib, setChartLoadingStatus }) => {
    const [chart, setChart] = useState<IChartingLibraryWidget | null>(null);
    const {
        openModal,
        toggleQuickMode,
        setQuickModeTradeType,
        openQuickModeConfirm,
    } = useOrderPlacementStore();

    const { info, lastSleepMs, lastAwakeMs } = useSdk();

    const { symbol, addToFetchedChannels } = useTradeDataStore();

    const [chartState, setChartState] = useState<ChartLayout | null>();

    const { userAddress } = useUserDataStore();

    const { showBuysSellsOnChart } = useAppOptions();

    const [chartInterval, setChartInterval] = useState<string | undefined>(
        chartState?.interval,
    );

    const dataFeedRef = useRef<CustomDataFeedType | null>(null);

    const { debugToolbarOpen, setDebugToolbarOpen } = useAppStateStore();
    const debugToolbarOpenRef = useRef(debugToolbarOpen);
    debugToolbarOpenRef.current = debugToolbarOpen;

    const { marketId } = useParams<{ marketId: string }>();

    const [isChartReady, setIsChartReady] = useState(false);
    useEffect(() => {
        const res = getChartLayout();
        if (res?.interval) {
            setChartInterval(res.interval);
        }
        setChartState(res);
    }, [i18n.language]);

    const defaultProps: Omit<ChartContainerProps, 'container'> = {
        symbolName: 'BTC',
        libraryPath: '/tv/charting_library/',
        chartsStorageUrl: 'https://saveload.tradingview.com',
        chartsStorageApiVersion: '1.1',
        clientId: 'tradingview.com',
        userId: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studiesOverrides: {},
    };

    // logic to change the active color pair
    const { bsColor, getBsColor } = useAppSettings();

    function changeColors(c: colorSetIF): void {
        // make sure the chart exists
        if (chart) {
            chart.applyOverrides({
                'mainSeriesProperties.candleStyle.upColor': c.buy,
                'mainSeriesProperties.candleStyle.downColor': c.sell,
                'mainSeriesProperties.candleStyle.borderUpColor': c.buy,
                'mainSeriesProperties.candleStyle.borderDownColor': c.sell,
                'mainSeriesProperties.candleStyle.wickUpColor': c.buy,
                'mainSeriesProperties.candleStyle.wickDownColor': c.sell,
            });

            if (chart) {
                const volumeStudies = chart
                    .activeChart()
                    .getAllStudies()
                    .filter((x) => x.name === 'Volume');

                if (volumeStudies) {
                    volumeStudies.forEach((item) => {
                        const volume = chart
                            .activeChart()
                            .getStudyById(item.id);
                        volume.applyOverrides({
                            'volume.color.0': c.sell,
                            'volume.color.1': c.buy,
                        });
                    });
                }
            }
        }
    }

    useEffect(() => {
        if (chart) {
            showBuysSellsOnChart && chart.chart().refreshMarks();
        }
    }, [bsColor, chart, showBuysSellsOnChart]);

    useEffect(() => {
        if (!isChartReady && chart) {
            const intervalId = setInterval(() => {
                const isReady = chart.chart().dataReady();
                setIsChartReady(isReady);
            }, 200);
            return () => clearInterval(intervalId);
        }
    }, [chart, isChartReady]);

    useEffect(() => {
        if (chart) {
            chart.subscribe('series_properties_changed', () => {
                const activeColors = getChartDefaultColors();
                const chartThemeColors = getChartThemeColors();

                const isInitial =
                    chartThemeColors &&
                    activeColors &&
                    activeColors[0] === chartThemeColors.buy &&
                    activeColors[1] === chartThemeColors.sell;

                const isCustomized = checkDefaultColors();

                if (chartThemeColors && !isInitial && !isCustomized) {
                    changeColors(getBsColor());
                }

                saveChartLayout(chart);
                showBuysSellsOnChart && chart.chart().refreshMarks();
            });

            chart.subscribe('study_event', (studyId) => {
                const studyElement = chart.activeChart().getStudyById(studyId);

                const colors = getBsColor();
                studyElement.applyOverrides({
                    'volume.color.0': colors.sell,
                    'volume.color.1': colors.buy,
                });
            });
        }
    }, [chart]);

    // side effect to load a custom color set into the table, runs when
    // ... the user changes the app's color theme and when the chart
    // ... finishes initialization
    useEffect(() => {
        const isCustomized = checkDefaultColors();
        if (!isCustomized) changeColors(getBsColor());
    }, [bsColor, chart]);

    const initChart = useCallback(async () => {
        if (typeof window === 'undefined') return;

        if (!info || !tradingviewLib?.widget) return;

        dataFeedRef.current = createDataFeed(info, addToFetchedChannels);

        const processedSymbol = processSymbolUrlParam(marketId || 'BTC');

        const tvWidget = new tradingviewLib.widget({
            container: 'tv_chart',
            library_path: defaultProps.libraryPath,
            timezone: 'Etc/UTC',
            symbol: processedSymbol,
            fullscreen: false,
            autosize: true,
            datafeed: dataFeedRef.current as IBasicDataFeed,
            interval: (chartState?.interval || '1D') as ResolutionString,
            disabled_features: [
                'volume_force_overlay',
                'header_symbol_search',
                'header_compare',
                ...(chartState
                    ? [
                          'create_volume_indicator_by_default' as TradingTerminalFeatureset,
                      ]
                    : []),
            ],
            favorites: {
                intervals: ['5', '1h', 'D'] as ResolutionString[],
            },
            locale: mapI18nToTvLocale(i18n.language) as LanguageCode,
            theme: 'dark',
            custom_themes: customThemes(),
            overrides: {
                volumePaneSize: 'medium',
                'paneProperties.background': '#0e0e14',
                'paneProperties.backgroundGradientStartColor': '#0e0e14',
                'paneProperties.backgroundGradientEndColor': '#0e0e14',
            },
            custom_css_url: './../tradingview-overrides.css',
            loading_screen: { backgroundColor: '#0e0e14' },
            saved_data: chartState ? chartState.chartLayout : undefined,
            // load_last_chart:false,
            time_frames: [
                { text: '5y', resolution: '1w' as ResolutionString },
                { text: '1y', resolution: '1w' as ResolutionString },
                { text: '6m', resolution: '120' as ResolutionString },
                { text: '3m', resolution: '60' as ResolutionString },
                { text: '1m', resolution: '30' as ResolutionString },
                { text: '5d', resolution: '5' as ResolutionString },
                { text: '1d', resolution: '1' as ResolutionString },
            ],
            custom_formatters: {
                priceFormatterFactory: priceFormatterFactory,
            },
        });

        tvWidget.headerReady().then(() => {
            setChartLoadingStatus('ready');
        });
        // tvWidget.headerReady().then(() => {
        //     const liquidationsButton = tvWidget.createButton();

        //     let isToggled = false;

        //     const updateButtonStyle = () => {
        //         const svg = getLiquidationsSvgIcon(
        //             isToggled ? '#7371fc' : '#cbcaca',
        //         );
        //         liquidationsButton.style.color = isToggled
        //             ? '#7371fc'
        //             : '#cbcaca';

        //         liquidationsButton.innerHTML = `
        //             <span class="liquidations-wrapper" style="display: flex; align-items: center;border-radius:4px;padding:5px">
        //               ${svg}
        //              <span style="padding-left:3px"> Liquidations
        //              </span>`;
        //     };

        //     updateButtonStyle();

        //     const onClick = () => {
        //         isToggled = !isToggled;
        //         updateButtonStyle();

        //         if (isToggled) {
        //             console.log('Open');
        //         } else {
        //             console.log('Close');
        //         }
        //     };
        //     const onMouseEnter = () => {
        //         const wrapper = liquidationsButton.querySelector(
        //             '.liquidations-wrapper',
        //         ) as HTMLDivElement;
        //         if (wrapper) {
        //             wrapper.style.backgroundColor = '#313030';
        //         }
        //     };
        //     const onMouseLeave = () => {
        //         const wrapper = liquidationsButton.querySelector(
        //             '.liquidations-wrapper',
        //         ) as HTMLDivElement;
        //         if (wrapper) wrapper.style.backgroundColor = 'transparent';
        //     };

        //     liquidationsButton.addEventListener('click', onClick);
        //     liquidationsButton.addEventListener('mouseenter', onMouseEnter);
        //     liquidationsButton.addEventListener('mouseleave', onMouseLeave);

        //     return () => {
        //         liquidationsButton.removeEventListener('click', onClick);
        //         liquidationsButton.removeEventListener(
        //             'mouseenter',
        //             onMouseEnter,
        //         );
        //         liquidationsButton.removeEventListener(
        //             'mouseleave',
        //             onMouseLeave,
        //         );
        //     };
        // });

        tvWidget.onChartReady(() => {
            /**
             * 0 -> main chart pane
             * 1 -> volume chart pane
             */
            const volumePaneIndex = 1;

            const paneCount = tvWidget.activeChart().getPanes().length;

            if (paneCount > volumePaneIndex) {
                const priceScale = tvWidget
                    .activeChart()
                    .getPanes()
                    // eslint-disable-next-line no-unexpected-multiline
                    [volumePaneIndex].getMainSourcePriceScale();

                if (priceScale) {
                    priceScale.setAutoScale(true);
                    priceScale.setMode(0);
                }
            }

            tvWidget.applyOverrides(defaultDrawingToolColors());
            tvWidget
                .chart()
                .onIntervalChanged()
                .subscribe(null, (interval: ResolutionString) => {
                    setChartInterval(interval);
                    if (typeof plausible === 'function') {
                        plausible('Resolution Update', {
                            props: {
                                resolutionType: 'chart',
                                resolution: interval,
                            },
                        });
                    }
                });

            // Add context menu items for buy/sell
            tvWidget.onContextMenu((_unixTime: number, price: number) => {
                const formattedPrice = price.toFixed(2);

                return [
                    {
                        position: 'top' as const,
                        text: `Buy @ ${formattedPrice} (limit)`,
                        click: () => {
                            openModal(price, 'buy');
                        },
                    },
                    {
                        position: 'top' as const,
                        text: `Sell @ ${formattedPrice} (stop)`,
                        click: () => {
                            openModal(price, 'sell');
                        },
                    },
                    {
                        position: 'top' as const,
                        text: '-',
                        click: () => {},
                    },
                ];
            });

            // Add Quick Trade Mode controls to header (Toggle + Dropdown)
            tvWidget.headerReady().then(() => {
                const container = tvWidget.createButton({ align: 'left' });
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.marginLeft = '8px';
                container.style.padding = '8px 12px';
                container.style.backgroundColor = '#0e1117';
                container.style.border = 'none';
                container.style.gap = '12px';
                container.style.borderRadius = '6px';
                container.style.position = 'relative';

                const toggleLabel = document.createElement('label');
                toggleLabel.style.position = 'relative';
                toggleLabel.style.display = 'inline-block';
                toggleLabel.style.width = '44px';
                toggleLabel.style.height = '24px';
                toggleLabel.style.cursor = 'pointer';

                const toggleInput = document.createElement('input');
                toggleInput.type = 'checkbox';
                toggleInput.style.opacity = '0';
                toggleInput.style.width = '0';
                toggleInput.style.height = '0';

                const toggleSlider = document.createElement('span');
                toggleSlider.style.position = 'absolute';
                toggleSlider.style.cursor = 'pointer';
                toggleSlider.style.top = '0';
                toggleSlider.style.left = '0';
                toggleSlider.style.right = '0';
                toggleSlider.style.bottom = '0';
                toggleSlider.style.backgroundColor = '#3a3f4d';
                toggleSlider.style.transition = '0.15s';
                toggleSlider.style.borderRadius = '24px';

                const toggleKnob = document.createElement('span');
                toggleKnob.style.position = 'absolute';
                toggleKnob.style.height = '18px';
                toggleKnob.style.width = '18px';
                toggleKnob.style.left = '3px';
                toggleKnob.style.bottom = '3px';
                toggleKnob.style.backgroundColor = 'white';
                toggleKnob.style.transition = '0.15s';
                toggleKnob.style.borderRadius = '50%';

                toggleSlider.appendChild(toggleKnob);
                toggleLabel.appendChild(toggleInput);
                toggleLabel.appendChild(toggleSlider);

                const modeLabel = document.createElement('span');
                modeLabel.textContent = 'Quick Trade Mode';
                modeLabel.style.color = '#cbcaca';
                modeLabel.style.fontSize = '13px';
                modeLabel.style.fontWeight = '500';
                modeLabel.style.whiteSpace = 'nowrap';

                const dropdownButton = document.createElement('button');
                dropdownButton.style.display = 'flex';
                dropdownButton.style.alignItems = 'center';
                dropdownButton.style.gap = '8px';
                dropdownButton.style.padding = '6px 12px';
                dropdownButton.style.backgroundColor = '#2a2e39';
                dropdownButton.style.border = 'none';
                dropdownButton.style.borderRadius = '4px';
                dropdownButton.style.color = '#cbcaca';
                dropdownButton.style.fontSize = '13px';
                dropdownButton.style.cursor = 'pointer';
                dropdownButton.style.transition = 'background-color 0.15s';
                dropdownButton.style.outline = 'none';

                const dropdownMenu = document.createElement('div');
                dropdownMenu.style.position = 'fixed';
                dropdownMenu.style.backgroundColor = '#2a2e39';
                dropdownMenu.style.borderRadius = '4px';
                dropdownMenu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.zIndex = '999999';
                dropdownMenu.style.minWidth = '140px';
                dropdownMenu.style.overflow = 'hidden';
                dropdownMenu.style.border =
                    '1px solid rgba(255, 255, 255, 0.1)';

                const dropdownText = document.createElement('span');
                const dropdownArrow = document.createElement('span');
                dropdownArrow.textContent = '▼';
                dropdownArrow.style.fontSize = '10px';

                dropdownButton.appendChild(dropdownText);
                dropdownButton.appendChild(dropdownArrow);

                const tradeTypes: TradeType[] = [
                    'Market',
                    'Limit',
                    'Stop Market',
                    'Stop Limit',
                ];

                tradeTypes.forEach((type) => {
                    const item = document.createElement('div');
                    item.textContent = type;
                    item.style.padding = '8px 12px';
                    item.style.cursor = 'pointer';
                    item.style.color = '#cbcaca';
                    item.style.fontSize = '13px';
                    item.style.transition = 'background-color 0.15s';

                    item.addEventListener('mouseenter', () => {
                        item.style.backgroundColor = '#363a45';
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.backgroundColor = 'transparent';
                    });
                    item.addEventListener('click', () => {
                        setQuickModeTradeType(type);
                        dropdownMenu.style.display = 'none';
                        updateDropdownText();
                        // Open modal to configure the selected trade type
                        openQuickModeConfirm();
                    });

                    dropdownMenu.appendChild(item);
                });

                const updateDropdownText = () => {
                    const state = useOrderPlacementStore.getState();
                    dropdownText.textContent = state.quickModeTradeType;
                };

                const updateToggleState = () => {
                    const state = useOrderPlacementStore.getState();
                    toggleInput.checked = state.quickMode;

                    if (state.quickMode) {
                        toggleSlider.style.backgroundColor = '#4a8bd3';
                        toggleKnob.style.left = '23px';
                    } else {
                        toggleSlider.style.backgroundColor = '#3a3f4d';
                        toggleKnob.style.left = '3px';
                    }
                };

                updateDropdownText();
                updateToggleState();

                const unsubscribe = useOrderPlacementStore.subscribe(() => {
                    updateToggleState();
                    updateDropdownText();
                });

                toggleInput.addEventListener('change', () => {
                    toggleQuickMode();
                });

                dropdownButton.addEventListener('mouseenter', () => {
                    dropdownButton.style.backgroundColor = '#363a45';
                });
                dropdownButton.addEventListener('mouseleave', () => {
                    dropdownButton.style.backgroundColor = '#2a2e39';
                });

                dropdownButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = dropdownMenu.style.display === 'block';

                    if (!isVisible) {
                        const chartDiv = document.getElementById('tv_chart');
                        const iframe = chartDiv?.querySelector(
                            'iframe',
                        ) as HTMLIFrameElement;
                        if (iframe) {
                            const iframeRect = iframe.getBoundingClientRect();

                            const rect = dropdownButton.getBoundingClientRect();
                            dropdownMenu.style.top = `${iframeRect.top + rect.top + rect.height + 4}px`;
                            dropdownMenu.style.left = `${rect.left}px`;
                            dropdownMenu.style.display = 'block';
                        }
                    } else {
                        dropdownMenu.style.display = 'none';
                    }
                });

                container.appendChild(toggleLabel);
                container.appendChild(modeLabel);
                container.appendChild(dropdownButton);
                document.body.appendChild(dropdownMenu);

                const closeDropdownHandler = (e: MouseEvent) => {
                    if (
                        !container.contains(e.target as Node) &&
                        !dropdownMenu.contains(e.target as Node)
                    ) {
                        dropdownMenu.style.display = 'none';
                    }
                };
                document.addEventListener('click', closeDropdownHandler);

                return () => {
                    unsubscribe();
                    document.removeEventListener('click', closeDropdownHandler);
                    if (dropdownMenu.parentNode) {
                        dropdownMenu.parentNode.removeChild(dropdownMenu);
                    }
                };
            });

            setChart(tvWidget);
        });
    }, [chartState, info, tradingviewLib, marketId]);

    useEffect(() => {
        setIsChartReady(false);
        if (chart) {
            setChart(null);
        }
        initChart();

        return () => {
            try {
                if (chart) {
                    drawingEventUnsubscribe(chart);
                    studyEventsUnsubscribe(chart);
                    intervalChangedUnsubscribe(chart);
                    visibleRangeChangedUnsubscribe(chart);
                    chart.remove();
                }
            } catch (error) {
                console.error(error);
            }
        };
    }, [chartState, info, i18n.language, initChart, tradingviewLib, marketId]);

    const tvIntervalToMinutes = useCallback((interval: ResolutionString) => {
        let coef = 1;

        if (!interval) return 1;

        if (interval.includes('D')) {
            coef = 24 * 60;
        } else if (interval.includes('W')) {
            coef = 24 * 60 * 7;
        } else if (interval.includes('M')) {
            coef = 60 * 24 * 30;
        }

        const intervalNum = Number(interval.replace(/[^0-9]/g, ''));

        return intervalNum * coef;
    }, []);

    useEffect(() => {
        const chartDiv = document.getElementById('tv_chart');
        const iframe = chartDiv?.querySelector('iframe') as HTMLIFrameElement;
        const iframeDoc =
            iframe?.contentDocument || iframe?.contentWindow?.document;

        const blockSymbolSearchKeys = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            const isInInput = target && target.tagName === 'INPUT';
            const isInTextArea = target && target.tagName === 'TEXTAREA';

            if (isInInput || isInTextArea) return;

            const isSingleChar = e.key.length === 1;
            const isAlphaNumeric = /^[a-zA-Z0-9]$/.test(e.key);

            if (e.code === 'KeyD' && e.altKey) {
                e.preventDefault();
                setDebugToolbarOpen(!debugToolbarOpenRef.current);
            }
            if (
                !e.ctrlKey &&
                !e.altKey &&
                !e.metaKey &&
                isSingleChar &&
                isAlphaNumeric
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        iframeDoc?.addEventListener('keydown', blockSymbolSearchKeys, true);

        return () => {
            iframeDoc?.removeEventListener(
                'keydown',
                blockSymbolSearchKeys,
                true,
            );
        };
    }, [chart]);

    useEffect(() => {
        if (lastAwakeMs > lastSleepMs && lastSleepMs > 0) {
            const intervalMinutes = tvIntervalToMinutes(
                chartInterval as ResolutionString,
            );
            const lastSleepDurationInMinutes = parseFloat(
                ((lastAwakeMs - lastSleepMs) / 60000).toFixed(2),
            );

            if (intervalMinutes <= lastSleepDurationInMinutes) {
                chart?.resetCache();
                chart?.chart().resetData();
                chart?.chart().restoreChart();
            }
        }
    }, [lastSleepMs, lastAwakeMs, chartInterval, initChart, chart, symbol]);

    useEffect(() => {
        if (chart) {
            setIsChartReady(false);
            const chartRef = chart.chart();
            chartRef.setSymbol(symbol);
            saveChartLayout(chart);
        }
    }, [symbol]);

    useEffect(() => {
        if (dataFeedRef.current && userAddress && chart) {
            chart.chart().clearMarks();
            dataFeedRef.current.updateUserAddress(userAddress);
            getMarkFillData(symbol, userAddress);
            chart.chart().refreshMarks();
        }
    }, [userAddress, chart, symbol]);

    useEffect(() => {
        if (!chart) return;
        drawingEvent(chart);
        studyEvents(chart);
        intervalChangedSubscribe(chart, setIsChartReady);
        visibleRangeChangedSubscribe(chart);
    }, [chart]);

    useEffect(() => {
        if (chart) {
            showBuysSellsOnChart || chart.chart().clearMarks();
            showBuysSellsOnChart && chart.chart().refreshMarks();
        }
    }, [showBuysSellsOnChart]);

    return (
        <TradingViewContext.Provider value={{ chart, isChartReady }}>
            {children}
        </TradingViewContext.Provider>
    );
};

export const useTradingView = () => useContext(TradingViewContext);
