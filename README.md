# Run-time Type Validation

A **light weight** library to perform run-time type checking and validation for
[TypeScript](https://www.typescriptlang.org/) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Features:

- Tiny foot print
- Concise functional composition makes it easily extensible (often a "one liner")
- Detailed validation error reporting.
- Helper functions convert the validation result to:
  - JSON result for your own custom mapping.
  - An exception
  - A success/fail boolean (with logging) - Useful for component property validation

## Applications:

- Validate and filter client or server side payloads.
- Validate function arguments
- Validate component properties
- Assist in unit testing

This library owes thanks to:

- [TypeScript JSON type validation](https://github.com/mojotech/json-type-validation) by Elias Mulhall
- [JsonDecoder](https://github.com/aische/JsonDecoder) by Daniel van den Eijkel
- [Type-safe JSON Decoder](https://github.com/ooesili/type-safe-json-decoder) by Wesley Merkel
- The Elm [Json.Decode](http://package.elm-lang.org/packages/elm-lang/core/latest/Json-Decode) API

## Installation

```
npm i runtime-type-validation
```

Projects using `< typescript@3.0.1` will need a polyfill for the `unknown`
type, such as [unknown-ts](https://www.npmjs.com/package/unknown-ts).

## Motivation

Let's say we're creating a web app for our pet sitting business, and we've
picked TypeScript as one of our core technologies. This is a great choice
because the extra stability and type safety that TypeScript provides is really
going to help us market our business.

We've defined the data we need to track about each client's pet:

```typescript
interface Pet {
  name: string;
  species: string;
  age?: number;
  isCute?: boolean;
}
```

And we've got some data about current client's pets which is stored as JSON:

```typescript
const croc: Pet = JSON.parse('{"name":"Lyle","species":"Crocodile","isCute":true}')
const moose: Pet = JSON.parse('{"name":"Bullwinkle","age":59}')
```

But that can't be right -- our data for `moose` is missing information required
for the `Pet` interface, but TypeScript compiles the code just fine!

Of course this isn't an issue with TypeScript, but with our own type
annotations. In TypeScript `JSON.parse` has a return type of `any`, which pushes
the responsibility of verifying the type of data onto the user. By assuming that
all of our data is correctly formed, we've left ourselves open to unexpected
errors at runtime.

Unfortunately TypeScript doesn't provide a good built-in way to deal with this
issue. Providing run-time type information is one of TypeScript's
[non-goals](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals#non-goals),
and our web app is too important to risk using a forked version of TypeScript
with that added functionality.

[Type guards](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html)
work, but are limited in that they circumvent type inference instead of working
with it, and can be cumbersome to write.

With `runtime-type-validation` we can define a function that validate untyped objects
at run-time and returns the TypeScript type. Decoders are concise, composable,
and type check against our defined types and interfaces.

```typescript
import { Decoder, tObject, tString, optional, tNumber, tBoolean} from 'json-type-validation'

const petDecoder: Decoder<Pet> = tObject({
  name: tString(),
  species: tString(),
  age: optional(tNumber()),
  isCute: optional(tBoolean())
})
```

Finally, we can choose from a number of methods to validate Javascript types and
report success or failure. When an object fails validation the decoder
clearly shows how the data was malformed.

```typescript
const lyle: Pet = petDecoder.runWithException(croc)

const bullwinkle: Pet = petDecoder.runWithException(moose)
// Throws the exception:
// `Input: {"name":"Bullwinkle","age":59}
//  Failed at input: the key 'species' is required but was not present`
```

## Documentation

[Documentation](https://github.com/tohagan/runtime-type-validation/tree/master/docs).

