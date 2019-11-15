# Runtime type checking & validation

A **light weight** library to perform run-time type checking and field validation for
[TypeScript](https://www.typescriptlang.org/) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Documentation

[API Documentation](https://github.com/tohagan/runtime-validation/tree/master/docs).

## Features

- Small lib. Easy to learn and read. Simple to extend.
- Use with either TypeScript OR JavaScript.
- Detailed error reporting with nested values and paths.
- `Validator` objects are concise, composable and type check TS types and interfaces.
  - Can perform both type checking and value constraint checking (validation).
- Useful for multiple validation contexts (Angular, Vue, React, NodeJS)
- Helper functions convert a validation result to:
  - A value result OR An exception
  - A Promise result
  - A success/fail boolean result (logs errors).
  - Create your own

## Applications

- Validate and client or server side request/response payloads.
  - Can either filter out (`tObject`) or prevent (`tObjectStrict`) additional fields.
- Validate function arguments
- Validate component properties (Vue)
- Unit testing

## Roadmap

- Error reporting could be improved by recording a collection of errors (one per field) to support Form Validation.

## Installation

```
npm i runtime-validation
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

// Throws the exception:
// `Input: {"name":"Lyle","age":15}
//  Failed at input: the key 'species' is required but was not present`
const pet: Pet = petValidator.asException(json); // throw exception if invalid

const petPromise: Promse<Pet> = petValidator.asPromise(json); // reject() if invalid

const isValid: boolean = petValidator.asSuccess(json); // false if invalid with error logging.

```

### JavaScript Example #2 - VueJS Object Field Validation

VueJS supports custom validation of [component properties](https://vuejs.org/v2/guide/components-props.html#Prop-Validation)
via a `validator` field defined on the property. Since the `asSuccess` modifier matches the call signature
of this validator interface, here's how we could validate a Pet data type:

```javascript

// VueJs component
export default {
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
  }
}

```

## Acknowledgements

This library owes thanks to:

- [TypeScript JSON type validation](https://github.com/mojotech/json-type-validation) by Elias Mulhall
  - Forked with major changes. Now works with JavaScript. Many additional features.
- [JsonValidator](https://github.com/aische/JsonValidator) by Daniel van den Eijkel
- [Type-safe JSON Validator](https://github.com/ooesili/type-safe-json-decoder) by Wesley Merkel
- The Elm [Json.Decode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) API
