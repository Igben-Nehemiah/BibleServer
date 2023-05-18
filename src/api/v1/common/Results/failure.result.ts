import Result from "./base.result";

class FailureResult<T> extends Result<T> {
    constructor(error: string | null) {
        super(null, false, error);
    }
}

export default FailureResult;