import { throwIfNull } from "./null.guard"
import { throwIfUndefined } from "./undefined.guard";

export const throwIfNullOrUndefined = <T>(value: T) => {
    throwIfNull(value);
    throwIfUndefined(value);
};