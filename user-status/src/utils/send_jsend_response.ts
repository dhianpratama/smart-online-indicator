import * as httpStatus from "http-status";

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

export { sendJsendResponse };
