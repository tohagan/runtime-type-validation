# Documentation

[Documentation](https://github.com/mojotech/json-type-validation/tree/master/docs).

The best places to start are with the examples in the `test/` directory, and the
documentation for the
[Validator class](https://github.com/mojotech/json-type-validation/blob/master/docs/classes/_validator_.validator.md).
At some point you may need documentation for dealing with the
[Result type](https://github.com/mojotech/json-type-validation/blob/master/docs/modules/_result_.md).

### Type Parameters

Many of the validator functions take an optional type parameter which determines
the type of the validated value. In most cases typescript successfully infers
these types, although some specific validators include documentation for
situations where the type is necessary (see the `constant` and `union`
validators). You may still find that including the type parameter improves type
inference in situations where typescript's error messages are particularly
unhelpful.

As an example, a validator for the `Pet` interface can be typechecked just as
effectively using the type parameter as with the `Validator<Pet>` annotation.
```
const petValidator = object<Pet>({
  name: string(),
  species: string(),
  age: optional(number()),
  isCute: optional(boolean())
})
```

### Combinators

This library uses the [combinator pattern](https://wiki.haskell.org/Combinator_pattern)
to build validators. The validator primitives `string`, `number`, `boolean`,
`tAny`, `constant`, `succeed`, and `fail` act as validator building blocks that
each perform a simple decoding operation. The validator combinators `object`,
`array`, `tDict`, `optional`, `oneOf`, `union`, `withDefault`, `valueAt`, and
`lazy` take validators as arguments, and combined the validators into more
complicated structures. You can think of your own user-defined validators as an
extension of these composable units.
