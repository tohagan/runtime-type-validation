[runtime-type-validation](../README.md) › [Globals](../globals.md) › ["extensions"](_extensions_.md)

# External module: "extensions"

## Index

### Variables

* [urlHttp](_extensions_.md#const-urlhttp)

### Functions

* [chars](_extensions_.md#const-chars)
* [charsMax](_extensions_.md#const-charsmax)
* [charsMin](_extensions_.md#const-charsmin)
* [charsRange](_extensions_.md#const-charsrange)
* [matches](_extensions_.md#const-matches)
* [range](_extensions_.md#const-range)
* [tEnum](_extensions_.md#tenum)
* [tNullable](_extensions_.md#tnullable)

## Variables

### `Const` urlHttp

• **urlHttp**: *[Decoder](../classes/_decoder_.decoder.md)‹string›* =  tString().where((s) => patterns.urlHttp.test(s), `expected a http or https URL`)

Matches a string containg a HTTP or HTTPS URL.

## Functions

### `Const` chars

▸ **chars**(`length`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

Matches a string having exactly `length` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` charsMax

▸ **charsMax**(`max`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

Matches a string having a maximum of `max` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`max` | number |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` charsMin

▸ **charsMin**(`min`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

Matches a string having a minimum of `min` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` charsRange

▸ **charsRange**(`min`: number, `max`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

Matches a string having a `length` between `min` .. `max` (inclusive).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number | - |
`max` | number |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` matches

▸ **matches**(`pattern`: RegExp): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

Matches a string that matches the RegEx pattern `pattern`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pattern` | RegExp |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` range

▸ **range**(`min`: number, `max`: number): *[Decoder](../classes/_decoder_.decoder.md)‹number›*

Matches a number between `min` .. `max` (inclusive).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number | - |
`max` | number |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹number›*

___

###  tEnum

▸ **tEnum**<**T**>(...`values`: T[]): *[Decoder](../classes/_decoder_.decoder.md)‹T›*

Converts zero or more string or number arguments into a `oneOf()` condition
that matches exactly one of the string values as a constant.

**Type parameters:**

▪ **T**: *string | number*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...values` | T[] |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹T›*

___

###  tNullable

▸ **tNullable**<**A**>(`decoder`: [Decoder](../classes/_decoder_.decoder.md)‹A›): *[Decoder](../classes/_decoder_.decoder.md)‹A | null›*

Allow null or the type checked value.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`decoder` | [Decoder](../classes/_decoder_.decoder.md)‹A› |   |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹A | null›*
