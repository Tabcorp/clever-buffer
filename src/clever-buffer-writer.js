const ref             = require('ref-napi');

const defaults        = require('./defaults');
const CleverBuffer    = require('./clever-buffer-common');

const checkInt = (buffer, value, offset, ext, max, min) => {
  if ((value > max) || (value < min)) {
    throw new TypeError('"value" argument is out of bounds');
  }
  if ((offset + ext) > buffer.length) {
    throw new RangeError('Index out of range');
  }
};

class CleverBufferWriter extends CleverBuffer {

  constructor(buffer, options = {}) {
    super(buffer, options);
  }

// START NODE 8 LEGACY BUFFER FUNCTIONS
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

  legacyWriteUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 1, 0xff, 0);
    }
    this.buffer[offset] = value;
    return offset + 1;
  }

  legacyWriteUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 2, 0xffff, 0);
    }
    this.buffer[offset] = value;
    this.buffer[offset + 1] = value >>> 8;
    return offset + 2;
  }

  legacyWriteUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 2, 0xffff, 0);
    }
    this.buffer[offset] = value >>> 8;
    this.buffer[offset + 1] = value;
    return offset + 2;
  }

  legacyWriteUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 4, 0xffffffff, 0);
    }
    this.buffer[offset + 3] = value >>> 24;
    this.buffer[offset + 2] = value >>> 16;
    this.buffer[offset + 1] = value >>> 8;
    this.buffer[offset] = value;
    return offset + 4;
  }

  legacyWriteUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 4, 0xffffffff, 0);
    }
    this.buffer[offset] = value >>> 24;
    this.buffer[offset + 1] = value >>> 16;
    this.buffer[offset + 2] = value >>> 8;
    this.buffer[offset + 3] = value;
    return offset + 4;
  }

  legacyWriteInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 1, 0x7f, -0x80);
    }
    this.buffer[offset] = value;
    return offset + 1;
  }

  legacyWriteInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 2, 0x7fff, -0x8000);
    }
    this.buffer[offset] = value;
    this.buffer[offset + 1] = value >>> 8;
    return offset + 2;
  }

  legacyWriteInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 2, 0x7fff, -0x8000);
    }
    this.buffer[offset] = value >>> 8;
    this.buffer[offset + 1] = value;
    return offset + 2;
  }

  legacyWriteInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 4, 0x7fffffff, -0x80000000);
    }
    this.buffer[offset] = value;
    this.buffer[offset + 1] = value >>> 8;
    this.buffer[offset + 2] = value >>> 16;
    this.buffer[offset + 3] = value >>> 24;
    return offset + 4;
  }

  legacyWriteInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkInt(this.buffer, value, offset, 4, 0x7fffffff, -0x80000000);
    }
    this.buffer[offset] = value >>> 24;
    this.buffer[offset + 1] = value >>> 16;
    this.buffer[offset + 2] = value >>> 8;
    this.buffer[offset + 3] = value;
    return offset + 4;
  }
// END NODE 8 LEGACY BUFFER FUNCTIONS

  writeUInt8(value, _offset) {
    return this.legacyWriteUInt8(value, _offset != null ? _offset : this.offset++, this.noAssert);
  }

  writeInt8(value, _offset) {
    return this.legacyWriteInt8(value, _offset != null ? _offset : this.offset++, this.noAssert);
  }

  writeUInt16(value, _offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyWriteUInt16BE(value, offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyWriteUInt16LE(value, offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  writeInt16(value, _offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyWriteInt16BE(value, offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyWriteInt16LE(value, offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  writeUInt32(value, _offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyWriteUInt32BE(value, offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyWriteUInt32LE(value, offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  writeInt32(value, _offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyWriteInt32BE(value, offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyWriteInt32LE(value, offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  writeUInt64(value, _offset) {
    const offset = _offset != null ? _offset : this.offset;
    // ref treats leading zeros as denoting octal numbers, so we want to strip
    // them out to prevent this behaviour
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (!this.noAssert && !/^\d+$/.test(value)) {
      throw new RangeError('"value" argument is out of bounds');
    }
    value = value.replace(/^0+(\d)/, '$1');
    if (this.bigEndian) {
      ref.writeUInt64BE(this.buffer, offset, value);
    } else {
      ref.writeUInt64LE(this.buffer, offset, value);
    }
    if (_offset === undefined) { return this.offset += 8; }
  }

  writeInt64(value, _offset) {
    const offset = _offset != null ? _offset : this.offset;
    if (typeof value === 'number') {
      value = value.toString();
    }
    if (!this.noAssert && !/^-?\d+$/.test(value)) {
      throw new RangeError('"value" argument is out of bounds');
    }
    // ref treats leading zeros as denoting octal numbers, so we want to strip
    // them out to prevent this behaviour.
    // Also, ref treats '-0123' as a negative octal
    value = value.replace(/^(-?)0+(\d)/, '$1$2');
    if (this.bigEndian) {
      ref.writeInt64BE(this.buffer, offset, value);
    } else {
      ref.writeInt64LE(this.buffer, offset, value);
    }
    if (_offset === undefined) { return this.offset += 8; }
  }

  writeString(value, options = {}) {
    const offsetSpecified = (options.offset != null);
    let { length, offset, encoding } = defaults(options, {
      length: null,
      offset: this.offset,
      encoding: 'utf-8'
    }
    );
    if (length != null) {
      length = this.buffer.write(value, offset, length, encoding);
    } else {
      length = this.buffer.write(value, offset, encoding);
    }
    if (!offsetSpecified) { this.offset += length; }
    return length;
  }

  writeBytes(value, options = {}) {
    const offsetSpecified = (options.offset != null);
    const offset = options.offset != null ? options.offset : this.offset;
    Buffer.from(value).copy(this.buffer, offset);
    if (!offsetSpecified) { return this.offset += value.length; }
  }
}

module.exports = CleverBufferWriter;
