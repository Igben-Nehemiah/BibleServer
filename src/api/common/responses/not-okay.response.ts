import { Response } from "./base.response";

export class NotOk<T> extends Response<T> {
    constructor(statusCode: number, error?: string) {
        super(statusCode, null, error);
    };
};