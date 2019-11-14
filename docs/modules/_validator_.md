[runtime-type-validation](../README.md) › [Globals](../globals.md) › ["validator"](_validator_.md)

# External module: "validator"

## Index

### Classes

* [Validator](../classes/_validator_.validator.md)

### Interfaces

* [ValidatorError](../interfaces/_validator_.validatorerror.md)

### Type aliases

* [ValidatorObject](_validator_.md#validatorobject)

### Functions

* [isValidatorError](_validator_.md#const-isvalidatorerror)

## Type aliases

###  ValidatorObject

Ƭ **ValidatorObject**: *object*

Defines a mapped type over an interface `A`. `ValidatorObject<A>` is an
interface that has all the keys or `A`, but each key's property type is
mapped to a validator for that type. This type is used when creating validators
for objects.

Example:
```
interface X {
  a: boolean;
  b: string;
}

const validatorObject: ValidatorObject<X> = {
  a: tBoolean(),
  b: string()
}
```

#### Type declaration:

## Functions

### `Const` isValidatorError

▸ **isValidatorError**(`a`: any): *a is ValidatorError*

Type guard for `ValidatorError`. One use case of the type guard is in the
`catch` of a promise. Typescript types the error argument of `catch` as
`any`, so when dealing with a validator as a promise you may need to
distinguish between a `ValidatorError` and an error string.

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |

**Returns:** *a is ValidatorError*
