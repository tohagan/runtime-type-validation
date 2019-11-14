import * as Result from './result';
const isEqual = require('lodash.isequal'); // this syntax avoids TS1192

/**
 * Information describing how a type check failed.
 * Includes the input path (.at) and value showing
 * where and why and on what value it failed.
 */
export interface ValidatorError {
  kind: 'ValidatorError';
  input: unknown;
  at: string;
  message: string;
}

/**
 * Alias for the result of the `Validator.run` method. On success returns `Ok`
 * with the validated value of type `A`, on failure returns `Err` containing a
 * `ValidatorError`.
 */
type RunResult<A> = Result.Result<A, ValidatorError>;

/**
 * Alias for the result of the internal `Validator.validate` method. Since `validate`
 * is a private function it returns a partial validator error on failure, which
 * will be completed and polished when handed off to the `run` method.
 */
type ValidateResult<A> = Result.Result<A, Partial<ValidatorError>>;

/**
 * Defines a mapped type over an interface `A`. `ValidatorObject<A>` is an
 * interface that has all the keys or `A`, but each key's property type is
 * mapped to a validator for that type. This type is used when creating validators
 * for objects.
 *
 * Example:
 * ```
 * interface X {
 *   a: boolean;
 *   b: string;
 * }
 *
 * const validatorObject: ValidatorObject<X> = {
 *   a: tBoolean(),
 *   b: string()
 * }
 * ```
 */
export type ValidatorObject<A> = {[t in keyof A]: Validator<A[t]>};

/**
 * Type guard for `ValidatorError`. One use case of the type guard is in the
 * `catch` of a promise. Typescript types the error argument of `catch` as
 * `any`, so when dealing with a validator as a promise you may need to
 * distinguish between a `ValidatorError` and an error string.
 */
export const isValidatorError = (a: any): a is ValidatorError =>
  a.kind === 'ValidatorError' && typeof a.at === 'string' && typeof a.message === 'string';

/*
 * Helpers
 */
const isArray = (data: any): data is unknown[] => Array.isArray(data);

const isObject = (data: any): data is Record<string, unknown> =>
  typeof data === 'object' && data !== null && !isArray(data);

const typeString = (data: unknown): string => {
  const sType = typeof data;
  switch (sType) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'function':
    case 'symbol':
      return `a ${sType}`;
    case 'undefined':
      return 'undefined';
    case 'object':
      if (data instanceof Array) {
        return 'an array';
      } else if (data === null) {
        return 'null';
      } else {
        return 'an object';
      }
    default:
      return JSON.stringify(data);
  }
};

const expectedGot = (expected: string, got: unknown) =>
  `expected ${expected}, got ${typeString(got)}`;

const printPath = (paths: (string | number)[]): string =>
  paths.map(path => (typeof path === 'string' ? `.${path}` : `[${path}]`)).join('');

const prependAt = (newAt: string, {at, ...rest}: Partial<ValidatorError>): Partial<ValidatorError> => ({
  at: newAt + (at || ''),
  ...rest
});

/**
 * Validators transform data objects with unknown structure into known and
 * verified forms. You can create objects of type `Validator<A>` with either the
 * primitive validator functions, such as `tBoolean()` and `string()`, or by
 * applying higher-order validators to the primitives, such as `tArray(tBoolean())`
 * or `tDict(string())`.
 *
 * Each of the validator functions are available both as a static method on
 * `Validator` and as a function alias -- for example the string validator is
 * defined at `Validator.string()`, but is also aliased to `string()`. Using the
 * function aliases exported with the library is recommended.
 *
 * `Validator` exposes a number of 'run' methods, which all validate data in the
 * same way, but communicate success and failure in different ways. The `map`
 * and `andThen` methods modify validators without having to call a 'run' method.
 *
 * Alternatively, the main validator `run()` method returns an object of type
 * `Result<A, ValidatorError>`. This library provides a number of helper
 * functions for dealing with the `Result` type, so you can do all the same
 * things with a `Result` as with the validator methods.
 */
