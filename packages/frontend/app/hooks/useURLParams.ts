import { useSearchParams } from 'react-router';

export interface UrlParamMethodsIF {
    value: string | null;
    set(value: string): void;
}

export function useUrlParams(key: string): UrlParamMethodsIF {
    const [searchParams, setSearchParams] = useSearchParams();
    return {
        value: searchParams.get(key),
        set(value: string): void {
            const newParams: URLSearchParams = new URLSearchParams(
                searchParams,
            );
            newParams.set(key, value);
            setSearchParams(newParams);
        },
    };
}
