import * as Result from './result';
export { isOk, isErr } from './result';

export { Result };
export { Validator, ValidatorError, isValidatorError, ValidatorObject } from './validator';

export {
  tString, tNumber, tBoolean, tFunction, tObject, tObjectStrict, tArray, tDict, tAny, tUnknown,
  constant, tuple, optional, oneOf, union, intersection,
  withDefault, valueAt, succeed, fail, lazy
} from './combinators';

export {
  tNullable, tEnum, range, chars, charsMin, charsMax, charsRange, matches, httpUrl
} from './extensions';

