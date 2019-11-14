import { Decoder } from './decoder';
import { union, constant, oneOf, tNumber, tString } from './combinators';

/**
 * Allow null or the type checked value.
 * @param decoder
 */
export function tNullable<A>(decoder: Decoder<A>): Decoder<A | null> {
  return union(decoder, constant(null));
}

/**
 * Converts zero or more string or number arguments into a `oneOf()` condition
 * that matches exactly one of the string values as a constant.
 *
 * @param values
 */
export function tEnum<T extends string | number>(...values: T[]): Decoder<T> {
  const decoders: Decoder<T>[] = values.map(v => constant(v));
  return oneOf(...decoders);
};

/**
 * Matches a number between `min` .. `max` (inclusive).
 * @param min
 * @param max
 */
export const range = (min: number, max: number) => tNumber().where(n => n >= min && n <= max, `expected a number between ${min} and ${max}`);

/**
 * Matches a string having exactly `length` characters.
 * @param length
 */
export const chars = (length: number) => tString().where((s) => s.length === length, `expected a string of length ${length}`);

/**
 * Matches a string having a minimum of `min` characters.
 * @param min
 */
export const charsMin = (min: number) => tString().where((s) => s.length >= min, `expected a string of minimum length ${min}`);

/**
 * Matches a string having a maximum of `max` characters.
 * @param max
 */
export const charsMax = (max: number) => tString().where((s) => s.length <= max, `expected a string of maximum length ${max}`);

/**
 * Matches a string having a `length` between `min` .. `max` (inclusive).
 * @param min
 * @param max
 */
export const charsRange = (min: number, max: number) => tString().where((s) => s.length >= min && s.length <= max, `expected a string of between ${min} and ${max} in length`);

const patterns = {
  urlHttp: /(https?):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/i
};

/**
 * Matches a string that matches the RegEx pattern `pattern`.
 * @param pattern
 */
export const matches = (pattern: RegExp) => tString().where((s) => pattern.test(s), `expected a string that match the pattern ${pattern.toString()}`);

/**
 * Matches a string containg a HTTP or HTTPS URL.
 */
export const urlHttp = tString().where((s) => patterns.urlHttp.test(s), `expected a http or https URL`);
