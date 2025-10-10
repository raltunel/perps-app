export async function loadTradingView() {
    // If running in SSR or there is no window, skip loading
    if (typeof window === 'undefined') {
        console.warn(
            '[loadTradingView] TradingView is not loaded in SSR environment.',
        );
        return { widget: null };
    }

    try {
        const tv = await import(/* @vite-ignore */ 'app/tv/charting_library');

        return { widget: tv.widget };
    } catch {
        console.warn(
            '[loadTradingView] TradingView library not found — skipping chart initialization.',
        );
        return { widget: null };
    }
}
