class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong.",
        code = "INTERNAL_SERVER_ERROR",
        errors = [],
    ) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;