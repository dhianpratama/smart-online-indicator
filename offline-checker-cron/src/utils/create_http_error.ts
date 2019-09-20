export const createHttpError = (message: string, statusCode: number) => {
    const error = new Error(message) as any;
    error.statusCode = statusCode;
    error.isKnownError = true;

    return error;
};
