import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
    next(
        new ApiError(
            404,
            "The requested route does not exist.",
            "ROUTE_NOT_FOUND",
        ),
    );
};

export default notFound;