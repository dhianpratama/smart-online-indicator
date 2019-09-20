import { sendErrorResponse, sendJsendResponse } from "../../utils/response";

const livenessHandler = (requestObservable) => {
    return requestObservable
        .switchMapTo(sendJsendResponse(requestObservable, undefined, "OK"))
        .catch((err) => sendErrorResponse(requestObservable, err));
};

export { livenessHandler };
