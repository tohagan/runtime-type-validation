[runtime-validator](../README.md) › [Globals](../globals.md) › ["constraints"](_constraints_.md)

# External module: "constraints"

## Index

### Functions

* [chars](_constraints_.md#chars)
* [charsMax](_constraints_.md#charsmax)
* [charsMin](_constraints_.md#charsmin)
* [charsRange](_constraints_.md#charsrange)
* [falsy](_constraints_.md#falsy)
* [httpUrl](_constraints_.md#httpurl)
* [matches](_constraints_.md#matches)
* [nullable](_constraints_.md#nullable)
* [range](_constraints_.md#range)
* [truthy](_constraints_.md#truthy)

## Functions

###  chars

▸ **chars**(`length`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having exactly `length` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

###  charsMax

▸ **charsMax**(`max`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having a maximum of `max` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`max` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

###  charsMin

▸ **charsMin**(`min`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having a minimum of `min` characters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

###  charsRange

▸ **charsRange**(`min`: number, `max`: number): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string having a `length` between `min` .. `max` (inclusive).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number | - |
`max` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

###  falsy

▸ **falsy**(): *[Validator](../classes/_validator_.validator.md)‹any›*

Matches any falsy value.

**Returns:** *[Validator](../classes/_validator_.validator.md)‹any›*

___

###  httpUrl

▸ **httpUrl**(): *[Validator](../classes/_validator_.validator.md)‹string›*

Matches a string containg a HTTP or HTTPS URL.

**Returns:** *[Validator](../classes/_validator_.validator.md)‹string›*

___

###  matches

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

###  range

▸ **range**(`min`: number, `max`: number): *[Validator](../classes/_validator_.validator.md)‹number›*

Matches a number between `min` .. `max` (inclusive).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`min` | number | - |
`max` | number |   |

**Returns:** *[Validator](../classes/_validator_.validator.md)‹number›*

___

###  truthy

▸ **truthy**(): *[Validator](../classes/_validator_.validator.md)‹any›*

Matches any truthy value

**Returns:** *[Validator](../classes/_validator_.validator.md)‹any›*
