import { useSearchParams } from 'react-router';

export interface UrlParamMethodsIF {
    value: string | null;
}

export function useUrlParams(key: string): UrlParamMethodsIF {
    const [searchParams] = useSearchParams();
    return {
        value: searchParams.get(key),
    };
}
