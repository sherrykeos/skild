const validate = (schema, target = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[target]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Validation failed.",
                    details: result.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                },
            });
        }

        try {
            req[target] = result.data;
        } catch {
            if (typeof req[target] === "object" && req[target] !== null) {
                Object.assign(req[target], result.data);
            }
        }

        next();
    };
};

export default validate;