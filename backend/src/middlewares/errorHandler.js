const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;

    const errorResponse = {
        success: false,
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: err.message || "An unexpected error occurred.",
        },
    };

    if (err.errors?.length > 0) {
        errorResponse.error.details = err.errors;
    }

    if (process.env.NODE_ENV === "development") {
        errorResponse.error.stack = err.stack;
    }

    return res
        .status(statusCode)
        .json(errorResponse);
};

export default errorHandler;