import React, { Suspense, useEffect, useState } from 'react';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
    useRouteError,
} from 'react-router';

// Components
import Notifications from '~/components/Notifications/Notifications';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import PageHeader from './components/PageHeader/PageHeader';
import MobileFooter from './components/MobileFooter/MobileFooter';
import WebSocketDebug from './components/WebSocketDebug/WebSocketDebug';
import WsConnectionChecker from './components/WsConnectionChecker/WsConnectionChecker';
import RuntimeDomManipulation from './components/Core/RuntimeDomManipulation';

// Providers
import { AppProvider } from './contexts/AppContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { SdkProvider } from './hooks/useSdk';
import { TutorialProvider } from './hooks/useTutorial';
import { UnifiedMarginDataProvider } from './hooks/useUnifiedMarginData';
import { FogoSessionProvider } from '@fogo/sessions-sdk-react';

// Config
import {
    MARKET_WS_ENDPOINT,
    RPC_ENDPOINT,
    USER_WS_ENDPOINT,
    SHOULD_LOG_ANALYTICS,
    SPLIT_TEST_VERSION,
} from './utils/Constants';
import packageJson from '../package.json';
import { useDebugStore } from './stores/DebugStore';

// Styles
import './css/app.css';
import './css/index.css';
import { getResolutionSegment } from './utils/functions/getSegment';

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='error-fallback'>
                    <h2>Something went wrong</h2>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Document Shell Component
export function Document({ children }: { children: React.ReactNode }) {
    const [innerHeight, setInnerHeight] = useState<number>();
    const [innerWidth, setInnerWidth] = useState<number>();

    useEffect(() => {
        // Client-side only
        if (typeof window === 'undefined') return;

        // Load TradingView script
        const script = document.createElement('script');
        script.src = '../tv/datafeeds/udf/dist/bundle.js';
        script.async = true;
        script.onerror = (error) =>
            console.error('Failed to load TradingView script:', error);
        document.head.appendChild(script);

        // Set viewport dimensions
        const handleResize = () => {
            setInnerHeight(window.innerHeight);
            setInnerWidth(window.innerWidth);
        };

        // Initial set
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            // Don't remove the script to prevent errors
        };
    }, []);

    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/images/favicon.ico' sizes='48x48' />
                <link
                    rel='icon'
                    href='/images/favicon.svg'
                    sizes='any'
                    type='image/svg+xml'
                />
                <link
                    rel='apple-touch-icon'
                    href='/images/apple-touch-icon-180x180.png'
                />
                <link rel='manifest' href='/manifest.webmanifest' />
                <Meta />
                <Links />
                {/* Preconnect to Google Fonts domains */}
                <link
                    rel='preconnect'
                    href='https://fonts.googleapis.com'
                    crossOrigin='anonymous'
                />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin='anonymous'
                />

                {/* Single consolidated font request with all needed weights and families */}
                <link
                    rel='preload'
                    as='style'
                    href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Funnel+Display:wght@300..800&family=Inconsolata:wght@500&family=Lexend+Deca:wght@100;300&family=Roboto+Mono:wght@400&display=swap&display=swap'
                />
                <link
                    rel='stylesheet'
                    href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Funnel+Display:wght@300..800&family=Inconsolata:wght@500&family=Lexend+Deca:wght@100;300&family=Roboto+Mono:wght@400&display=swap&display=swap'
                    media='print'
                    onLoad={(e) => {
                        const target = e.target as HTMLLinkElement;
                        target.media = 'all';
                    }}
                />
                <link
                    rel='preload'
                    as='font'
                    type='font/woff2'
                    href='https://fonts.gstatic.com/s/lexenddeca/v24/K2F1fZFYk-dHSE0UPPuwQ5qnJy8.woff2'
                    crossOrigin='anonymous'
                />
                <link
                    rel='preload'
                    as='font'
                    type='font/woff2'
                    href='https://fonts.gstatic.com/s/funneldisplay/v2/B50WF7FGv37QNVWgE0ga--4Pbb6dDYs.woff2'
                    crossOrigin='anonymous'
                />
                {SHOULD_LOG_ANALYTICS && (
                    <script
                        defer
                        event-version={packageJson.version}
                        event-windowheight={
                            innerHeight
                                ? getResolutionSegment(innerHeight)
                                : undefined
                        }
                        event-windowwidth={
                            innerWidth
                                ? getResolutionSegment(innerWidth)
                                : undefined
                        }
                        event-splittestversion={SPLIT_TEST_VERSION}
                        data-domain='perps.ambient.finance'
                        src='https://plausible.io/js/script.pageview-props.tagged-events.js'
                    ></script>
                )}
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

// Main App Component
export default function App() {
    const { wsEnvironment } = useDebugStore();
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '';

    return (
        <Document>
            <FogoSessionProvider
                endpoint={RPC_ENDPOINT}
                domain='https://perps.ambient.finance'
                tokens={['fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry']}
                defaultRequestedLimits={{
                    fUSDNGgHkZfwckbr5RLLvRbvqvRcTLdH9hcHJiq4jry: 1_000_000_000n,
                }}
                enableUnlimited={true}
            >
                <AppProvider>
                    <UnifiedMarginDataProvider>
                        <MarketDataProvider>
                            <SdkProvider
                                environment={wsEnvironment}
                                marketEndpoint={MARKET_WS_ENDPOINT}
                                userEndpoint={USER_WS_ENDPOINT}
                            >
                                <TutorialProvider>
                                    <ErrorBoundary>
                                        <WsConnectionChecker />
                                        <WebSocketDebug />
                                        <div className='root-container'>
                                            <PageHeader />
                                            <main
                                                className={`content ${isHomePage ? 'home-page' : ''}`}
                                            >
                                                <Suspense
                                                    fallback={
                                                        <LoadingIndicator />
                                                    }
                                                >
                                                    <Outlet />
                                                </Suspense>
                                            </main>
                                            <MobileFooter />
                                            <Notifications />
                                        </div>
                                        <RuntimeDomManipulation />
                                    </ErrorBoundary>
                                </TutorialProvider>
                            </SdkProvider>
                        </MarketDataProvider>
                    </UnifiedMarginDataProvider>
                </AppProvider>
            </FogoSessionProvider>
        </Document>
    );
}

// Error Page Component
export function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    if (isRouteErrorResponse(error)) {
        return (
            <div className='error-page'>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data?.message || 'An error occurred'}</p>
            </div>
        );
    }

    return (
        <div className='error-page'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>
                    {error instanceof Error ? error.message : 'Unknown error'}
                </i>
            </p>
            <button onClick={() => window.location.reload()}>
                Reload Page
            </button>
        </div>
    );
}
