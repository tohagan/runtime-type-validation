import {Decoder} from './decoder';

/* tslint:disable:variable-name */

/** See `Decoder.string` */
export const vString = Decoder.vString;

/** See `Decoder.number` */
export const vNumber = Decoder.vNumber;

/** See `Decoder.boolean` */
export const vBoolean = Decoder.vBoolean;

/** See `Decoder.anyJson` */
export const anyJson = Decoder.anyJson;

/** See `Decoder.unknownJson` */
export const unknownJson: () => Decoder<unknown> = Decoder.unknownJson;

/** See `Decoder.constant` */
export const constant = Decoder.constant;

/** See `Decoder.object` */
export const vObject = Decoder.vObject;

/** See `Decoder.array` */
export const vArray = Decoder.vArray;

/** See `Decoder.tuple` */
export const tuple = Decoder.tuple;

/** See `Decoder.dict` */
export const dict = Decoder.dict;

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
