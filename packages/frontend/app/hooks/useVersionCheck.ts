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

        const interval = setInterval(
            () => {
                fetch('/version.json', { cache: 'no-store' })
                    .then((res) => res.json())
                    .then((data) => {
                        if (
                            currentVersion.current &&
                            data.version !== currentVersion.current
                        ) {
                            currentVersion.current = data.version; // reset baseline to allow user to dismiss reload prompt
                            setShowReload(true);
                        }
                    });
            },
            5 * 60 * 1000, // Check every 5 minutes
        );

        return () => clearInterval(interval);
    }, []);

    return { showReload, setShowReload };
}