export class Validator<A> {
  /**
   * The Validator class constructor is kept private to separate the internal
   * `validate` function from the external `run` function. The distinction
   * between the two functions is that `validate` returns a
   * `Partial<ValidatorError>` on failure, which contains an unfinished error
   * report. When `run` is called on a validator, the relevant series of `validate`
   * calls is made, and then on failure the resulting `Partial<ValidatorError>`
   * is turned into a `ValidatorError` by filling in the missing information.
   *
   * While hiding the constructor may seem restrictive, leveraging the
   * provided validator combinators and helper functions such as
   * `andThen` and `map` should be enough to build specialized validators as
   * needed.
   */
  private constructor(private validate: (data: unknown) => ValidateResult<A>) {}

  /**
   * Validator primitive that validates strings, and fails on all other input.
   */
  static tString(): Validator<string> {
    return new Validator<string>(
      (data: unknown) =>
        typeof data === 'string'
          ? Result.ok(data)
          : Result.err({message: expectedGot('a string', data)})
    );
  }

  /**
   * Validator primitive that validates numbers, and fails on all other input.
   */
  static tNumber(): Validator<number> {
    return new Validator<number>(
      (data: unknown) =>
        typeof data === 'number'
          ? Result.ok(data)
          : Result.err({message: expectedGot('a number', data)})
    );
  }

  /**
   * Validator primitive that validates booleans, and fails on all other input.
   */
  static tBoolean(): Validator<boolean> {
    return new Validator<boolean>(
      (data: unknown) =>
        typeof data === 'boolean'
          ? Result.ok(data)
          : Result.err({message: expectedGot('a boolean', data)})
    );
  }

  /**
   * Escape hatch to bypass validation. Always succeeds and types the result as
   * `any`. Useful for defining validators incrementally, particularly for
   * complex objects.
   *
   * Example:
   * ```
   * interface User {
   *   name: string;
   *   complexUserData: ComplexType;
   * }
   *
   * const userValidator: Validator<User> = tObject({
   *   name: tString(),
   *   complexUserData: tAny()
   * });
   * ```
   */
  static tAny = (): Validator<any> => new Validator<any>((data: any) => Result.ok(data));

  /**
   * Validator identity function which always succeeds and types the result as
   * `unknown`.
   */
  static tUnknown = (): Validator<unknown> =>
    new Validator<unknown>((data: unknown) => Result.ok(data));

  /**
   * Validator primitive that only matches on exact values.
   *
   * For primitive values and shallow structures of primitive values `constant`
   * will infer an exact literal type:
   * ```
   *  | Validator                      | Type                          |
   *  | ---------------------------- | ------------------------------|
   *  | constant(true)               | Validator<true>                 |
   *  | constant(false)              | Validator<false>                |
   *  | constant(null)               | Validator<null>                 |
   *  | constant(undefined)          | Validator<undefined>            |
   *  | constant('alaska')           | Validator<'alaska'>             |
   *  | constant(50)                 | Validator<50>                   |
   *  | constant([1,2,3])            | Validator<[1,2,3]>              |
   *  | constant({x: 't'})           | Validator<{x: 't'}>             |
   * ```
   *
   * Inference breaks on nested structures, which require an annotation to get
   * the literal type:
   * ```
   *  | Validator                      | Type                          |
   *  | -----------------------------|-------------------------------|
   *  | constant([1,[2]])            | Validator<(number|number[])[]>  |
   *  | constant<[1,[2]]>([1,[2]])   | Validator<[1,[2]]>              |
   *  | constant({x: [1]})           | Validator<{x: number[]}>        |
   *  | constant<{x: [1]}>({x: [1]}) | Validator<{x: [1]}>             |
   * ```
   */
  static constant<T extends string | number | boolean | []>(value: T): Validator<T>;
  static constant<T extends string | number | boolean, U extends [T, ...T[]]>(value: U): Validator<U>;
  static constant<T extends string | number | boolean, U extends Record<string, T>>(value: U): Validator<U>;
  static constant<T>(value: T): Validator<T>;
  static constant(value: any) {
    return new Validator(
      (data: unknown) =>
        isEqual(data, value)
          ? Result.ok(value)
          : Result.err({message: `expected ${JSON.stringify(value)}, got ${JSON.stringify(data)}`})
    );
  }

