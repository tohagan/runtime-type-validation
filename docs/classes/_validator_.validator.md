[runtime-validator](../README.md) › [Globals](../globals.md) › ["validator"](../modules/_validator_.md) › [Validator](_validator_.validator.md)

# Class: Validator <**A**>

Validators can transform data objects with unknown structure into known and
verified forms. You can create objects of type `Validator<A>` with either the
primitive validator functions, such as `tBoolean()` and `tString()`, or by
applying higher-order validators to the primitives, such as `tArray(tBoolean())`
or `tDict(tString())`.

Each of the validator functions are available both as a static method on
`Validator` and as a function alias -- for example the string validator is
defined at `Validator.tString()`, but is also aliased to `tString()`. Using the
function aliases exported with the library is recommended.

`Validator` exposes a number of 'check' methods, which all validate data in the
same way, but communicate success and failure in different ways. The `map`
and `andThen` methods modify validators without having to call a 'check' method.

Alternatively, the main validator `check()` method returns an object of type
`Result<A, ValidatorError>`. This library provides a number of helper
functions for dealing with the `Result` type, so you can do all the same
things with a `Result` as with the validator methods.

## Type parameters

▪ **A**

## Hierarchy

* **Validator**

## Index

### Constructors

* [constructor](_validator_.validator.md#private-constructor)

### Properties

* [validate](_validator_.validator.md#private-validate)

### Methods

* [andThen](_validator_.validator.md#andthen)
* [asException](_validator_.validator.md#asexception)
* [asPromise](_validator_.validator.md#aspromise)
* [asString](_validator_.validator.md#asstring)
* [asSuccess](_validator_.validator.md#assuccess)
* [asSuccessL](_validator_.validator.md#assuccessl)
* [check](_validator_.validator.md#check)
* [map](_validator_.validator.md#map)
* [where](_validator_.validator.md#where)
* [constant](_validator_.validator.md#static-constant)
* [fail](_validator_.validator.md#static-fail)
* [intersection](_validator_.validator.md#static-intersection)
* [lazy](_validator_.validator.md#static-lazy)
* [oneOf](_validator_.validator.md#static-oneof)
* [optional](_validator_.validator.md#static-optional)
* [succeed](_validator_.validator.md#static-succeed)
* [tAny](_validator_.validator.md#static-tany)
* [tArray](_validator_.validator.md#static-tarray)
* [tBoolean](_validator_.validator.md#static-tboolean)
* [tDict](_validator_.validator.md#static-tdict)
* [tFunction](_validator_.validator.md#static-tfunction)
* [tNumber](_validator_.validator.md#static-tnumber)
* [tObject](_validator_.validator.md#static-tobject)
* [tObjectStrict](_validator_.validator.md#static-tobjectstrict)
* [tString](_validator_.validator.md#static-tstring)
* [tUndefined](_validator_.validator.md#static-tundefined)
* [tUnknown](_validator_.validator.md#static-tunknown)
* [tuple](_validator_.validator.md#static-tuple)
* [union](_validator_.validator.md#static-union)
* [valueAt](_validator_.validator.md#static-valueat)
* [withDefault](_validator_.validator.md#static-withdefault)

## Constructors

### `Private` constructor

\+ **new Validator**(`validate`: function): *[Validator](_validator_.validator.md)*

The Validator class constructor is kept private to separate the internal
`validate` function from the external `check` function. The distinction
between the two functions is that `validate` returns a
`Partial<ValidatorError>` on failure, which contains an unfinished error
report. When `check` is called on a validator, the relevant series of `validate`
calls is made, and then on failure the resulting `Partial<ValidatorError>`
is turned into a `ValidatorError` by filling in the missing information.

While hiding the constructor may seem restrictive, leveraging the
provided validator combinators and helper functions such as
`andThen` and `map` should be enough to build specialized validators as
needed.

**Parameters:**

▪ **validate**: *function*

▸ (`data`: unknown): *ValidateResult‹A›*

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |

**Returns:** *[Validator](_validator_.validator.md)*

## Properties

### `Private` validate

• **validate**: *function*

#### Type declaration:

▸ (`data`: unknown): *ValidateResult‹A›*

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |

## Methods

###  andThen

▸ **andThen**<**B**>(`f`: function): *[Validator](_validator_.validator.md)‹B›*

Chain together a sequence of validators. The first validator will check, and
then the function will determine what validator to check second. If the result
of the first validator succeeds then `f` will be applied to the validated
value. If it fails the error will propagate through.

This is a very powerful method -- it can act as both the `map` and `where`
methods, can improve error messages for edge cases, and can be used to
make a validator for custom types.

Example of adding an error message:
```
const versionValidator = valueAt(['version'], tNumber());
const infoValidator3 = tObject({a: tBoolean()});

const validator = versionValidator.andThen(version => {
  switch (version) {
    case 3:
      return infoValidator3;
    default:
      return fail(`Unable to validate info, version ${version} is not supported.`);
  }
});

validator.check({version: 3, a: true})
// => {ok: true, result: {a: true}}

validator.check({version: 5, x: 'abc'})
// =>
// {
//   ok: false,
//   error: {... message: 'Unable to validate info, version 5 is not supported.'}
// }
```

Example of validating a custom type:
```
// nominal type for arrays with a length of at least one
type NonEmptyArray<T> = T[] & { __nonEmptyArrayBrand__: void };

const nonEmptyArrayValidator = <T>(values: Validator<T>): Validator<NonEmptyArray<T>> =>
  tArray(values).andThen(arr =>
    arr.length > 0
      ? succeed(createNonEmptyArray(arr))
      : fail(`expected a non-empty array, got an empty array`)
  );
```

**Type parameters:**

▪ **B**

**Parameters:**

▪ **f**: *function*

▸ (`value`: A): *[Validator](_validator_.validator.md)‹B›*

**Parameters:**

Name | Type |
------ | ------ |
`value` | A |

**Returns:** *[Validator](_validator_.validator.md)‹B›*

___

###  asException

▸ **asException**(`data`: unknown): *A*

Run the validator and return the value on success, or throw an exception
with a formatted error string.

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |

**Returns:** *A*

___

###  asPromise

▸ **asPromise**(`data`: unknown): *Promise‹A›*

Run the validator as a `Promise`.

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |

**Returns:** *Promise‹A›*

___

###  asString

▸ **asString**(`data`: unknown): *string | null*

Run the validator and return null on success, or string containing a formatted error.

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |

**Returns:** *string | null*

___

###  asSuccess

▸ **asSuccess**(`data`: unknown, `log?`: Logger): *boolean*

Run the validator and return true on success, or false on failure.
Log errors (default to console.error).

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |
`log?` | Logger |

**Returns:** *boolean*

___

###  asSuccessL

▸ **asSuccessL**(`log`: Logger): *(Anonymous function)*

Curried version of `asSuccess` that injects the logger early
returning a new function that can be called later to perform the validation.
Used in VueJS to inject a 'debug' logger into a property validator.

**Parameters:**

Name | Type |
------ | ------ |
`log` | Logger |

**Returns:** *(Anonymous function)*

___

###  check

▸ **check**(`data`: unknown): *[CheckResult](../modules/_validator_.md#checkresult)‹A›*

Run the validator and return a `Result` with either the validated value or a
`ValidatorError` containing the data input, the location of the error, and
the error message.

Examples:
```
tNumber().check(12)
// => {ok: true, result: 12}

tString().check(9001)
// =>
// {
//   ok: false,
//   error: {
//     kind: 'ValidatorError',
//     input: 9001,
//     at: 'input',
//     message: 'expected a string, got 9001'
//   }
// }
```

**Parameters:**

Name | Type |
------ | ------ |
`data` | unknown |

**Returns:** *[CheckResult](../modules/_validator_.md#checkresult)‹A›*

___

###  map

▸ **map**<**B**>(`f`: function): *[Validator](_validator_.validator.md)‹B›*

Construct a new validator that applies a transformation to the validated
result. If the validator succeeds then `f` will be applied to the value. If
it fails the error will propagated through.

Example:
```
tNumber().map(x => x * 5).check(10)
// => {ok: true, result: 50}
```

**Type parameters:**

▪ **B**

**Parameters:**

▪ **f**: *function*

▸ (`value`: A): *B*

**Parameters:**

Name | Type |
------ | ------ |
`value` | A |

**Returns:** *[Validator](_validator_.validator.md)‹B›*

___

###  where

▸ **where**(`test`: function, `errorMessage`: string): *[Validator](_validator_.validator.md)‹A›*

Add constraints to a validator _without_ changing the resulting type. The
`test` argument is a predicate function which returns true for valid
inputs. When `test` fails on an input, the validator fails with the given
`errorMessage`.

```
const chars = (length: number): Validator<string> =>
  tString().where(
    (s: string) => s.length === length,
    `expected a string of length ${length}`
  );

chars(5).check('12345')
// => {ok: true, result: '12345'}

chars(2).check('HELLO')
// => {ok: false, error: {... message: 'expected a string of length 2'}}

chars(12).check(true)
// => {ok: false, error: {... message: 'expected a string, got a boolean'}}
```

**Parameters:**

▪ **test**: *function*

▸ (`value`: A): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`value` | A |

▪ **errorMessage**: *string*

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` constant

▸ **constant**<**T**>(`value`: T): *[Validator](_validator_.validator.md)‹T›*

Validator primitive that only matches on exact values.

For primitive values and shallow structures of primitive values `constant`
will infer an exact literal type:
```
 | Validator                      | Type                          |
 | ---------------------------- | ------------------------------|
 | constant(true)               | Validator<true>                 |
 | constant(false)              | Validator<false>                |
 | constant(null)               | Validator<null>                 |
 | constant(undefined)          | Validator<undefined>            |
 | constant('alaska')           | Validator<'alaska'>             |
 | constant(50)                 | Validator<50>                   |
 | constant([1,2,3])            | Validator<[1,2,3]>              |
 | constant({x: 't'})           | Validator<{x: 't'}>             |
```

Inference breaks on nested structures, which require an annotation to get
the literal type:
```
 | Validator                      | Type                          |
 | -----------------------------|-------------------------------|
 | constant([1,[2]])            | Validator<(number|number[])[]>  |
 | constant<[1,[2]]>([1,[2]])   | Validator<[1,[2]]>              |
 | constant({x: [1]})           | Validator<{x: number[]}>        |
 | constant<{x: [1]}>({x: [1]}) | Validator<{x: [1]}>             |
```

**Type parameters:**

▪ **T**: *string | number | boolean | []*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *[Validator](_validator_.validator.md)‹T›*

▸ **constant**<**T**, **U**>(`value`: U): *[Validator](_validator_.validator.md)‹U›*

**Type parameters:**

▪ **T**: *string | number | boolean*

▪ **U**: *[T]*

**Parameters:**

Name | Type |
------ | ------ |
`value` | U |

**Returns:** *[Validator](_validator_.validator.md)‹U›*

▸ **constant**<**T**, **U**>(`value`: U): *[Validator](_validator_.validator.md)‹U›*

**Type parameters:**

▪ **T**: *string | number | boolean*

▪ **U**: *Record‹string, T›*

**Parameters:**

Name | Type |
------ | ------ |
`value` | U |

**Returns:** *[Validator](_validator_.validator.md)‹U›*

▸ **constant**<**T**>(`value`: T): *[Validator](_validator_.validator.md)‹T›*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *[Validator](_validator_.validator.md)‹T›*

___

### `Static` fail

▸ **fail**<**A**>(`errorMessage`: string): *[Validator](_validator_.validator.md)‹A›*

Validator that ignores the input data and always fails with `errorMessage`.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`errorMessage` | string |

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` intersection

▸ **intersection**<**A**, **B**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›): *[Validator](_validator_.validator.md)‹A & B›*

Combines 2-8 object validators into a validator for the intersection of all the objects.

Example:
```
interface Pet {
  name: string;
  maxLegs: number;
}

interface Cat extends Pet {
  evil: boolean;
}

const petValidator: Validator<Pet> = tObject({name: tString(), maxLegs: tNumber()});
const catValidator: Validator<Cat> = intersection(petValidator, tObject({evil: tBoolean()}));
```

**Type parameters:**

▪ **A**

▪ **B**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B›*

▸ **intersection**<**A**, **B**, **C**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›): *[Validator](_validator_.validator.md)‹A & B & C›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B & C›*

▸ **intersection**<**A**, **B**, **C**, **D**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›): *[Validator](_validator_.validator.md)‹A & B & C & D›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B & C & D›*

▸ **intersection**<**A**, **B**, **C**, **D**, **E**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›): *[Validator](_validator_.validator.md)‹A & B & C & D & E›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B & C & D & E›*

▸ **intersection**<**A**, **B**, **C**, **D**, **E**, **F**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›, `fd`: [Validator](_validator_.validator.md)‹F›): *[Validator](_validator_.validator.md)‹A & B & C & D & E & F›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |
`fd` | [Validator](_validator_.validator.md)‹F› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B & C & D & E & F›*

▸ **intersection**<**A**, **B**, **C**, **D**, **E**, **F**, **G**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›, `fd`: [Validator](_validator_.validator.md)‹F›, `gd`: [Validator](_validator_.validator.md)‹G›): *[Validator](_validator_.validator.md)‹A & B & C & D & E & F & G›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |
`fd` | [Validator](_validator_.validator.md)‹F› |
`gd` | [Validator](_validator_.validator.md)‹G› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B & C & D & E & F & G›*

▸ **intersection**<**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›, `fd`: [Validator](_validator_.validator.md)‹F›, `gd`: [Validator](_validator_.validator.md)‹G›, `hd`: [Validator](_validator_.validator.md)‹H›): *[Validator](_validator_.validator.md)‹A & B & C & D & E & F & G & H›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

▪ **H**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |
`fd` | [Validator](_validator_.validator.md)‹F› |
`gd` | [Validator](_validator_.validator.md)‹G› |
`hd` | [Validator](_validator_.validator.md)‹H› |

**Returns:** *[Validator](_validator_.validator.md)‹A & B & C & D & E & F & G & H›*

___

### `Static` lazy

▸ **lazy**<**A**>(`mkValidator`: function): *[Validator](_validator_.validator.md)‹A›*

Validator that allows for validating recursive data structures. Unlike with
functions, validators assigned to variables can't reference themselves
before they are fully defined. We can avoid prematurely referencing the
validator by wrapping it in a function that won't be called until use, at
which point the validator has been defined.

Example:
```
interface Comment {
  msg: string;
  replies: Comment[];
}

const validator: Validator<Comment> = tObject({
  msg: tString(),
  replies: lazy(() => tArray(validator))
});
```

**Type parameters:**

▪ **A**

**Parameters:**

▪ **mkValidator**: *function*

▸ (): *[Validator](_validator_.validator.md)‹A›*

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` oneOf

▸ **oneOf**<**A**>(...`validators`: A[]): *[Validator](_validator_.validator.md)‹A›*

If given string, number or boolean arguments they will be converted into `constant()` validators.
Succeeds if at least one validator succeeds.

Note that `oneOf` expects the validators to all have the same return type,
while `union` creates a validator for the union type of all the input
validators.

Examples:
```
oneOf(tString(), tNumber().map(String))
oneOf(constant('start'), constant('stop'), succeed('unknown'))
oneOf('start', 'stop', 'unknown')
oneOf(23, 45, 67)
```

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`...validators` | A[] |

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` optional

▸ **optional**<**A**>(`validator`: [Validator](_validator_.validator.md)‹A›): *[Validator](_validator_.validator.md)‹undefined | A›*

Validator for values that may be `undefined`. This is primarily helpful for
validating interfaces with optional fields.

Example:
```
interface User {
  id: number;
  isOwner?: boolean;
}

const validator: Validator<User> = tObject({
  id: tNumber(),
  isOwner: optional(tBoolean())
});
```

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [Validator](_validator_.validator.md)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹undefined | A›*

___

### `Static` succeed

▸ **succeed**<**A**>(`fixedValue`: A): *[Validator](_validator_.validator.md)‹A›*

Validator that ignores the input data and always succeeds with `fixedValue`.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`fixedValue` | A |

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` tAny

▸ **tAny**(): *[Validator](_validator_.validator.md)‹any›*

Escape hatch to bypass validation. Always succeeds and types the result as
`any`. Useful for defining validators incrementally, particularly for
complex objects.

Example:
```
interface User {
  name: string;
  complexUserData: ComplexType;
}

const userValidator: Validator<User> = tObject({
  name: tString(),
  complexUserData: tAny()
});
```

**Returns:** *[Validator](_validator_.validator.md)‹any›*

___

### `Static` tArray

▸ **tArray**(): *[Validator](_validator_.validator.md)‹unknown[]›*

Validator for data arrays. Runs `validator` on each array element, and succeeds
if all elements are successfully validated. If no `validator` argument is
provided then the outer array part of the data is validated but not the
contents, typing the result as `unknown[]`.

To validate a single value that is inside of an array see `valueAt`.

Examples:
```
tArray(tNumber()).check([1, 2, 3])
// => {ok: true, result: [1, 2, 3]}

tArray(tArray(tBoolean())).check([[true], [], [true, false, false]])
// => {ok: true, result: [[true], [], [true, false, false]]}

const validNumbersValidator = tArray()
  .map((arr: unknown[]) => arr.map(tNumber().check))
  .map(Result.successes)

validNumbersValidator.check([1, true, 2, 3, 'five', 4, []])
// {ok: true, result: [1, 2, 3, 4]}

validNumbersValidator.check([false, 'hi', {}])
// {ok: true, result: []}

validNumbersValidator.check(false)
// {ok: false, error: {..., message: "expected an array, got a boolean"}}
```

**Returns:** *[Validator](_validator_.validator.md)‹unknown[]›*

▸ **tArray**<**A**>(`validator`: [Validator](_validator_.validator.md)‹A›): *[Validator](_validator_.validator.md)‹A[]›*

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [Validator](_validator_.validator.md)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹A[]›*

___

### `Static` tBoolean

▸ **tBoolean**(): *[Validator](_validator_.validator.md)‹boolean›*

Validates booleans, and fails on all other input.

**Returns:** *[Validator](_validator_.validator.md)‹boolean›*

___

### `Static` tDict

▸ **tDict**<**A**>(`validator`: [Validator](_validator_.validator.md)‹A›): *[Validator](_validator_.validator.md)‹Record‹string, A››*

Validator for data objects where the keys are unknown strings, but the values
should all be of the same type.

Example:
```
tDict(tNumber()).check({chocolate: 12, vanilla: 10, mint: 37});
// => {ok: true, result: {chocolate: 12, vanilla: 10, mint: 37}}
```

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [Validator](_validator_.validator.md)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹Record‹string, A››*

___

### `Static` tFunction

▸ **tFunction**(): *[Validator](_validator_.validator.md)‹Function›*

Validates functions, and fails on all other input.

**Returns:** *[Validator](_validator_.validator.md)‹Function›*

___

### `Static` tNumber

▸ **tNumber**(): *[Validator](_validator_.validator.md)‹number›*

Validates numbers, and fails on all other input.

**Returns:** *[Validator](_validator_.validator.md)‹number›*

___

### `Static` tObject

▸ **tObject**(): *[Validator](_validator_.validator.md)‹Record‹string, unknown››*

An higher-order validator that runs validators on specified fields of an object,
and returns a new object with those fields. If `object` is called with no
arguments, then the outer object part of the data is validated but not the
contents, typing the result as a record where all keys have a value of
type `unknown`.

The `optional` and `constant` validators are particularly useful for validating
objects that match typescript interfaces.

To validate a single field that is inside of an object see `valueAt`.

Example:
```
tObject({x: tNumber(), y: tNumber()}).check({x: 5, y: 10})
// => {ok: true, result: {x: 5, y: 10}}

tObject().map(Object.keys).check({n: 1, i: [], c: {}, e: 'e'})
// => {ok: true, result: ['n', 'i', 'c', 'e']}
```

**Returns:** *[Validator](_validator_.validator.md)‹Record‹string, unknown››*

▸ **tObject**<**A**>(`validators`: [ValidatorObject](../modules/_validator_.md#validatorobject)‹A›): *[Validator](_validator_.validator.md)‹A›*

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`validators` | [ValidatorObject](../modules/_validator_.md#validatorobject)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` tObjectStrict

▸ **tObjectStrict**(): *[Validator](_validator_.validator.md)‹Record‹string, unknown››*

Same as tObject but will return an error if input field names are added
beyond those defined by the check-time type (interface).

Example:
```
tObject({x: tNumber(), y: tNumber()}).check({x: 5, y: 10})
// => {ok: true, result: {x: 5, y: 10}}

tObject().map(Object.keys).check({n: 1, i: [], c: {}, e: 'e'})
// => {ok: true, result: ['n', 'i', 'c', 'e']}
```

**Returns:** *[Validator](_validator_.validator.md)‹Record‹string, unknown››*

▸ **tObjectStrict**<**A**>(`validators`: [ValidatorObject](../modules/_validator_.md#validatorobject)‹A›): *[Validator](_validator_.validator.md)‹A›*

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`validators` | [ValidatorObject](../modules/_validator_.md#validatorobject)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` tString

▸ **tString**(): *[Validator](_validator_.validator.md)‹string›*

Validates strings, and fails on all other input.

**Returns:** *[Validator](_validator_.validator.md)‹string›*

___

### `Static` tUndefined

▸ **tUndefined**(): *[Validator](_validator_.validator.md)‹any›*

**Returns:** *[Validator](_validator_.validator.md)‹any›*

___

### `Static` tUnknown

▸ **tUnknown**(): *[Validator](_validator_.validator.md)‹unknown›*

Validator identity function which always succeeds and types the result as
`unknown`.

**Returns:** *[Validator](_validator_.validator.md)‹unknown›*

___

### `Static` tuple

▸ **tuple**<**A**>(`validator`: [[Validator](_validator_.validator.md)‹A›]): *[Validator](_validator_.validator.md)‹[A]›*

Validator for fixed-length arrays, aka Tuples.

Supports up to 8-tuples.

Example:
```
tuple([tNumber(), tNumber(), tString()]).check([5, 10, 'px'])
// => {ok: true, result: [5, 10, 'px']}
```

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A]›*

▸ **tuple**<**A**, **B**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›]): *[Validator](_validator_.validator.md)‹[A, B]›*

**Type parameters:**

▪ **A**

▪ **B**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B]›*

▸ **tuple**<**A**, **B**, **C**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›]): *[Validator](_validator_.validator.md)‹[A, B, C]›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B, C]›*

▸ **tuple**<**A**, **B**, **C**, **D**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›]): *[Validator](_validator_.validator.md)‹[A, B, C, D]›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B, C, D]›*

▸ **tuple**<**A**, **B**, **C**, **D**, **E**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›]): *[Validator](_validator_.validator.md)‹[A, B, C, D, E]›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B, C, D, E]›*

▸ **tuple**<**A**, **B**, **C**, **D**, **E**, **F**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›, [Validator](_validator_.validator.md)‹F›]): *[Validator](_validator_.validator.md)‹[A, B, C, D, E, F]›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›, [Validator](_validator_.validator.md)‹F›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B, C, D, E, F]›*

▸ **tuple**<**A**, **B**, **C**, **D**, **E**, **F**, **G**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›, [Validator](_validator_.validator.md)‹F›, [Validator](_validator_.validator.md)‹G›]): *[Validator](_validator_.validator.md)‹[A, B, C, D, E, F, G]›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›, [Validator](_validator_.validator.md)‹F›, [Validator](_validator_.validator.md)‹G›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B, C, D, E, F, G]›*

▸ **tuple**<**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**>(`validator`: [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›, [Validator](_validator_.validator.md)‹F›, [Validator](_validator_.validator.md)‹G›, [Validator](_validator_.validator.md)‹H›]): *[Validator](_validator_.validator.md)‹[A, B, C, D, E, F, G, H]›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

▪ **H**

**Parameters:**

Name | Type |
------ | ------ |
`validator` | [[Validator](_validator_.validator.md)‹A›, [Validator](_validator_.validator.md)‹B›, [Validator](_validator_.validator.md)‹C›, [Validator](_validator_.validator.md)‹D›, [Validator](_validator_.validator.md)‹E›, [Validator](_validator_.validator.md)‹F›, [Validator](_validator_.validator.md)‹G›, [Validator](_validator_.validator.md)‹H›] |

**Returns:** *[Validator](_validator_.validator.md)‹[A, B, C, D, E, F, G, H]›*

___

### `Static` union

▸ **union**<**A**, **B**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›): *[Validator](_validator_.validator.md)‹A | B›*

Combines 2-8 validators of disparate types into a validator for the union of all
the types.

If you need more than 8 variants for your union, it's possible to use
`oneOf` in place of `union` as long as you annotate every validator with the
union type.

Example:
```
type C = {a: string} | {b: number};

const unionValidator: Validator<C> = union(tObject({a: tString()}), tObject({b: tNumber()}));
const oneOfValidator: Validator<C> = oneOf(tObject<C>({a: tString()}), tObject<C>({b: tNumber()}));
```

**Type parameters:**

▪ **A**

▪ **B**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B›*

▸ **union**<**A**, **B**, **C**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›): *[Validator](_validator_.validator.md)‹A | B | C›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B | C›*

▸ **union**<**A**, **B**, **C**, **D**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›): *[Validator](_validator_.validator.md)‹A | B | C | D›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B | C | D›*

▸ **union**<**A**, **B**, **C**, **D**, **E**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›): *[Validator](_validator_.validator.md)‹A | B | C | D | E›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B | C | D | E›*

▸ **union**<**A**, **B**, **C**, **D**, **E**, **F**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›, `fd`: [Validator](_validator_.validator.md)‹F›): *[Validator](_validator_.validator.md)‹A | B | C | D | E | F›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |
`fd` | [Validator](_validator_.validator.md)‹F› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B | C | D | E | F›*

▸ **union**<**A**, **B**, **C**, **D**, **E**, **F**, **G**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›, `fd`: [Validator](_validator_.validator.md)‹F›, `gd`: [Validator](_validator_.validator.md)‹G›): *[Validator](_validator_.validator.md)‹A | B | C | D | E | F | G›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |
`fd` | [Validator](_validator_.validator.md)‹F› |
`gd` | [Validator](_validator_.validator.md)‹G› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B | C | D | E | F | G›*

▸ **union**<**A**, **B**, **C**, **D**, **E**, **F**, **G**, **H**>(`ad`: [Validator](_validator_.validator.md)‹A›, `bd`: [Validator](_validator_.validator.md)‹B›, `cd`: [Validator](_validator_.validator.md)‹C›, `dd`: [Validator](_validator_.validator.md)‹D›, `ed`: [Validator](_validator_.validator.md)‹E›, `fd`: [Validator](_validator_.validator.md)‹F›, `gd`: [Validator](_validator_.validator.md)‹G›, `hd`: [Validator](_validator_.validator.md)‹H›): *[Validator](_validator_.validator.md)‹A | B | C | D | E | F | G | H›*

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **D**

▪ **E**

▪ **F**

▪ **G**

▪ **H**

**Parameters:**

Name | Type |
------ | ------ |
`ad` | [Validator](_validator_.validator.md)‹A› |
`bd` | [Validator](_validator_.validator.md)‹B› |
`cd` | [Validator](_validator_.validator.md)‹C› |
`dd` | [Validator](_validator_.validator.md)‹D› |
`ed` | [Validator](_validator_.validator.md)‹E› |
`fd` | [Validator](_validator_.validator.md)‹F› |
`gd` | [Validator](_validator_.validator.md)‹G› |
`hd` | [Validator](_validator_.validator.md)‹H› |

**Returns:** *[Validator](_validator_.validator.md)‹A | B | C | D | E | F | G | H›*

___

### `Static` valueAt

▸ **valueAt**<**A**>(`paths`: string | number[], `validator`: [Validator](_validator_.validator.md)‹A›): *[Validator](_validator_.validator.md)‹A›*

Validator that pulls a specific field out of a data structure, instead of
validating and returning the full structure. The `paths` array describes the
object keys and array indices to traverse, so that values can be pulled out
of a nested structure.

Example:
```
const validator = valueAt(['a', 'b', 0], tString());

validator.check({a: {b: ['surprise!']}})
// => {ok: true, result: 'surprise!'}

validator.check({a: {x: 'cats'}})
// => {ok: false, error: {... at: 'input.a.b[0]' message: 'path does not exist'}}
```

Note that the `validator` is ran on the value found at the last key in the
path, even if the last key is not found. This allows the `optional`
validator to succeed when appropriate.
```
const optionalValidator = valueAt(['a', 'b', 'c'], optional(tString()));

optionalValidator.check({a: {b: {c: 'surprise!'}}})
// => {ok: true, result: 'surprise!'}

optionalValidator.check({a: {b: 'cats'}})
// => {ok: false, error: {... at: 'input.a.b.c' message: 'expected an object, got "cats"'}

optionalValidator.check({a: {b: {z: 1}}})
// => {ok: true, result: undefined}
```

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`paths` | string &#124; number[] |
`validator` | [Validator](_validator_.validator.md)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹A›*

___

### `Static` withDefault

▸ **withDefault**<**A**>(`defaultValue`: A, `validator`: [Validator](_validator_.validator.md)‹A›): *[Validator](_validator_.validator.md)‹A›*

Validator that always succeeds with either the validated value, or a fallback
default value.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`defaultValue` | A |
`validator` | [Validator](_validator_.validator.md)‹A› |

**Returns:** *[Validator](_validator_.validator.md)‹A›*
