import { useEffect, useRef, useState } from 'react';

export function useVersionCheck() {
    const [showReload, setShowReload] = useState(false);
    const currentVersion = useRef(null);

    useEffect(() => {
        // Fetch the version file on load
        fetch('/version.json', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
                currentVersion.current = data.version;
            });

        // Poll for changes every 5 minutes
        const interval = setInterval(
            () => {
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
            },
            15 * 1000, // 15 seconds
            // 5 * 60 * 1000, // 5 minutes
        );

        return () => clearInterval(interval);
    }, []);

    return showReload;
}
