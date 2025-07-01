export type TableSortDirection = 'asc' | 'desc' | undefined;

export enum TableState {
    LOADING = 'loading',
    EMPTY = 'empty',
    FILLED = 'filled',
}

export interface HeaderCell {
    name: string;
    key: string;
    sortable?: boolean;
    className: string;
    exportable?: boolean;
}
