import * as Result from './result';

export { Result };
export { Decoder, DecoderError, isDecoderError, DecoderObject } from './decoder';

export {
  tString, tNumber, tBoolean, tObject, tObjectStrict, tArray, tDict, tAny, tUnknown,
  constant, tuple, optional, oneOf, union, intersection,
  withDefault, valueAt, succeed, fail, lazy
} from './combinators';

export {
  tNullable, tEnum, range, chars, charsMin, charsMax, charsRange, matches, url
} from './extensions';

