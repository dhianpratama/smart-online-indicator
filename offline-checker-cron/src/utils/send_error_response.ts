import { Observable } from "rxjs";

import { logger } from "../infrastructure/logging/logger";
import { sendJsendResponse } from "./send_jsend_response";

const sendErrorResponse = (requestObservable, err) => {
    return Observable
        .of(convertErrorToJsend(err))
        .switchMap((data) => sendJsendResponse(requestObservable, undefined, data.message, data.statusCode));
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

export { sendErrorResponse };
