import * as httpStatus from "http-status";
import { Observable } from "rxjs";
import { connectRedis } from "../../infrastructure/redis/connect_redis";
import { IRequestData, IValidationItem } from "../../interfaces/common";
import { createHttpError } from "../../utils/create_http_error";
import { authorizedToken, getAllParams, getSessionUser } from "../../utils/request";
import { sendErrorResponse } from "../../utils/send_error_response";
import { sendJsendResponse } from "../../utils/send_jsend_response";

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

    constructor (
        private requestObservable: any,
    ) {
    }

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
        return this.requestObservable
            .switchMap(() => {
                return this.useAuthorization
                    ? authorizedToken(this.requestObservable)
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
                    return Observable.of(true);
                }

                return Observable.zip(...observables);
            })
            .switchMapTo(getAllParams(this.requestObservable))
            .switchMap((data: IRequestData<T>) => {
                const { params } = data;

                return !this.validation || this.validation.length === 0
                    ? Observable.of(data)
                    : this.checkValidation(params, this.validation)
                        .switchMap(() => Observable.of(data));
            })
            .switchMap((data: IRequestData<T>) => this.epicFunction(data))
            .switchMap((data: any) => sendJsendResponse(this.requestObservable,
                this.includeResponseData ? data : undefined,
                this.includeResponseMessage ? this.messageResponse : undefined))
            .catch((err) => sendErrorResponse(this.requestObservable, err));
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
