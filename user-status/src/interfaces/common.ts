export interface IListParams {
    search?: string;
    sort?: string;
    offset?: number;
    limit?: number;
}

export interface IPicture {
    banner?: string;
    thumbnail?: string;
}

export interface IValidationItem {
    field: string;
    message: string;
}

export interface IRequestData<T> {
    params?: T;
    headers?: any;
}
