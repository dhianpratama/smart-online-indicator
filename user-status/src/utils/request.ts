import { Observable } from "rxjs";

export const getBody = (requestObservable: Observable<any>) => {
    return requestObservable
        .switchMap((it) => Observable.of(it.request.body));
};

export const getQuery = (requestObservable: Observable<any>) => {
    return requestObservable
        .switchMap((it) => Observable.of(it.request.query));
};

export const getParams = (requestObservable: Observable<any>) => {
    return requestObservable
        .switchMap((it) => Observable.of(it.params));
};

export const getHeaders = (requestObservable: Observable<any>) => {
    return requestObservable
        .switchMap((it) => Observable.of(it.request.headers));
};

export const getAllParams = (requestObservable: Observable<any>) => {
    return Observable
        .zip(
            getBody(requestObservable),
            getQuery(requestObservable),
            getParams(requestObservable),
            getHeaders(requestObservable),
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

export const authorizedToken = (requestObservable: Observable<any>) => {
    return Observable.of({});
};

export const getSessionUser = (requestObservable: Observable<any>): Observable<any> => {
    return requestObservable
        .switchMap((it) => {
            const sessionUser = it.request.user;
            return Observable.of(sessionUser);
        });
};
