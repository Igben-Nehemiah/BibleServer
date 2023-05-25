import { Response } from "./base.response";

export class NotFoundResponse<T> extends Response<T> {
    constructor(error?: string) {
        super(404, null, error ? error : "Resource not found");
    };
};