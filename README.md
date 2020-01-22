# clever-buffer


[![NPM](http://img.shields.io/npm/v/clever-buffer.svg?style=flat)](https://npmjs.org/package/clever-buffer)
[![License](http://img.shields.io/npm/l/clever-buffer.svg?style=flat)](https://github.com/Tabcorp/clever-buffer)

[![Build Status](http://img.shields.io/travis/Tabcorp/clever-buffer.svg?style=flat)](http://travis-ci.org/Tabcorp/clever-buffer)
[![Dependencies](http://img.shields.io/david/Tabcorp/clever-buffer.svg?style=flat)](https://david-dm.org/Tabcorp/clever-buffer)
[![Dev dependencies](http://img.shields.io/david/dev/Tabcorp/clever-buffer.svg?style=flat)](https://david-dm.org/Tabcorp/clever-buffer) [![Greenkeeper badge](https://badges.greenkeeper.io/Tabcorp/clever-buffer.svg)](https://greenkeeper.io/)

Buffer write and read utilities.

CleverBuffer adds functionality that is missing from the node Buffer class

* Keeps track of the offset for you
* One time specification of endian-ness and whether to assert on buffer length
* 64 bit integer support. We use [ref](https://github.com/node-ffi-napi/ref-napi) under the hood for our 64 bit numbers

## Installation
``` js
npm install clever-buffer
```

_NOTE_: Examples below in javascript

## Reader Usage

#### Requiring the reader in your project
``` js
{ CleverBufferReader } = require('clever-buffer');
```

#### new CleverBufferReader existingBuffer, [options]
* existingBuffer Buffer
* options
  * offset Number, Optional, Default: 0
  * noAssert Boolean, Optional, Default: true
  * bigEndian Boolean, Optional, Default: false

Allocates a new CleverBufferReader with an internal buffer of the specified existingBuffer
``` js
var reader = new CleverBufferReader(existingBuffer, { offset: 0, noAssert: true, bigEndian: false});
```

#### reader.getUInt8([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 8bit Integer from the current offset

``` js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt8()); // 255
console.log(reader.getUInt8()); // 2
```

#### reader.getInt8([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 8bit Integer from the current offset

``` js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt8()); // -1
console.log(reader.getInt8()); // 2
```

#### reader.getUInt16([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 16bit Integer from the current offset.

``` js
var buf = Buffer.from([0xFF, 0xFF, 0x02, 0x00]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt16()); // 65535
console.log(reader.getUInt16()); // 2
```

#### reader.getInt16([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 16bit Integer from the current offset

```js
var buf = Buffer.from([0xFF, 0xFF, 0x02, 0x00]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt16()); # -1
console.log(reader.getInt16()); # 2
```

#### reader.getUInt32([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 32bit Integer from the current offset.

``` js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt32()); // 4294967295
```

#### reader.getInt32([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 32bit Integer from the current offset

``` js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt32()); // -1
```

#### reader.getUInt64([offset])
* offset Number, Optional, Default: current buffer position

Returns an Unsigned 64bit Integer from the current offset.

The value will be returned as a string


```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF,0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getUInt64()); // "18446744073709551615"
```

#### reader.getInt64([offset])
* offset Number, Optional, Default: current buffer position

Returns a Signed 64bit Integer from the current offset

The value will be returned as a string


```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF,0xFF, 0xFF, 0xFF, 0xFF]);
var reader = new CleverBufferReader(buf);
console.log(reader.getInt64()); // "-1"
```

#### reader.getString([options])
* options Optional
  * length Number, Optional, Default: 0
  * offset Number, Optional, Default: current offset. If an offset is specified the current offset will not be incremented
  * encoding String, Optional, Default: 'utf-8'

Returns utf-8 encoded string of specified length

```js
var buf = Buffer.from([0x48, 0x45, 0x4C, 0x4C, 0x4F]);
var reader = new CleverBufferReader(buf);
console.log(reader.getString(length: 5)); // "HELLO"
```

## Writer Usage

#### Requiring the writer in your project
```js
{ CleverBufferWriter } = require('clever-buffer');
```

#### new CleverBufferWriter existingBuffer, [options]
* existingBuffer Buffer
* options
  * offset Number, Optional, Default: 0
  * noAssert Boolean, Optional, Default: true
  * bigEndian Boolean, Optional, Default: false

Allocates a new CleverBufferWriter with an internal buffer of the specified existingBuffer
```js
var writer = new CleverBufferWriter(existingBuffer, {offset: 0, noAssert: true, bigEndian: false});
```

#### writer.writeUInt8(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Unsigned 8bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(2);
var writer = new CleverBufferWriter(buf);
writer.writeUInt8(255);
writer.writeUInt8(2);
console.log(buf); // [0xFF, 0x02]
```

#### writer.writeInt8(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an signed 8bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(2);
var writer = new CleverBufferWriter(buf);
writer.writeInt8(-1);
writer.writeInt8(2);
console.log(buf); // [0xFF, 0x02]
```

#### writer.writeUInt16(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Unsigned 16bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(4);
var writer = new CleverBufferWriter(buf);
writer.writeUInt16(65535);
writer.writeUInt16(2);
console.log(buf); // [0xFF, 0xFF, 0x02, 0x00]
```

#### writer.writeInt16(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Signed 16bit Integer to the specified/current offset

```js
buf = Buffer.alloc(4);
writer = new CleverBufferWriter(buf);
writer.writeInt16(-1);
writer.writeInt16(2);
console.log(buf); // [0xFF, 0xFF, 0x02, 0x00]
```
#### writer.writeUInt32(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an Unsigned 32bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(4);
var writer = new CleverBufferWriter(buf);
writer.writeUInt32(4294967295);
console.log(buf); // [0xFF, 0xFF, 0xFF, 0xFF]
```

#### writer.writeInt32(value, [offset])
* value Number
* offset Number, Optional, Default: current buffer position

Writes an signed 32bit Integer to the specified/current offset

```js
var buf = Buffer.alloc(4);
var writer = new CleverBufferWriter(buf);
writer.writeInt32(-1);
console.log(buf); // [0xFF, 0xFF, 0xFF, 0xFF]
```
#### writer.writeString(value, [options])
* value String
* options Optional
  * length Number, Optional, number of bytes to write. Note this can be greater than `value.length` for non ASCII encodings. If not specified, will default to the right number of bytes for the chosen encoding.
  * offset Number, Optional, Default: current offset. If an offset is specified the current offset will not be incremented
  * encoding String, Optional, Default: 'utf-8'
* returns the number of bytes written

Writes string to the buffer

```js
var buf =  Buffer.alloc(8);
var writer = new CleverBufferWriter(buf);
var len = writer.writeString("héllo");
console.log(len, buf); // 6, [0x68, 0xc3, 0xa9, 0x6c, 0x6c, 0x6f, 0x00, 0x00]
```

## Common Functionality
The following is common to CleverBufferReader and CleverBufferWriter (The examples only show reader)

#### reader.getOffset()
Gets the current offset of the buffer
```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getOffset()); // 0
reader.getUInt8();
console.log(reader.getOffset()); // 1
reader.getUInt8();
console.log(reader.getOffset()); // 2  
```

#### reader.skip(bytes)
* bytes Number

Skips the current offset forward the specified bytes amount

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getOffset()); // 0
reader.skip(2);
console.log(reader.getOffset()); // 2  
```

#### reader.skipTo(offset)
* offset Number

Skips to the specified offset

```js
var buf = Buffer.from([0xFF, 0xFF, 0xFF, 0x01]);
var reader = new CleverBufferReader(buf);
console.log(reader.getOffset()); // 0
reader.skipTo(3);
console.log(reader.getOffset()); // 3  
```

#### reader.getBuffer()
Will return the underlying buffer so you can perform actions directly on it

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
console.log(reader.getBuffer()[1]); // 2
```

#### reader.trim()
Will return a buffer slice from the start of the buffer to the current offset

```js
var buf = Buffer.from([0xFF, 0x02]);
var reader = new CleverBufferReader(buf);
reader.getUInt8();
console.log(reader.trim()); // [0xFF]
console.log(buf);           // [0xFF, 0x02]
```

## Testing


```
npm test
```
