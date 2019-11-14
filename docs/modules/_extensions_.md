[runtime-type-validation](../README.md) › [Globals](../globals.md) › ["extensions"](_extensions_.md)

# External module: "extensions"

## Index

### Variables

* [url](_extensions_.md#const-url)

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

### `Const` url

• **url**: *[Decoder](../classes/_decoder_.decoder.md)‹string›* =  tString().where((s) => patterns.url.test(s), `expected a URL`)

## Functions

### `Const` chars

▸ **chars**(`length`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`length` | number |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` charsMax

▸ **charsMax**(`max`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`max` | number |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` charsMin

▸ **charsMin**(`min`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` charsRange

▸ **charsRange**(`min`: number, `max`: number): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |
`max` | number |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` matches

▸ **matches**(`pattern`: RegExp): *[Decoder](../classes/_decoder_.decoder.md)‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`pattern` | RegExp |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹string›*

___

### `Const` range

▸ **range**(`min`: number, `max`: number): *[Decoder](../classes/_decoder_.decoder.md)‹number›*

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |
`max` | number |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹number›*

___

###  tEnum

▸ **tEnum**<**T**>(...`values`: T[]): *[Decoder](../classes/_decoder_.decoder.md)‹T›*

**Type parameters:**

▪ **T**: *string | number*

**Parameters:**

Name | Type |
------ | ------ |
`...values` | T[] |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹T›*

___

###  tNullable

▸ **tNullable**<**A**>(`decoder`: [Decoder](../classes/_decoder_.decoder.md)‹A›): *[Decoder](../classes/_decoder_.decoder.md)‹A | null›*

**Type parameters:**

▪ **A**

**Parameters:**

Name | Type |
------ | ------ |
`decoder` | [Decoder](../classes/_decoder_.decoder.md)‹A› |

**Returns:** *[Decoder](../classes/_decoder_.decoder.md)‹A | null›*
