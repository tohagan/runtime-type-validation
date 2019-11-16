[runtime-validator](../README.md) › [Globals](../globals.md) › ["constraints"](_constraints_.md)

# External module: "constraints"

## Index

### Functions

* [chars](_constraints_.md#const-chars)
* [charsMax](_constraints_.md#const-charsmax)
* [charsMin](_constraints_.md#const-charsmin)
* [charsRange](_constraints_.md#const-charsrange)
* [falsy](_constraints_.md#const-falsy)
* [httpUrl](_constraints_.md#const-httpurl)
* [matches](_constraints_.md#const-matches)
* [nullable](_constraints_.md#nullable)
* [range](_constraints_.md#const-range)
* [truthy](_constraints_.md#const-truthy)

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

### `Const` falsy

▸ **falsy**(): *[Validator](../classes/_validator_.validator.md)‹any›*

**Returns:** *[Validator](../classes/_validator_.validator.md)‹any›*

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

###  nullable

▸ **nullable**<**A**>(`validator`: [Validator](../classes/_validator_.validator.md)‹A›): *[Validator](../classes/_validator_.validator.md)‹A | null›*

Allow null or the type checked value.

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validator` | [Validator](../classes/_validator_.validator.md)‹A› |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹A | null›*

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

### `Const` truthy

▸ **truthy**(): *[Validator](../classes/_validator_.validator.md)‹any›*

**Returns:** *[Validator](../classes/_validator_.validator.md)‹any›*
