import { Decoder } from './decoder';
import { union, constant, oneOf, tNumber, tString } from './combinators';

export function tNullable<A>(decoder: Decoder<A>): Decoder<A | null> {
  return union(decoder, constant(null));
}

export function tEnum<T extends string | number>(...values: T[]): Decoder<T> {
  const decoders: Decoder<T>[] = values.map(v => constant(v));
  return oneOf(...decoders);
};

export const range = (min: number, max: number) => tNumber().where(n => n >= min && n <= max, `expected a number between ${min} and ${max}`);

export const chars = (length: number) => tString().where((s) => s.length === length, `expected a string of length ${length}`);
export const charsMin = (min: number) => tString().where((s) => s.length >= min, `expected a string of minimum length ${min}`);
export const charsMax = (max: number) => tString().where((s) => s.length <= max, `expected a string of maximum length ${max}`);
export const charsRange = (min: number, max: number) => tString().where((s) => s.length >= min && s.length <= max, `expected a string of between ${min} and ${max} in length`);

const patterns = {
  url: /(https?):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/i
};

export const matches = (pattern: RegExp) => tString().where((s) => pattern.test(s), `expected a string that match the pattern ${pattern.toString()}`);
export const url = tString().where((s) => patterns.url.test(s), `expected a URL`);
