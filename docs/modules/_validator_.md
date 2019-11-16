[runtime-validator](../README.md) › [Globals](../globals.md) › ["validator"](_validator_.md)

# External module: "validator"

## Index

### Classes

* [ValidationException](../classes/_validator_.validationexception.md)
* [Validator](../classes/_validator_.validator.md)

### Interfaces

* [ValidatorError](../interfaces/_validator_.validatorerror.md)

### Type aliases

* [CheckResult](_validator_.md#checkresult)
* [ValidatorObject](_validator_.md#validatorobject)

### Functions

* [isValidator](_validator_.md#const-isvalidator)
* [isValidatorError](_validator_.md#const-isvalidatorerror)

## Type aliases

###  CheckResult

Ƭ **CheckResult**: *Result.Result‹A, [ValidatorError](../interfaces/_validator_.validatorerror.md)›*

Result of the `Validator.check` method.
On success returns `Ok` with the validated value of type `A`.
On failure returns `Err` containing a `ValidatorError`.

___

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
  b: tString()
}
```

#### Type declaration:

## Functions

### `Const` isValidator

▸ **isValidator**<**A**>(`a`: any): *a is Validator<A>*

Type guard for `Validator`.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |

**Returns:** *a is Validator<A>*

___

### `Const` isValidatorError

▸ **isValidatorError**(`a`: any): *a is ValidatorError*

Type guard for `ValidatorError`.

One use case of the type guard is in the `catch` of a promise.
Typescript types the error argument of `catch` as
`any`, so when dealing with a validator as a promise you may need to
distinguish between a `ValidatorError` and an error string.

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |

**Returns:** *a is ValidatorError*
