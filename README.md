[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![npm version](http://img.shields.io/npm/v/runtime-validator.svg?style=flat)](https://npmjs.org/package/runtime-validator "View this project on npm")
[![Build Status](https://travis-ci.org/tohagan/runtime-validator.svg?branch=master)](https://travis-ci.org/tohagan/runtime-validator)
[![Coverage Status](https://coveralls.io/repos/github/tohagan/runtime-validator/badge.svg)](https://coveralls.io/github/tohagan/runtime-validator)

# Runtime type checking & validation

A **light weight** library to perform run-time type checking and field validation for TypeScript and JavaScript.


## Features

- Easy to learn and read. Simple and fast to extend.
- Small lib. Optimised for [tree shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking).
- Use with either [TypeScript](https://www.typescriptlang.org/) OR [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- Detailed error reporting.
- Creates `Validator` objects that are **concise** and **composable**.
  - Type check against **compile-time** types and interfaces.
  - Validate both **run-time** types and field **value constraints**.
  - Advanced: Apply transforms, data version upgrades ... to all or parts of your data.
- Emit the validation as:
  - A value result OR An exception
  - A Promise result
  - A success/fail boolean result (logs errors).
  - Create your own!

## Applications

- Validate function call arguments
- Unit test assertions
- Validate client or server side request/response payloads.
  - Can either filter out (`tObject`) or prevent (`tObjectStrict`) undefined fields.
- Validate component properties (Vue)
- Create a TypeScript [Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)

Within an application, build a local library of composable validators that
consistently check the types and values of all internal and external data structures.

## Installation

```
npm i runtime-validator
```
OR
```
yarn add runtime-validator
```

Projects using `< typescript@3.0.1` will need a polyfill for the `unknown`
type, such as [unknown-ts](https://www.npmjs.com/package/unknown-ts).

## Examples

### Typescript Example #1 - Runtime type checking

TypeScript only checks types at compile time not at run-time.
The TypeScript project have excluded this from their stated
[goals](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals#non-goals),

[Type guards](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html)
work, but are limited in that they circumvent type inference instead of working
with it, and can be cumbersome to write.

```typescript

import {
  Validator, tObject, tString, tNumber, tBoolean, optional
} from 'runtime-validator'

interface Pet {
  name: string;
  species: string;
  age?: number;
  isCute?: boolean;
}

const petValidator: Validator<Pet> = tObject({
  name: tString(),
  species: tString(),
  age: optional(tNumber()),
  isCute: optional(tBoolean())
})

// Since `JSON.parse()` returns `any` we need to type check the result at run-time.
const json: any = JSON.parse('{"name":"Lyle", "age":15, "isCute":true}');

// Returns value if valid, throws exception if invalid
// Exeception example
// `Input: {"name":"Lyle","age":15}
// Failed at input: the key 'species' is required but was not present`
const pet: Pet = petValidator.asException(json);

// resolve() if valid, reject() if invalid
const petPromise: Promse<Pet> = petValidator.asPromise(json);

// true if valid, false if invalid and logs error.
const isValid: boolean = petValidator.asSuccess(json);
```

### JavaScript Example #2 - VueJS Object Field Validation

[VueJS](https://vuejs.org) supports custom validation of [component properties](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) via a `validator` field defined on the property.  The `asSuccess` modifier matches the call signature so we can use it to validate a Pet property on a component:

```javascript
import {
  tObject, tString, tNumber, tBoolean, optional
} from 'runtime-validator'

// VueJs component
export default {
  name: 'MyPet',
  props: {
    pet: {
      type: Object,
      required: true,
      validator: tObject({
        name: tString(),
        species: tString(),
        age: optional(tNumber()),
        isCute: optional(tBoolean())
      }).asSuccess
    }
  },
  ...
}
```

### Example #3: Data Validation

- `oneOf()` acts like an enum that restricts a field to limited set of value of equal type.
- `Validator.where()` can specify custom data validation conditions.

```typescript
const range = (min: number, max: number) =>
  tNumber().where(
    n => n >= min && n <= max,
    `expected a number between ${min} and ${max}`
  );

const species = oneOf("dog", "cat", "bird", "snake");

const petValidator = tObject({
  name: tString(),
  species,
  age: optional(range(0, 100)),
  isCute: optional(tBoolean())
});
```

## Documentation

This library uses the [combinator pattern](https://wiki.haskell.org/Combinator_pattern) from functional programming to build a `Validator`.

Validators can transform data objects with unknown structure into known and verified type and values.

**Abbreviations**:

- `v` = a `Validator` instance.
- `v1` ... `vN` is a `Validator` sequence (array or argument list).
- `value` = a constant or a value being validated.

**Full API**:

- [Index](./docs/modules/_index_.md).
- [Validator classes](./docs/modules/_validator_.md).
- [Result class](./docs/modules/_result_.md).
- [Constraints](./docs/modules/_constraints_.md).

### Primitive validators

Primitive validators check a single value matches a primitive type.

When executed they return a validation result (value or error)
where the value will match the original primitive type.

Primitive      | Description           | Return Type           |
-------------- | --------------------- | --------------------- |
`tString()`    | Matches a `string`    | `Validator<string>`   |
`tNumber()`    | Matches a `number`    | `Validator<number>`   |
`tBoolean()`   | Matches a `boolean`   | `Validator<boolean>`  |
`tFunction()`  | Matches a `function`  | `Validator<function>` |
`tUndefined()` | Matches a `undefined` | `Validator<any>`      |
`tAny()`       | Matches any type.     | `Validator<any>`      |
`tUnknown()`   | Matches any type.     | `Validator<unknown>`  |

### Modifiers

Modifiers adapt a value or validator to match/ignore or allow nullable/optional values.

Modifiers              | Description             |
---------------------- | ----------------------- |
`constant(value)`      | Matches a constant string, number or boolean `value`  |
`nullable(v)`          | Matches `null` or a value matching `v` |
`optional(v)`          | Matches `undefined` or a value matching `v` |
`succeed(value)`       | Ignores input and always returns `value`.  |
`fails(error)`         | Ignores input and always fails with the `error`.  |
`valueAt(path, value)` | Returns a specific field from within the `value` data structure.  |

### Combinators

Combinators combine or wrapper validators to validate a complex type.

Combinator                 | Description             |
-------------------------- | ----------------------- |
`tArray(v)`                | Matches an `array` containing elements that *all* match validator `v` |
`tDict(v)`                 | Matches a dictionary having `strings` as keys and values that *all* match `v` |
`tuple([v1, ... vN])`      | Matches an `array` containing elements that match validators `v1` ... `vN` in sequence |
`oneOf(v1, ... vN)`        | Matches *one of* the validators `v1` .. `vN` which must all return the same type.  |
`union(v1, ... vN)`        | Matches *one of* the validators `v1` .. `vN`. Return type is a union of return types. |
`intersection(v1, ... vN)` | Matches *all of* the validators `v1` .. `vN`. Return type is the intersection of return types.  |
`withDefault(value, v)`    | If `v` fails to match input, return a default `value`. |
`lazy(v)`                  | Supports validation of recursive types. See example below.  |

**Example**: Use `lazy(v)` to validate a recursive type:

```typescript
const validator: Validator<Comment> = tObject({
  msg: tString(),
  replies: lazy(() => tArray(validator)) // self reference
});
```

### Constraints

Constraints are just wrapper validators to add additional value conditions.
Internally they use the `Validator.where()` method to add these constraints.

These are just a few common examples we've included in the library.
You'll likely want to create your own, so check out `src/constraints.ts` for ideas.

Constraints            | Description             |
---------------------- | ----------------------- |
`truth()`              | Matches `any` [truthy value](https://www.sitepoint.com/javascript-truthy-falsy/) |
`falsy()`              | Matches `any` [falsy value](https://www.sitepoint.com/javascript-truthy-falsy/) |
`range(min, max)`      | Matches a `number` value between `min` and `max` |
`chars(n)`             | Matches a `string` of length `n` |
`charsMin(min)`        | Matches a `string` of at least `min` characters |
`charsMax(max)`        | Matches a `string` of no more than `max` characters |
`charsRange(min, max)` | Matches a `string` of between `min` and `max` characters |
`matches(pattern)`     | Matches a `string` that matches the `pattern` |
`httpUrl()`            | Matches a HTTP or HTTPS URL |

### Validation Execution

The following functions execute the `validator` to check if a `value` is valid.
They then return the validation result for use in different programming contexts.
`v.asException()`, `v.asPromise()`, `v.asSuccess()` each adapt the output from `v.check()`.
So if you need a validator with a different behaviour or call signature follow the
same coding pattern and write your own!

`v.asSuccess` is useful in a Vue property validator (see example) or in a [TypeScript Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards).

Execute Validation          | Description             |
--------------------------- | ----------------------- |
`v.asException(value)`      | Returns validated `value`. Throws an exception if invalid. |
`v.asPromise(value)`        | Returns a `Promise` that is resolved to the validated `value` or rejected with the error.     |
`v.asSuccess(value,logger)` | If valid returns `true`, if invalid returns `false` and logs error.  `logger` defaults to `console.error` |
`v.check(value)`            | Returns a `CheckResult`. Use to create a custom `asXXX()`. |

### Validation Adaptors

Adaptors can transform a `Validator` to into a new `Validator` that when executed will adapt the validation [Result](./docs/modules/_result_.md).
See the documentation on these methods in [Validator classes](./docs/modules/_validator_.md) for examples.

Adaptors                     | Description             |
--------------------------   | ----------------------- |
`v.where(f(value),error)`    | If `f(value)` is false, emits `error`. Used to create Constraints. |
`v.map(value => f(value))`   | Transforms a validated value to a new value. |
`v1.andThen(f(value) => v2)` | `andThen()` can conditionally chain together validator sequences. |

## Acknowledgements

This library owes thanks to:

- [TypeScript JSON type validation](https://github.com/mojotech/json-type-validation) by Elias Mulhall
  - Forked from this project with [major changes](https://github.com/tohagan/runtime-validator/releases/tag/v4.0.2).
- JsonValidator by Daniel van den Eijkel
- [Type-safe JSON Validator](https://github.com/ooesili/type-safe-json-decoder) by Wesley Merkel
- The Elm [Json.Decode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) API
