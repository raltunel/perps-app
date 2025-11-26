import { useEffect, useRef, useState } from 'react';
import styles from './DebugConsole.module.css';

type LogEntry = {
    id: number;
    args: unknown[];
};

export default function DebugConsole() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const filterRef = useRef<string>('>>>');
    const idRef = useRef(0);

    const logsRef = useRef<HTMLDivElement>(null);

    const numRef = useRef(0);

    const autoScrollRef = useRef(true);

    useEffect(() => {
        if (!logsRef.current) return;

        if (autoScrollRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        const el = logsRef.current;
        if (!el) return;

        const onScroll = () => {
            const bottom = el.scrollHeight - (el.scrollTop + el.clientHeight);

            if (bottom < 200) {
                autoScrollRef.current = true;
            } else {
                autoScrollRef.current = false;
            }
        };

        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const original = window.console.log;

        window.console.log = (...args: unknown[]) => {
            const flatText = args
                .map((a) => (typeof a === 'string' ? a : ''))
                .join(' ');

            if (flatText.includes(filterRef.current)) {
                setLogs((prev) => {
                    const next: LogEntry[] = [
                        ...prev,
                        { id: idRef.current++, args },
                    ];
                    return next.length > 100 ? next.slice(-100) : next;
                });
            }

            original(...args);
        };

        return () => {
            window.console.log = original;
        };
    }, []);

    const renderArg = (arg: unknown, index: number) => {
        if (arg === null || arg === undefined)
            return <span key={index}>{String(arg)} </span>;

        const type = typeof arg;

        if (
            type === 'string' ||
            type === 'number' ||
            type === 'boolean' ||
            type === 'bigint'
        ) {
            return <span key={index}>{String(arg)} </span>;
        }

        if (type === 'object') {
            let label = 'Object';

            if (Array.isArray(arg)) {
                label = `Array(${arg.length})`;
            }

            let json = '';
            try {
                json = JSON.stringify(arg, null, 2);
            } catch {
                json = '[Circular / Non-serializable object]';
            }

            return (
                <details key={index} style={{ marginLeft: 4 }}>
                    <summary>{label}</summary>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {json}
                    </pre>
                </details>
            );
        }

        return <span key={index}>{String(arg)} </span>;
    };

    const scrollToBottom = () => {
        autoScrollRef.current = true;
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    };

    return (
        <div className={styles.consoleWrapper}>
            <button onClick={scrollToBottom} className={styles.toBottomBtn}>
                ⬇ Bottom
            </button>

            <div className={styles.logs} ref={logsRef}>
                {logs.map((log) => (
                    <div key={log.id} className={styles.logRow}>
                        {log.args.map(renderArg)}
                    </div>
                ))}
            </div>
        </div>
    );
}
