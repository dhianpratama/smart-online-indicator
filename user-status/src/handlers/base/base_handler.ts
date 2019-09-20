import * as httpStatus from "http-status";
import { Observable } from "rxjs";
import { IRequestData, IValidationItem } from "../../interfaces/common";
import { connectRedis } from "../../utils/connect_redis";
import { authorizedToken, getAllParams } from "../../utils/request";
import { createHttpError, sendErrorResponse, sendJsendResponse } from "../../utils/response";

export enum Database {
    MONGO,
    POSTGRES,
    REDIS,
}

export class BaseHandler<T> {
    private validation: IValidationItem[];
    private epicFunction: any;
    private includeResponseData: boolean = false;
    private includeResponseMessage: boolean = false;
    private messageResponse: string;
    private useAuthorization: boolean = false;
    private databases: Database[] = [];

    constructor (private request$: Observable<any>) {}

    public withValidation (validation: IValidationItem[]) {
        this.validation = validation;

        return this;
    }

    public withAuthorization () {
        this.useAuthorization = true;

        return this;
    }

    public withDatabase (database: Database) {
        this.databases.push(database);

        return this;
    }

    public withLogic (epicFunction: any) {
        this.epicFunction = epicFunction;

        return this;
    }

    public withResponseData () {
        this.includeResponseData = true;

        return this;
    }

    public withResponseMessage (message: string) {
        this.includeResponseMessage = true;
        this.messageResponse = message;

        return this;
    }

    public process () {
        return this.request$
            .switchMap(() => {
                return this.useAuthorization
                    ? authorizedToken(this.request$)
                    : Observable.of(undefined);
            })
            .switchMap(() => {
                const observables = this.databases.map((d) => {
                    let obs;
                    switch (d) {
                        case Database.REDIS:
                            obs = connectRedis();
                            break;
                    }

                    return obs;
                });

                if (observables.length === 0) {
                    return Observable.of([]);
                }

                return Observable.zip(...observables);
            })
            .switchMap(() => getAllParams(this.request$))
            .switchMap((data: IRequestData<T>) => {
                const { params } = data;

                return !this.validation || this.validation.length === 0
                    ? Observable.of(data)
                    : this.checkValidation(params, this.validation)
                        .switchMap(() => Observable.of(data));
            })
            .switchMap((data: IRequestData<T>) => this.epicFunction(data))
            .switchMap((data: any) => sendJsendResponse(this.request$,
                this.includeResponseData ? data : undefined,
                this.includeResponseMessage ? this.messageResponse : undefined))
            .catch((err) => sendErrorResponse(this.request$, err));
    }

    private checkValidation (params: T, validation: IValidationItem[]) {
        let i: number;
        for (i = 0; i < validation.length; i++) {
            const v = validation[i];
            if (!params[v.field]) {
                return Observable.throw(createHttpError(v.message, httpStatus.BAD_REQUEST));
            }
        }
        return Observable.of(params);
    }

}
