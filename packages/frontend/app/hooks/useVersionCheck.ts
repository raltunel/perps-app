import { useEffect, useRef, useState } from 'react';

export function useVersionCheck() {
    const [showReload, setShowReload] = useState(false);
    const currentVersion = useRef(null);

    useEffect(() => {
        fetch('/version.json', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                currentVersion.current = data.version;
            });

        const interval = setInterval(() => {
            fetch('/version.json', { cache: 'no-store' })
                .then((res) => res.json())
                .then((data) => {
                    if (
                        currentVersion.current &&
                        data.version !== currentVersion.current
                    ) {
                        currentVersion.current = data.version;
                        setShowReload(true);
                    }
                });
        }, 15 * 1000); // Check every 15 seconds
        // 5 * 60 * 1000, // 5 minutes

        return () => clearInterval(interval);
    }, []);

    // Return as array (like useState)
    return { showReload, setShowReload };
}
