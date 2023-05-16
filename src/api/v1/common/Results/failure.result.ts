import Result from "./base.result";

class FailureResult<T> extends Result<T> {
    constructor(data: T, 
        errors: string | string[] | null) {
        super(data, false, errors);
    }
}

export default FailureResult;