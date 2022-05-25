class CustomAPIError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

const createCustomError = (msg: string, statusCode: number) => {
    return new CustomAPIError(msg, statusCode);
};

export { createCustomError, CustomAPIError };
