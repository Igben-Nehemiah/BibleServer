import { Response } from "./base.response";

export class Ok<T> extends Response<T> {
    constructor(data?: T) {
        super(200, data);
    };
};