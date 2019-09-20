import { Observable } from "rxjs";

export const getBody = (request$: Observable<any>) => {
    return request$
        .switchMap((it) => Observable.of(it.request.body));
};

export const getQuery = (request$: Observable<any>) => {
    return request$
        .switchMap((it) => Observable.of(it.request.query));
};

export const getParams = (request$: Observable<any>) => {
    return request$
        .switchMap((it) => Observable.of(it.params));
};

export const getHeaders = (request$: Observable<any>) => {
    return request$
        .switchMap((it) => Observable.of(it.request.headers));
};

export const getAllParams = (request$: Observable<any>) => {
    return Observable
        .zip(
            getBody(request$),
            getQuery(request$),
            getParams(request$),
            getHeaders(request$),
        )
        .map((response: any[]) => {
            const params = { ...response[0], ...response[1], ...response[2] };
            Object.keys(params).forEach((key) => {
                if (key === "limit" || key === "offset") {
                    params[key] = +params[key];
                }
            });
            const allParams = { params, headers: response[3] };
            return allParams;
        });
};

export const authorizedToken = (request$: Observable<any>) => {
    // Always return true, there is no authorization yet.
    return Observable.of({});
};

export const getSessionUser = (request$: Observable<any>): Observable<any> => {
    return request$
        .switchMap((it) => {
            const sessionUser = it.request.user;
            return Observable.of(sessionUser);
        });
};