  /**
   * An higher-order validator that runs validators on specified fields of an object,
   * and returns a new object with those fields. If `object` is called with no
   * arguments, then the outer object part of the data is validated but not the
   * contents, typing the result as a record where all keys have a value of
   * type `unknown`.
   *
   * The `optional` and `constant` validators are particularly useful for decoding
   * objects that match typescript interfaces.
   *
   * To validate a single field that is inside of an object see `valueAt`.
   *
   * Example:
   * ```
   * tObject({x: tNumber(), y: tNumber()}).run({x: 5, y: 10})
   * // => {ok: true, result: {x: 5, y: 10}}
   *
   * tObject().map(Object.keys).run({n: 1, i: [], c: {}, e: 'e'})
   * // => {ok: true, result: ['n', 'i', 'c', 'e']}
   * ```
   */
  static tObject(): Validator<Record<string, unknown>>;
  static tObject<A>(validators: ValidatorObject<A>): Validator<A>;
  static tObject<A>(validators?: ValidatorObject<A>): Validator<A> {
    return new Validator((data: unknown) => {
      if (!isObject(data)) return Result.err({message: expectedGot('an object', data)});
      if (!validators) return Result.ok(data);
      let result: any = {};
      for (const key in validators) {
        if (validators.hasOwnProperty(key)) {
          const r = validators[key].validate(data[key]);
          if (r.ok === true) {
            // tslint:disable-next-line:strict-type-predicates
            if (r.result !== undefined) {
              result[key] = r.result;
            }
          } else if (data[key] === undefined) {
            return Result.err({message: `the key '${key}' is required but was not present`});
          } else {
            return Result.err(prependAt(`.${key}`, r.error));
          }
        }
      }
      return Result.ok(result);
    });
  }

  /**
   * Same as tObject but will return an error if input field names are added
   * beyond those defined by the run-time type (interface).
   *
   * Example:
   * ```
   * tObject({x: tNumber(), y: tNumber()}).run({x: 5, y: 10})
   * // => {ok: true, result: {x: 5, y: 10}}
   *
   * tObject().map(Object.keys).run({n: 1, i: [], c: {}, e: 'e'})
   * // => {ok: true, result: ['n', 'i', 'c', 'e']}
   * ```
   */
  static tObjectStrict(): Validator<Record<string, unknown>>;
  static tObjectStrict<A>(validators: ValidatorObject<A>): Validator<A>;
  static tObjectStrict<A>(validators?: ValidatorObject<A>): Validator<A> {
    return new Validator((data: unknown) => {
      if (!isObject(data)) return Result.err({message: expectedGot('an object', data)});
      if (!validators) return Result.ok(data);
      let result: any = {};
      for (const key in validators) {
        if (validators.hasOwnProperty(key)) {
          const r = validators[key].validate(data[key]);
          if (r.ok === true) {
            // tslint:disable-next-line:strict-type-predicates
            if (r.result !== undefined) {
              result[key] = r.result;
            }
          } else if (data[key] === undefined) {
            return Result.err({message: `the key '${key}' is required but was not present`});
          } else {
            return Result.err(prependAt(`.${key}`, r.error));
          }
        }
      }
      for (const key in data) {
        if (!validators.hasOwnProperty(key)) {
          return Result.err({message: `an undefined key '${key}' is present in the object`});
        }
      }
      return Result.ok(result);
    });
  }

  /**
   * Validator for data arrays. Runs `validator` on each array element, and succeeds
   * if all elements are successfully validated. If no `validator` argument is
   * provided then the outer array part of the data is validated but not the
   * contents, typing the result as `unknown[]`.
   *
   * To validate a single value that is inside of an array see `valueAt`.
   *
   * Examples:
   * ```
   * tArray(tNumber()).run([1, 2, 3])
   * // => {ok: true, result: [1, 2, 3]}
   *
   * tArray(tArray(tBoolean())).run([[true], [], [true, false, false]])
   * // => {ok: true, result: [[true], [], [true, false, false]]}
   *
   *
   * const validNumbersValidator = tArray()
   *   .map((arr: unknown[]) => arr.map(tNumber().run))
   *   .map(Result.successes)
   *
   * validNumbersValidator.run([1, true, 2, 3, 'five', 4, []])
   * // {ok: true, result: [1, 2, 3, 4]}
   *
   * validNumbersValidator.run([false, 'hi', {}])
   * // {ok: true, result: []}
   *
   * validNumbersValidator.run(false)
   * // {ok: false, error: {..., message: "expected an array, got a boolean"}}
   * ```
   */
  static tArray(): Validator<unknown[]>;
  static tArray<A>(validator: Validator<A>): Validator<A[]>;
  static tArray<A>(validator?: Validator<A>) {
    return new Validator(data => {
      if (isArray(data) && validator) {
        const validateValue = (v: unknown, i: number): ValidateResult<A> =>
          Result.mapError(err => prependAt(`[${i}]`, err), validator.validate(v));

        return data.reduce(
          (acc: ValidateResult<A[]>, v: unknown, i: number) =>
            Result.map2((arr, result) => [...arr, result], acc, validateValue(v, i)),
          Result.ok([])
        );
      } else if (isArray(data)) {
        return Result.ok(data);
      } else {
        return Result.err({message: expectedGot('an array', data)});
      }
    });
  }

