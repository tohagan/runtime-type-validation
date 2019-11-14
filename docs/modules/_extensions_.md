[runtime-type-validation](../README.md) › [Globals](../globals.md) › ["extensions"](_extensions_.md)

# External module: "extensions"

## Index

### Functions

* [chars](_extensions_.md#const-chars)
* [charsMax](_extensions_.md#const-charsmax)
* [charsMin](_extensions_.md#const-charsmin)
* [charsRange](_extensions_.md#const-charsrange)
* [httpUrl](_extensions_.md#const-httpurl)
* [matches](_extensions_.md#const-matches)
* [range](_extensions_.md#const-range)
* [tEnum](_extensions_.md#tenum)
* [tNullable](_extensions_.md#tnullable)

## Functions

### `Const` chars

▸ **chars**(`length`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having exactly `length` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

### `Const` charsMax

▸ **charsMax**(`max`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having a maximum of `max` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`max` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

### `Const` charsMin

▸ **charsMin**(`min`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having a minimum of `min` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

### `Const` charsRange

▸ **charsRange**(`min`: number, `max`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having a `length` between `min` .. `max` (inclusive).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number | - |
`max` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

### `Const` httpUrl

▸ **httpUrl**(): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string containg a HTTP or HTTPS URL.

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

### `Const` matches

▸ **matches**(`pattern`: RegExp): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string that matches the RegEx pattern `pattern`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pattern` | RegExp |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

### `Const` range

▸ **range**(`min`: number, `max`: number): *[Validator](../classes/_validator_.validator.md)‹number›*

Matches a number between `min` .. `max` (inclusive).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number | - |
`max` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹number›*

___

###  tEnum

▸ **tEnum**<**T**>(...`values`: T[]): *[Validator](../classes/_validator_.validator.md)‹T›*

Converts zero or more string or number arguments into a `oneOf()` condition
that matches exactly one of the string values as a constant.

Note: The return type is `Validator<string>` not `Validator<some enum>` as you might expect.

**Type parameters:**

▪ **T**: *string | number*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | T[] |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹T›*

___

###  tNullable

▸ **tNullable**<**A**>(`validator`: [Validator](../classes/_validator_.validator.md)‹A›): *[Validator](../classes/_validator_.validator.md)‹A | null›*

Allow null or the type checked value.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validator` | [Validator](../classes/_validator_.validator.md)‹A› |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹A | null›*
