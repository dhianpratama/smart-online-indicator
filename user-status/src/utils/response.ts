import * as httpStatus from "http-status";
import { Observable } from "rxjs";
import { logger } from "../utils/logger";

export const createHttpError = (message: string, statusCode: number) => {
    const error = new Error(message) as any;
    error.statusCode = statusCode;
    error.isKnownError = true;

    return error;
};

const convertErrorToJsend = (err) => {
    if (err && err.message && err.isKnownError) {
        return {
            statusCode: err.statusCode,
            message: err.message,
        };
    }

    // Log unhandled error
    logger.error(` UNHANDLED ERROR
        ----------------------------
        ${err.stack}
    `);

    return {
        statusCode: 500,
        message: "Something went wrong. Please contact developer.",
    };
};

const sendErrorResponse = (request$: Observable<any>, err: Error) => {
    return Observable
        .of(convertErrorToJsend(err))
        .switchMap((data) => sendJsendResponse(request$, undefined, data.message, data.statusCode));
};

interface IResponseBody {
    status: string;
    message?: string;
    data?: any;
  }

const sendJsendResponse = (requestObservable, data: any = undefined, message: string = undefined, statusCode: number = httpStatus.OK) => {
    return requestObservable
        .map((response) => {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        response.set("Access-Control-Allow-Credentials", true);
        response.set("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
        response.set("Content-Type", "application/json");

        const responseBody: IResponseBody = {
            status: (statusCode >= 200 && statusCode < 400) ? "success" : "failed",
        };

        if (data) {
            responseBody.data = data;
        }
        if (message) {
            responseBody.message = message;
        }

        response.body = responseBody;
        response.status = statusCode;
        return response;
        });
};

export { sendErrorResponse, sendJsendResponse };
