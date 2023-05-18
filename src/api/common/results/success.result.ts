import Result from "./base.result";

class SuccessResult<T> extends Result<T> {
    constructor(data: T) {
        super(data, true, null);
    }
}

export default SuccessResult;