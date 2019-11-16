import * as Result from './result';
export { Result };

export { isOk, isErr } from './result';

export { Validator, ValidatorError, isValidatorError, ValidatorObject, CheckResult } from './validator';
export { nullable, truthy, falsy, range, chars, charsMin, charsMax, charsRange, matches, httpUrl } from './constraints';

import { Validator } from './validator';

/* tslint:disable:variable-name */

/** See `Validator.tString` */
export const tString = Validator.tString;

/** See `Validator.tNumber` */
export const tNumber = Validator.tNumber;

/** See `Validator.tBoolean` */
export const tBoolean = Validator.tBoolean;

/** See `Validator.tFunction` */
export const tFunction = Validator.tFunction;

/** See `Validator.tUndefined` */
export const tUndefined = Validator.tUndefined;

/** See `Validator.tAny` */
export const tAny = Validator.tAny;

/** See `Validator.tUnknown` */
export const tUnknown: () => Validator<unknown> = Validator.tUnknown;

/** See `Validator.tObject` */
export const tObject = Validator.tObject;

/** See `Validator.tObjectStrict` */
export const tObjectStrict = Validator.tObjectStrict;

/** See `Validator.tArray` */
export const tArray = Validator.tArray;

/** See `Validator.tDict` */
export const tDict = Validator.tDict;

/** See `Validator.constant` */
export const constant = Validator.constant;

/** See `Validator.tuple` */
export const tuple = Validator.tuple;

/** See `Validator.optional` */
export const optional = Validator.optional;

/** See `Validator.oneOf` */
export const oneOf = Validator.oneOf;

/** See `Validator.union` */
export const union = Validator.union;

/** See `Validator.intersection` */
export const intersection = Validator.intersection;

/** See `Validator.withDefault` */
export const withDefault = Validator.withDefault;

/** See `Validator.valueAt` */
export const valueAt = Validator.valueAt;

/** See `Validator.succeed` */
export const succeed = Validator.succeed;

/** See `Validator.fail` */
export const fail = Validator.fail;

/** See `Validator.lazy` */
export const lazy = Validator.lazy;