  /**
   * Validator for fixed-length arrays, aka Tuples.
   *
   * Supports up to 8-tuples.
   *
   * Example:
   * ```
   * tuple([tNumber(), tNumber(), string()]).run([5, 10, 'px'])
   * // => {ok: true, result: [5, 10, 'px']}
   * ```
   */
  static tuple<A>(validator: [Validator<A>]): Validator<[A]>;
  static tuple<A, B>(validator: [Validator<A>, Validator<B>]): Validator<[A, B]>;
  static tuple<A, B, C>(validator: [Validator<A>, Validator<B>, Validator<C>]): Validator<[A, B, C]>;
  static tuple<A, B, C, D>(validator: [Validator<A>, Validator<B>, Validator<C>, Validator<D>]): Validator<[A, B, C, D]>; // prettier-ignore
  static tuple<A, B, C, D, E>(validator: [Validator<A>, Validator<B>, Validator<C>, Validator<D>, Validator<E>]): Validator<[A, B, C, D, E]>; // prettier-ignore
  static tuple<A, B, C, D, E, F>(validator: [Validator<A>, Validator<B>, Validator<C>, Validator<D>, Validator<E>, Validator<F>]): Validator<[A, B, C, D, E, F]>; // prettier-ignore
  static tuple<A, B, C, D, E, F, G>(validator: [Validator<A>, Validator<B>, Validator<C>, Validator<D>, Validator<E>, Validator<F>, Validator<G>]): Validator<[A, B, C, D, E, F, G]>; // prettier-ignore
  static tuple<A, B, C, D, E, F, G, H>(validator: [Validator<A>, Validator<B>, Validator<C>, Validator<D>, Validator<E>, Validator<F>, Validator<G>, Validator<H>]): Validator<[A, B, C, D, E, F, G, H]>; // prettier-ignore
  static tuple<A>(validators: Validator<A>[]) {
    return new Validator((data: unknown) => {
      if (isArray(data)) {
        if (data.length !== validators.length) {
          return Result.err({
            message: `expected a tuple of length ${validators.length}, got one of length ${
              data.length
            }`
          });
        }
        const result = [];
        for (let i: number = 0; i < validators.length; i++) {
          const nth = validators[i].validate(data[i]);
          if (nth.ok) {
            result[i] = nth.result;
          } else {
            return Result.err(prependAt(`[${i}]`, nth.error));
          }
        }
        return Result.ok(result);
      } else {
        return Result.err({message: expectedGot(`a tuple of length ${validators.length}`, data)});
      }
    });
  }

