export type TableSortDirection = 'asc' | 'desc' | undefined;

export enum TableState {
    LOADING = 'loading',
    EMPTY = 'empty',
    FILLED = 'filled',
}

export interface HeaderCell<T> {
    name: string;
    key: string;
    sortable?: boolean;
    className: string;
    exportable?: boolean;
    exportAction?: (data: T) => string;
}
