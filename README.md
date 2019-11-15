# Runtime type checking & validation

A **light weight** library to perform run-time type checking and field validation for TypeScript and JavaScript.

## Features

- Easy to learn and read. Simple and fast to extend.
- Small lib. Optimised for [tree shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking).
- Use with either [TypeScript](https://www.typescriptlang.org/) OR [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- Detailed error reporting showing invalid values with their location.
- Create `Validator` objects that are **concise**, **composable**.
  - Type check against **compile-time** types and interfaces.
  - Validate both **run-time** type and field constraint.
- Useful for multiple validation contexts and frameworks (Angular, Vue, React, NodeJS)
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

## Installation

```
npm i runtime-validation
```

Projects using `< typescript@3.0.1` will need a polyfill for the `unknown`
type, such as [unknown-ts](https://www.npmjs.com/package/unknown-ts).

### API Summary

This library uses the [combinator pattern](https://wiki.haskell.org/Combinator_pattern) to build a `Validator`.

Primitive Type              | Description             |
--------------------------- | ----------------------- |
`tString()`                 | Matches a `string`      |
`tNumber()`                 | Matches a `number`      |
`tBoolean()`                | Matches a `boolean`     |
`tFunction()`               | Matches a `function`    |
`tAny()`                    | Matches `any` type. Returns `any` type. |
`tUndefined()`              | Matches a `undefined` type. Returns `any` type.  |
`tUnknown()`                | Always succeeds and types the result as `unknown`  |

Combinator                  | Description             |
--------------------------- | ----------------------- |
`constant(value)`           | Matches a constant string, number or boolean `value`  |
`tArray(v)`                 | Matches an `array` containing elements that *all* match validator `v` |
`tDict(v)`                  | Matches a dictionary `object` with `strings` as keys and values that *all* match `v` |
`tuple([v1, ... vN])`       | Matches an `array` containing elements that match validators `v1` ... `vN` in sequence |
`nullable(v)`               | Matches `null` or a value matching `v` |
`optional(v)`               | Matches `undefined` or a value matching `v` |
`oneOf(v1, ... vN)`         | Matches *one of* the validators `v1` .. `vN` which must all return the same type.  |
`union(v1, ... vN)`         | Matches *one of* the validators `v1` .. `vN`. Return type is a union of return types. |
`intersection(v1, ... vN)`  | Matches *all of* the validators `v1` .. `vN`. Return type is the intersection of return types.  |
`valueAt(path, v)`          | Returns a specific field out of a data structure where `path` = location inside the structure.  |
`withDefault(default, v)`   | If `v` fails to match input, return `default`. |
`lazy(v)`                   | Supports validation of recursive types. See example below.  |
`succeed(value)`            | Ignores input and always returns `value`.  |
`fails(error)`              | Ignores input and always fails with the `error`.  |

Value Constraint            | Description             |
--------------------------  | ----------------------- |
`range(min, max)`           | Matches a `number` value between `min` and `max` |
`chars(n)`                  | Matches a `string` of length `n` |
`charsMin(min)`             | Matches a `string` of at least `min` characters |
`charsMax(max)`             | Matches a `string` of no more than `max` characters |
`charsRange(min, max)`      | Matches a `string` of between `min` and `max` characters |
`matches(pattern)`          | Matches a `string` that matches the `pattern` |
`httpUrl()`                 | Matches a HTTP or HTTPS URL |

Validation Execution           | Description             |
-----------------------------  | ----------------------- |
`validator.asException(value)` | Returns validated `value`. Throws an exception if invalid. |
`validator.asPromise(value)`   | Returns a `Promise` that is resolved to the validated `value` or rejected with the error. |
`validator.asSuccess(value [,logger])` | Returns `true` if `value` is valid, otherwise logs the error and returns `false`. |

NOTE: `validator.asSuccess` is useful in a Vue property validator or in a TypeScript
[Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards).

Example use of `lazy(v)` to validate a recursive type:

```typescript
const validator: Validator<Comment> = tObject({
  msg: string(),
  replies: lazy(() => tArray(validator)) // self reference
});
```

- [Validator classes](./docs/modules/_validator_.md).
- [Result class](./docs/modules/_result_.md).

## Examples

### Typescript Example #1 - Runtime type checking

TypeScript only checks types at compile time not at run-time.
The TypeScript project have excluded this from their stated
[goals](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals#non-goals),

[Type guards](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html)
work, but are limited in that they circumvent type inference instead of working
with it, and can be cumbersome to write.

```typescript

import { Validator, tObject, tString, tNumber, tBoolean, optional } from 'runtime-validation'

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

const pet: Pet = petValidator.asException(json); // throw exception if invalid
// Exception ... `Input: {"name":"Lyle","age":15}
// Failed at input: the key 'species' is required but was not present`

const petPromise: Promse<Pet> = petValidator.asPromise(json); // reject() if invalid

const isValid: boolean = petValidator.asSuccess(json); // false if invalid with error logging.

```

### JavaScript Example #2 - VueJS Object Field Validation

[VueJS](https://vuejs.org) supports custom validation of [component properties](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) via a `validator` field defined on the property.

The `asSuccess` modifier matches the call signature of this validator interface so we can use it to validate a Pet property on a component:

```javascript

import { tObject, tString, tNumber, tBoolean, optional } from 'runtime-validation'

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

### Custom Validators

The `Validator` includes the `.where()` method that can be used to add custom validation rules.

```typescript

const range = (min: number, max: number) =>
   tNumber().where(n => n >= min && n <= max, `expected a number between ${min} and ${max}`);

const species = oneOf("dog", "cat", "bird", "snake");

const petValidator = tObject({
  name: tString(),
  species,
  age: optional(range(0, 100)),
  isCute: optional(tBoolean())
});

```

## Acknowledgements

This library owes thanks to:

- [TypeScript JSON type validation](https://github.com/mojotech/json-type-validation) by Elias Mulhall
  - Forked with major changes. Now works with JavaScript. Many additional features.
- [JsonValidator](https://github.com/aische/JsonValidator) by Daniel van den Eijkel
- [Type-safe JSON Validator](https://github.com/ooesili/type-safe-json-decoder) by Wesley Merkel
- The Elm [Json.Decode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) API
