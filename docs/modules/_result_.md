[runtime-validator](../README.md) › [Globals](../globals.md) › ["result"](_result_.md)

# External module: "result"

## Index

### Interfaces

* [Err](../interfaces/_result_.err.md)
* [Ok](../interfaces/_result_.ok.md)

### Type aliases

* [Result](_result_.md#result)

### Functions

* [andThen](_result_.md#const-andthen)
* [asException](_result_.md#const-asexception)
* [asPromise](_result_.md#const-aspromise)
* [asSuccess](_result_.md#const-assuccess)
* [err](_result_.md#const-err)
* [isErr](_result_.md#const-iserr)
* [isOk](_result_.md#const-isok)
* [map](_result_.md#const-map)
* [map2](_result_.md#const-map2)
* [mapError](_result_.md#const-maperror)
* [ok](_result_.md#const-ok)
* [successes](_result_.md#const-successes)
* [withDefault](_result_.md#const-withdefault)

## Type aliases

###  Result

Ƭ **Result**: *[Ok](../interfaces/_result_.ok.md)‹V› | [Err](../interfaces/_result_.err.md)‹E›*

The result of a computation that may fail. The validating function
`Validator.check(input)` checks the input value and returns a `Result`.
The value of a `Result` is either `Ok` if  the input is valid,
or `Err` if the input was invalid.

## Functions

### `Const` andThen

▸ **andThen**<**A**, **B**, **E**>(`f`: function, `r`: [Result](_result_.md#result)‹A, E›): *[Result](_result_.md#result)‹B, E›*

Chain together a sequence of computations that may fail, similar to a
`Promise`. If the first computation fails then the error will propagate
through. If it succeeds, then `f` will be applied to the value, returning a
new `Result`.

**Type parameters:**

▪ **A**

▪ **B**

▪ **E**

**Parameters:**

▪ **f**: *function*

▸ (`value`: A): *[Result](_result_.md#result)‹B, E›*

**Parameters:**

Name | Type |
------ | ------ |
`value` | A |

▪ **r**: *[Result](_result_.md#result)‹A, E›*

**Returns:** *[Result](_result_.md#result)‹B, E›*

___

### `Const` asException

▸ **asException**<**V**>(`r`: [Result](_result_.md#result)‹V, any›): *V*

Return the successful result, or throw an error.

**Type parameters:**

▪ **V**

**Parameters:**

Name | Type |
------ | ------ |
`r` | [Result](_result_.md#result)‹V, any› |

**Returns:** *V*

___

### `Const` asPromise

▸ **asPromise**<**V**>(`r`: [Result](_result_.md#result)‹V, any›): *Promise‹V›*

Create a `Promise` that either resolves with the result of `Ok` or rejects
with the error of `Err`.

**Type parameters:**

▪ **V**

**Parameters:**

Name | Type |
------ | ------ |
`r` | [Result](_result_.md#result)‹V, any› |

**Returns:** *Promise‹V›*

___

### `Const` asSuccess

▸ **asSuccess**<**V**>(`r`: [Result](_result_.md#result)‹V, any›, `log?`: Logger): *boolean*

If successful return `true`,
If error return `false` and log error to console.
Useful in Vue component property validation.

**Type parameters:**

▪ **V**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`r` | [Result](_result_.md#result)‹V, any› | Validation result |
`log?` | Logger | optional error logger. Defaults to `console.error`  |

**Returns:** *boolean*

___

### `Const` err

▸ **err**<**E**>(`error`: E): *[Err](../interfaces/_result_.err.md)‹E›*

Wraps errors in an `Err` type.

Example: `err('on fire') // => {ok: false, error: 'on fire'}`

**Type parameters:**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`error` | E |

**Returns:** *[Err](../interfaces/_result_.err.md)‹E›*

___

### `Const` isErr

▸ **isErr**<**E**>(`r`: [Result](_result_.md#result)‹any, E›): *r is Err<E>*

Typeguard for `Err`.

**Type parameters:**

▪ **E**

**Parameters:**

Name | Type |
------ | ------ |
`r` | [Result](_result_.md#result)‹any, E› |

**Returns:** *r is Err<E>*

___

### `Const` isOk

▸ **isOk**<**V**>(`r`: [Result](_result_.md#result)‹V, any›): *r is Ok<V>*

Typeguard for `Ok`.

**Type parameters:**

▪ **V**

**Parameters:**

Name | Type |
------ | ------ |
`r` | [Result](_result_.md#result)‹V, any› |

**Returns:** *r is Ok<V>*

___

### `Const` map

▸ **map**<**A**, **B**, **E**>(`f`: function, `r`: [Result](_result_.md#result)‹A, E›): *[Result](_result_.md#result)‹B, E›*

Apply `f` to the result of an `Ok`, or pass the error through.

**Type parameters:**

▪ **A**

▪ **B**

▪ **E**

**Parameters:**

▪ **f**: *function*

▸ (`value`: A): *B*

**Parameters:**

Name | Type |
------ | ------ |
`value` | A |

▪ **r**: *[Result](_result_.md#result)‹A, E›*

**Returns:** *[Result](_result_.md#result)‹B, E›*

___

### `Const` map2

▸ **map2**<**A**, **B**, **C**, **E**>(`f`: function, `ar`: [Result](_result_.md#result)‹A, E›, `br`: [Result](_result_.md#result)‹B, E›): *[Result](_result_.md#result)‹C, E›*

Apply `f` to the result of two `Ok`s, or pass an error through. If both
`Result`s are errors then the first one is returned.

**Type parameters:**

▪ **A**

▪ **B**

▪ **C**

▪ **E**

**Parameters:**

▪ **f**: *function*

▸ (`av`: A, `bv`: B): *C*

**Parameters:**

Name | Type |
------ | ------ |
`av` | A |
`bv` | B |

▪ **ar**: *[Result](_result_.md#result)‹A, E›*

▪ **br**: *[Result](_result_.md#result)‹B, E›*

**Returns:** *[Result](_result_.md#result)‹C, E›*

___

### `Const` mapError

▸ **mapError**<**V**, **A**, **B**>(`f`: function, `r`: [Result](_result_.md#result)‹V, A›): *[Result](_result_.md#result)‹V, B›*

Apply `f` to the error of an `Err`, or pass the success through.

**Type parameters:**

▪ **V**

▪ **A**

▪ **B**

**Parameters:**

▪ **f**: *function*

▸ (`error`: A): *B*

**Parameters:**

Name | Type |
------ | ------ |
`error` | A |

▪ **r**: *[Result](_result_.md#result)‹V, A›*

**Returns:** *[Result](_result_.md#result)‹V, B›*

___

### `Const` ok

▸ **ok**<**V**>(`result`: V): *[Ok](../interfaces/_result_.ok.md)‹V›*

Wraps values in an `Ok` type.

Example: `ok(5) // => {ok: true, result: 5}`

**Type parameters:**

▪ **V**

**Parameters:**

Name | Type |
------ | ------ |
`result` | V |

**Returns:** *[Ok](../interfaces/_result_.ok.md)‹V›*

___

### `Const` successes

▸ **successes**<**A**>(`results`: [Result](_result_.md#result)‹A, any›[]): *A[]*

Given an array of `Result`s, return the successful values.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`results` | [Result](_result_.md#result)‹A, any›[] |

**Returns:** *A[]*

___

### `Const` withDefault

▸ **withDefault**<**V**>(`defaultValue`: V, `r`: [Result](_result_.md#result)‹V, any›): *V*

Unwraps a `Result` and returns either the result of an `Ok`, or
`defaultValue`.

Example:
```
Result.withDefault(5, number().check(data))
```

It would be nice if `Validator` had an instance method that mirrored this
function. Such a method would look something like this:
```
class Validator<A> {
  asDefault = (defaultValue: A, data: any): A =>
    Result.withDefault(defaultValue, this.check(data));
}

number().asDefault(5, data)
```
Unfortunately, the type of `defaultValue: A` on the method causes issues
with type inference on  the `object` validator in some situations. While these
inference issues can be solved by providing the optional type argument for
`object`s, the extra trouble and confusion doesn't seem worth it.

**Type parameters:**

▪ **V**

**Parameters:**

Name | Type |
------ | ------ |
`defaultValue` | V |
`r` | [Result](_result_.md#result)‹V, any› |

**Returns:** *V*
