import { Validator } from './validator';
import { union, constant, tNumber, tString, tAny } from './index';

/**
 * Allow null or the type checked value.
 * @param validator
 */
export function nullable<A>(validator: Validator<A>): Validator<A | null> {
  return union(validator, constant(null));
}

/**
 * Matches any truthy value
 */
export function truthy() { return tAny().where(val => !!val, `expected value to be truthy`); }

/**
 * Matches any falsy value.
 */
export function falsy() { return tAny().where(val => !val, `expected value to be falsy`); }

/**
 * Matches a number between `min` .. `max` (inclusive).
 * @param min
 * @param max
 */
export function range(min: number, max: number) {
  return tNumber().where(n => n >= min && n <= max, `expected a number between ${min} and ${max}`);
}

/**
 * Matches a string having exactly `length` characters.
 * @param length
 */
export function chars (length: number) {
  return tString().where((s) => s.length === length, `expected a string of length ${length}`);
}

/**
 * Matches a string having a minimum of `min` characters.
 * @param min
 */
export function charsMin(min: number) {
  return tString().where((s) => s.length >= min, `expected a string of minimum length ${min}`);
}

/**
 * Matches a string having a maximum of `max` characters.
 * @param max
 */
export function charsMax(max: number) {
  return tString().where((s) => s.length <= max, `expected a string of maximum length ${max}`);
}

/**
 * Matches a string having a `length` between `min` .. `max` (inclusive).
 * @param min
 * @param max
 */
export function charsRange(min: number, max: number) {
  return tString().where((s) => s.length >= min && s.length <= max, `expected a string of between ${min} and ${max} in length`);
}


/**
 * Matches a string that matches the RegEx pattern `pattern`.
 * @param pattern
 */
export function matches(pattern: RegExp) {
  return tString().where((s) => pattern.test(s), `expected a string that matches ${pattern.toString()}`);
}

const patterns = {
  // @imme_emosol from https://mathiasbynens.be/demo/url-regex
  httpUrl: /(https?):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/i
};

/**
 * Matches a string containg a HTTP or HTTPS URL.
 */
export function httpUrl() {
  return tString().where((s) => patterns.httpUrl.test(s), `expected a valid http or https URL`);
}
