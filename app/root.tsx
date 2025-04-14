import React, { Suspense, useEffect, useMemo } from 'react';
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'react-router';
import Notifications from '~/components/Notifications/Notifications';
import type { Route } from './+types/root';
import PageHeader from './components/PageHeader/PageHeader';

import RuntimeDomManipulation from './components/Core/RuntimeDomManipulation';
import './css/app.css';
import './css/index.css';
import { WsObserverProvider } from './hooks/useWsObserver';
import { useDebugStore } from './stores/DebugStore';

// Added ComponentErrorBoundary to prevent entire app from crashing when a component fails
class ComponentErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('Component error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='component-error'>
                    <h3>Something went wrong</h3>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Added loading component for async operations
function LoadingIndicator() {
    return <div className='loading-indicator'>Loading...</div>;
}

export function Layout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '../tv/datafeeds/udf/dist/bundle.js';
        script.async = true;
        script.onerror = (error) => {
            console.error('Failed to load TradingView script:', error);
        };
        document.head.appendChild(script);

        return () => {
            // Cleanup script when component unmounts
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const ogImage = useMemo(
        () =>
            `https://ogcdn.net/da4a0656-0565-4e39-bf07-21693b0e75f4/v1/${'BTC'}%20%2F%20USD/%23000000/Trade%20Futures%20on%20Ambient/Trade%20Now/rgba(78%2C%2059%2C%20193%2C%201)/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2Ff4b4ae96-8d00-4542-be9a-aa88baa20b71.png%3Ftoken%3Dr8QAtZP22dg8D9xO49yyukxsP6vMYppjw5a1t-5PE1M%26height%3D500%26width%3D500%26expires%3D33280645642/rgba(82%2C%2071%2C%20179%2C%201)/linear-gradient(120deg%2C%20rgba(255%2C255%2C255%2C1)%2027%25%2C%20RGBA(62%2C%2051%2C%20147%2C%201)%2086%25)/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F97217047-4d16-43c6-82d9-00def7bf6631.png%3Ftoken%3DpnvvvLULvCnOD2vp4i4ifsuEqIzLf8Q-TyveG-a3eQw%26height%3D510%26width%3D684%26expires%3D33280645584/og.png`,
        [],
    );

    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <title>Ambient Perps</title>
                <meta property='og:image' content={ogImage} />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
                {/* Removed inline script - now loading dynamically in useEffect */}
            </body>
        </html>
    );
}

export default function App() {
    // Use memoized value to prevent unnecessary re-renders
    const { wsUrl } = useDebugStore();

    return (
        <>
            <Layout>
                <WsObserverProvider url={wsUrl}>
                    <div className='root-container'>
                        {/* Added error boundary for header */}
                        <ComponentErrorBoundary>
                            <header className='header'>
                                <PageHeader />
                            </header>
                        </ComponentErrorBoundary>

                        <main className='content'>
                            {/*  Added Suspense for async content loading */}
                            <Suspense fallback={<LoadingIndicator />}>
                                <ComponentErrorBoundary>
                                    <Outlet />
                                </ComponentErrorBoundary>
                            </Suspense>
                        </main>

                        {/* Added error boundary for notifications */}
                        <ComponentErrorBoundary>
                            <Notifications />
                        </ComponentErrorBoundary>
                    </div>
                    <RuntimeDomManipulation />
                </WsObserverProvider>
            </Layout>
        </>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className='content error-boundary'>
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre>
                    <code>{stack}</code>
                </pre>
            )}
            {/*  Added refresh button for better user experience */}
            <button
                onClick={() => window.location.reload()}
                className='retry-button'
            >
                Reload Page
            </button>
        </main>
    );
}
