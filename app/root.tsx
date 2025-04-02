import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router';
import Notifications from '~/components/Notifications/Notifications';
import type { Route } from './+types/root';
import PageHeader from './components/PageHeader/PageHeader';

import './css/app.css';
import './css/index.css';
import { WsObserverProvider } from './hooks/useWsObserver';
import { useDebugStore } from './stores/DebugStore';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script src="../tv/datafeeds/udf/dist/bundle.js"></script>
      </body>
    </html>
  );
}

export default function App() {


  const { wsUrl } = useDebugStore();

  return (
    <>
      <script dangerouslySetInnerHTML={{
        __html: `
        // Tanılama script'i - sayfanın en başında çalışır
        (function() {
          try {
            var timestamp = Date.now();
            var pageLoadData = {
              url: window.location.href,
              timestamp: timestamp,
              userAgent: navigator.userAgent
            };
            
            // Local storage'a kaydet
            localStorage.setItem('last_page_load_attempt', JSON.stringify(pageLoadData));
            
            // İlk yükleme aşamasını kaydet
            document.documentElement.setAttribute('data-initial-load', timestamp);
            
            // Sayfa tamamen yüklenince
            window.addEventListener('load', function() {
              document.documentElement.setAttribute('data-fully-loaded', 'true');
              localStorage.setItem('last_page_load_success', JSON.stringify({
                ...pageLoadData,
                loadTime: Date.now() - timestamp
              }));
            });
          } catch(e) {
            // Sessizce başarısız ol
          }
        })();
      `}} />
      <Layout>
        <WsObserverProvider url={wsUrl}>
          <div className='root-container'>
            <header className='header'>
              <PageHeader />
            </header>

            <main className='content'>
              <Outlet />
            </main>

            <Notifications />
          </div>
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
    </main>
  );
}
