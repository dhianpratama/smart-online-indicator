import { sendErrorResponse } from "../../utils/send_error_response";
import { sendJsendResponse } from "../../utils/send_jsend_response";

const livenessHandler = (requestObservable) => {
    return requestObservable
        .switchMapTo(sendJsendResponse(requestObservable, undefined, "OK"))
        .catch((err) => sendErrorResponse(requestObservable, err));
};

export { livenessHandler };