  /**
   * Validator for data objects where the keys are unknown strings, but the values
   * should all be of the same type.
   *
   * Example:
   * ```
   * tDict(tNumber()).run({chocolate: 12, vanilla: 10, mint: 37});
   * // => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
   * ```
   */
  static tDict = <A>(validator: Validator<A>): Validator<Record<string, A>> =>
    new Validator(data => {
      if (isObject(data)) {
        let obj: Record<string, A> = {};
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const r = validator.validate(data[key]);
            if (r.ok === true) {
              obj[key] = r.result;
            } else {
              return Result.err(prependAt(`.${key}`, r.error));
            }
          }
        }
        return Result.ok(obj);
      } else {
        return Result.err({message: expectedGot('an object', data)});
      }
    });

  /**
   * Validator for values that may be `undefined`. This is primarily helpful for
   * decoding interfaces with optional fields.
   *
   * Example:
   * ```
   * interface User {
   *   id: number;
   *   isOwner?: boolean;
   * }
   *
   * const validator: Validator<User> = tObject({
   *   id: tNumber(),
   *   isOwner: optional(tBoolean())
   * });
   * ```
   */
  static optional = <A>(validator: Validator<A>): Validator<undefined | A> =>
    new Validator<undefined | A>(
      (data: unknown) => (data === undefined ? Result.ok(undefined) : validator.validate(data))
    );

  /**
   * Validator that attempts to run each validator in `validators` and either succeeds
   * with the first successful validator, or fails after all validators have failed.
   *
   * Note that `oneOf` expects the validators to all have the same return type,
   * while `union` creates a validator for the union type of all the input
   * validators.
   *
   * Examples:
   * ```
   * oneOf(string(), tNumber().map(String))
   * oneOf(constant('start'), constant('stop'), succeed('unknown'))
   * ```
   */
  static oneOf = <A>(...validators: Validator<A>[]): Validator<A> =>
    new Validator<A>((data: unknown) => {
      const errors: Partial<ValidatorError>[] = [];
      for (let i: number = 0; i < validators.length; i++) {
        const r = validators[i].validate(data);
        if (r.ok === true) {
          return r;
        } else {
          errors[i] = r.error;
        }
      }
      const errorsList = errors
        .map(error => `at error${error.at || ''}: ${error.message}`)
        .join('", "');
      return Result.err({
        message: `expected a value matching one of the validators, got the errors ["${errorsList}"]`
      });
    });

  /**
   * Combines 2-8 validators of disparate types into a validator for the union of all
   * the types.
   *
   * If you need more than 8 variants for your union, it's possible to use
   * `oneOf` in place of `union` as long as you annotate every validator with the
   * union type.
   *
   * Example:
   * ```
   * type C = {a: string} | {b: number};
   *
   * const unionValidator: Validator<C> = union(tObject({a: string()}), tObject({b: tNumber()}));
   * const oneOfValidator: Validator<C> = oneOf(tObject<C>({a: string()}), tObject<C>({b: tNumber()}));
   * ```
   */
  static union <A, B>(ad: Validator<A>, bd: Validator<B>): Validator<A | B>; // prettier-ignore
  static union <A, B, C>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>): Validator<A | B | C>; // prettier-ignore
  static union <A, B, C, D>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>): Validator<A | B | C | D>; // prettier-ignore
  static union <A, B, C, D, E>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>): Validator<A | B | C | D | E>; // prettier-ignore
  static union <A, B, C, D, E, F>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>, fd: Validator<F>): Validator<A | B | C | D | E | F>; // prettier-ignore
  static union <A, B, C, D, E, F, G>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>, fd: Validator<F>, gd: Validator<G>): Validator<A | B | C | D | E | F | G>; // prettier-ignore
  static union <A, B, C, D, E, F, G, H>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>, fd: Validator<F>, gd: Validator<G>, hd: Validator<H>): Validator<A | B | C | D | E | F | G | H>; // prettier-ignore
  static union(ad: Validator<any>, bd: Validator<any>, ...validators: Validator<any>[]): Validator<any> {
    return Validator.oneOf(ad, bd, ...validators);
  }

  /**
   * Combines 2-8 object validators into a validator for the intersection of all the objects.
   *
   * Example:
   * ```
   * interface Pet {
   *   name: string;
   *   maxLegs: number;
   * }
   *
   * interface Cat extends Pet {
   *   evil: boolean;
   * }
   *
   * const petValidator: Validator<Pet> = tObject({name: string(), maxLegs: tNumber()});
   * const catValidator: Validator<Cat> = intersection(petValidator, tObject({evil: tBoolean()}));
   * ```
   */
  static intersection <A, B>(ad: Validator<A>, bd: Validator<B>): Validator<A & B>; // prettier-ignore
  static intersection <A, B, C>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>): Validator<A & B & C>; // prettier-ignore
  static intersection <A, B, C, D>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>): Validator<A & B & C & D>; // prettier-ignore
  static intersection <A, B, C, D, E>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>): Validator<A & B & C & D & E>; // prettier-ignore
  static intersection <A, B, C, D, E, F>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>, fd: Validator<F>): Validator<A & B & C & D & E & F>; // prettier-ignore
  static intersection <A, B, C, D, E, F, G>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>, fd: Validator<F>, gd: Validator<G>): Validator<A & B & C & D & E & F & G>; // prettier-ignore
  static intersection <A, B, C, D, E, F, G, H>(ad: Validator<A>, bd: Validator<B>, cd: Validator<C>, dd: Validator<D>, ed: Validator<E>, fd: Validator<F>, gd: Validator<G>, hd: Validator<H>): Validator<A & B & C & D & E & F & G & H>; // prettier-ignore
  static intersection(ad: Validator<any>, bd: Validator<any>, ...ds: Validator<any>[]): Validator<any> {
    return new Validator((data: unknown) =>
      [ad, bd, ...ds].reduce(
        (acc: ValidateResult<any>, validator) => Result.map2(Object.assign, acc, validator.validate(data)),
        Result.ok({})
      )
    );
  }

  /**
   * Validator that always succeeds with either the validated value, or a fallback
   * default value.
   */
  static withDefault = <A>(defaultValue: A, validator: Validator<A>): Validator<A> =>
    new Validator<A>((data: unknown) =>
      Result.ok(Result.withDefault(defaultValue, validator.validate(data)))
    );

  /**
   * Validator that pulls a specific field out of a data structure, instead of
   * decoding and returning the full structure. The `paths` array describes the
   * object keys and array indices to traverse, so that values can be pulled out
   * of a nested structure.
   *
   * Example:
   * ```
   * const validator = valueAt(['a', 'b', 0], string());
   *
   * validator.run({a: {b: ['surprise!']}})
   * // => {ok: true, result: 'surprise!'}
   *
   * validator.run({a: {x: 'cats'}})
   * // => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
   * ```
   *
   * Note that the `validator` is ran on the value found at the last key in the
   * path, even if the last key is not found. This allows the `optional`
   * validator to succeed when appropriate.
   * ```
   * const optionalValidator = valueAt(['a', 'b', 'c'], optional(string()));
   *
   * optionalValidator.run({a: {b: {c: 'surprise!'}}})
   * // => {ok: true, result: 'surprise!'}
   *
   * optionalValidator.run({a: {b: 'cats'}})
   * // => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}
   *
   * optionalValidator.run({a: {b: {z: 1}}})
   * // => {ok: true, result: undefined}
   * ```
   */
  static valueAt = <A>(paths: (string | number)[], validator: Validator<A>): Validator<A> =>
    new Validator<A>((data: unknown) => {
      let dataAtPath: any = data;
      for (let i: number = 0; i < paths.length; i++) {
        if (dataAtPath === undefined) {
          return Result.err({
            at: printPath(paths.slice(0, i + 1)),
            message: 'path does not exist'
          });
        } else if (typeof paths[i] === 'string' && !isObject(dataAtPath)) {
          return Result.err({
            at: printPath(paths.slice(0, i + 1)),
            message: expectedGot('an object', dataAtPath)
          });
        } else if (typeof paths[i] === 'number' && !isArray(dataAtPath)) {
          return Result.err({
            at: printPath(paths.slice(0, i + 1)),
            message: expectedGot('an array', dataAtPath)
          });
        } else {
          dataAtPath = dataAtPath[paths[i]];
        }
      }
      return Result.mapError(
        error =>
          dataAtPath === undefined
            ? {at: printPath(paths), message: 'path does not exist'}
            : prependAt(printPath(paths), error),
        validator.validate(dataAtPath)
      );
    });

  /**
   * Validator that ignores the input data and always succeeds with `fixedValue`.
   */
  static succeed = <A>(fixedValue: A): Validator<A> =>
    new Validator<A>((data: unknown) => Result.ok(fixedValue));

  /**
   * Validator that ignores the input data and always fails with `errorMessage`.
   */
  static fail = <A>(errorMessage: string): Validator<A> =>
    new Validator<A>((data: unknown) => Result.err({message: errorMessage}));

  /**
   * Validator that allows for validating recursive data structures. Unlike with
   * functions, validators assigned to variables can't reference themselves
   * before they are fully defined. We can avoid prematurely referencing the
   * validator by wrapping it in a function that won't be called until use, at
   * which point the validator has been defined.
   *
   * Example:
   * ```
   * interface Comment {
   *   msg: string;
   *   replies: Comment[];
   * }
   *
   * const validator: Validator<Comment> = tObject({
   *   msg: string(),
   *   replies: lazy(() => tArray(validator))
   * });
   * ```
   */
  static lazy = <A>(mkValidator: () => Validator<A>): Validator<A> =>
    new Validator((data: unknown) => mkValidator().validate(data));

  /**
   * Run the validator and return a `Result` with either the validated value or a
   * `ValidatorError` containing the data input, the location of the error, and
   * the error message.
   *
   * Examples:
   * ```
   * tNumber().run(12)
   * // => {ok: true, result: 12}
   *
   * string().run(9001)
   * // =>
   * // {
   * //   ok: false,
   * //   error: {
   * //     kind: 'ValidatorError',
   * //     input: 9001,
   * //     at: 'input',
   * //     message: 'expected a string, got 9001'
   * //   }
   * // }
   * ```
   */
  run = (data: unknown): RunResult<A> =>
    Result.mapError(
      error => ({
        kind: 'ValidatorError' as 'ValidatorError',
        input: data,
        at: 'input' + (error.at || ''),
        message: error.message || ''
      }),
      this.validate(data)
    );

  /**
   * Run the validator as a `Promise`.
   */
  runPromise = (data: unknown): Promise<A> => Result.asPromise(this.run(data));

  /**
   * Run the validator and return the value on success, or throw an exception
   * with a formatted error string.
   */
  runWithException = (data: unknown): A => Result.withException(this.run(data));

  /**
   * Construct a new validator that applies a transformation to the validated
   * result. If the validator succeeds then `f` will be applied to the value. If
   * it fails the error will propagated through.
   *
   * Example:
   * ```
   * tNumber().map(x => x * 5).run(10)
   * // => {ok: true, result: 50}
   * ```
   */
  map = <B>(f: (value: A) => B): Validator<B> =>
    new Validator<B>((data: unknown) => Result.map(f, this.validate(data)));

  /**
   * Chain together a sequence of validators. The first validator will run, and
   * then the function will determine what validator to run second. If the result
   * of the first validator succeeds then `f` will be applied to the validated
   * value. If it fails the error will propagate through.
   *
   * This is a very powerful method -- it can act as both the `map` and `where`
   * methods, can improve error messages for edge cases, and can be used to
   * make a validator for custom types.
   *
   * Example of adding an error message:
   * ```
   * const versionValidator = valueAt(['version'], tNumber());
   * const infoValidator3 = tObject({a: tBoolean()});
   *
   * const validator = versionValidator.andThen(version => {
   *   switch (version) {
   *     case 3:
   *       return infoValidator3;
   *     default:
   *       return fail(`Unable to validate info, version ${version} is not supported.`);
   *   }
   * });
   *
   * validator.run({version: 3, a: true})
   * // => {ok: true, result: {a: true}}
   *
   * validator.run({version: 5, x: 'abc'})
   * // =>
   * // {
   * //   ok: false,
   * //   error: {... message: 'Unable to validate info, version 5 is not supported.'}
   * // }
   * ```
   *
   * Example of decoding a custom type:
   * ```
   * // nominal type for arrays with a length of at least one
   * type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };
   *
   * const nonEmptyArrayValidator = <T>(values: Validator<T>): Validator<NonEmptyArray<T>> =>
   *   tArray(values).andThen(arr =>
   *     arr.length > 0
   *       ? succeed(createNonEmptyArray(arr))
   *       : fail(`expected a non-empty array, got an empty array`)
   *   );
   * ```
   */
  andThen = <B>(f: (value: A) => Validator<B>): Validator<B> =>
    new Validator<B>((data: unknown) =>
      Result.andThen(value => f(value).validate(data), this.validate(data))
    );

  /**
   * Add constraints to a validator _without_ changing the resulting type. The
   * `test` argument is a predicate function which returns true for valid
   * inputs. When `test` fails on an input, the validator fails with the given
   * `errorMessage`.
   *
   * ```
   * const chars = (length: number): Validator<string> =>
   *   string().where(
   *     (s: string) => s.length === length,
   *     `expected a string of length ${length}`
   *   );
   *
   * chars(5).run('12345')
   * // => {ok: true, result: '12345'}
   *
   * chars(2).run('HELLO')
   * // => {ok: false, error: {... message: 'expected a string of length 2'}}
   *
   * chars(12).run(true)
   * // => {ok: false, error: {... message: 'expected a string, got a boolean'}}
   * ```
   */
  where = (test: (value: A) => boolean, errorMessage: string): Validator<A> =>
    this.andThen((value: A) => (test(value) ? Validator.succeed(value) : Validator.fail(errorMessage)));
}
