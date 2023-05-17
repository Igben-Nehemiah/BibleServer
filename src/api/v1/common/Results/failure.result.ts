import Result from "./base.result";

class FailureResult<T> extends Result<T> {
    constructor(errors: string | string[] | null) {
        super(null, false, errors);
    }
}

export default FailureResult;