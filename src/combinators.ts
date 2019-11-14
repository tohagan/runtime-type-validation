import { Decoder } from './decoder';

/* tslint:disable:variable-name */

/** See `Decoder.tString` */
export const tString = Decoder.tString;

/** See `Decoder.tNumber` */
export const tNumber = Decoder.tNumber;

/** See `Decoder.tBoolean` */
export const tBoolean = Decoder.tBoolean;

/** See `Decoder.tAny` */
export const tAny = Decoder.tAny;

/** See `Decoder.tUnknown` */
export const tUnknown: () => Decoder<unknown> = Decoder.tUnknown;

/** See `Decoder.constant` */
export const constant = Decoder.constant;

/** See `Decoder.tObject` */
export const tObject = Decoder.tObject;

/** See `Decoder.tObjectStrict` */
export const tObjectStrict = Decoder.tObjectStrict;

/** See `Decoder.tArray` */
export const tArray = Decoder.tArray;

/** See `Decoder.tuple` */
export const tuple = Decoder.tuple;

/** See `Decoder.tDict` */
export const tDict = Decoder.tDict;

/** See `Decoder.optional` */
export const optional = Decoder.optional;

/** See `Decoder.oneOf` */
export const oneOf = Decoder.oneOf;

/** See `Decoder.union` */
export const union = Decoder.union;

/** See `Decoder.intersection` */
export const intersection = Decoder.intersection;

/** See `Decoder.withDefault` */
export const withDefault = Decoder.withDefault;

/** See `Decoder.valueAt` */
export const valueAt = Decoder.valueAt;

/** See `Decoder.succeed` */
export const succeed = Decoder.succeed;

/** See `Decoder.fail` */
export const fail = Decoder.fail;

/** See `Decoder.lazy` */
export const lazy = Decoder.lazy;
