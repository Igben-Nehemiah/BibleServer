import throwIfNull from "./null.guard"
import throwIfUndefined from "./undefined.guard";

const throwIfNullOrUndefined = <T>(value: T) => {
    throwIfNull(value);
    throwIfUndefined(value);
}

export default throwIfNullOrUndefined;