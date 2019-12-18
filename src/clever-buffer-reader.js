const ref             = require('ref-napi');

const defaults        = require('./defaults');
const CleverBuffer    = require('./clever-buffer-common');

const checkOffset = (offset, ext, length) => {
  if ((offset + ext) > length) {
    throw new RangeError('Index out of range');
  }
};

class CleverBufferReader extends CleverBuffer {

  constructor(buffer, options) {
    super(buffer, options);
    this.getUInt8 = this.getUInt8.bind(this);
    this.getInt8 = this.getInt8.bind(this);
    this.getUInt16 = this.getUInt16.bind(this);
    this.getInt16 = this.getInt16.bind(this);
    this.getUInt32 = this.getUInt32.bind(this);
    this.getInt32 = this.getInt32.bind(this);
    this.getUInt64 = this.getUInt64.bind(this);
    this.getInt64 = this.getInt64.bind(this);
    this.getString = this.getString.bind(this);
    this.getBytes = this.getBytes.bind(this);
    if (options == null) { options = {}; }
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

  legacyReadUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 1, this.buffer.length);
    }
    return this.buffer[offset];
  }

  legacyReadInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 1, this.buffer.length);
    }
    const val = this.buffer[offset];
    if (!(val & 0x80)) { return val; } else { return ((0xff - val) + 1) * -1; }
  }

  legacyReadUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 2, this.buffer.length);
    }
    return this.buffer[offset] | (this.buffer[offset + 1] << 8);
  }

  legacyReadUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 2, this.buffer.length);
    }
    return (this.buffer[offset] << 8) | this.buffer[offset + 1];
  }

  legacyReadInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 2, this.buffer.length);
    }
    const val = this.buffer[offset] | (this.buffer[offset + 1] << 8);
    if (val & 0x8000) { return val | 0xFFFF0000; } else { return val; }
  }

  legacyReadInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 2, this.buffer.length);
    }
    const val = this.buffer[offset + 1] | (this.buffer[offset] << 8);
    if (val & 0x8000) { return val | 0xFFFF0000; } else { return val; }
  }

  legacyReadUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 4, this.buffer.length);
    }
    return (this.buffer[offset] | (this.buffer[offset + 1] << 8) | (this.buffer[offset + 2] << 16)) + (this.buffer[offset + 3] * 0x1000000);
  }

  legacyReadUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 4, this.buffer.length);
    }
    return (this.buffer[offset] * 0x1000000) + ((this.buffer[offset + 1] << 16) | (this.buffer[offset + 2] << 8) | this.buffer[offset + 3]);
  }

  legacyReadInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 4, this.buffer.length);
    }
    return this.buffer[offset] | (this.buffer[offset + 1] << 8) | (this.buffer[offset + 2] << 16) | (this.buffer[offset + 3] << 24);
  }

  legacyReadInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) {
      checkOffset(offset, 4, this.buffer.length);
    }
    return (this.buffer[offset] << 24) | (this.buffer[offset + 1] << 16) | (this.buffer[offset + 2] << 8) | this.buffer[offset + 3];
  }
// END NODE 8 LEGACY BUFFER FUNCTIONS

  getUInt8(_offset) {
    return this.legacyReadUInt8(_offset || this.offset++, this.noAssert);
  }

  getInt8(_offset) {
    return this.legacyReadInt8(_offset || this.offset++, this.noAssert);
  }

  getUInt16(_offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyReadUInt16BE(offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyReadUInt16LE(offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  getInt16(_offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyReadInt16BE(offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyReadInt16LE(offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 2, _offset);
  }

  getUInt32(_offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyReadUInt32BE(offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyReadUInt32LE(offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  getInt32(_offset) {
    const bigFunction = (offset, noAssert) => {
      return this.legacyReadInt32BE(offset, noAssert);
    };
    const littleFunction = (offset, noAssert) => {
      return this.legacyReadInt32LE(offset, noAssert);
    };
    return this._executeAndIncrement(bigFunction, littleFunction, 4, _offset);
  }

  getUInt64(_offset) {
    let val;
    const offset = _offset || this.offset;
    if (!this.noAssert && ((this.buffer.length - offset) < 8)) {
      throw new RangeError('Index out of range');
    }
    if (this.bigEndian) {
      val = ref.readUInt64BE(this.buffer, offset);
    } else {
      val = ref.readUInt64LE(this.buffer, offset);
    }
    if (_offset === undefined) { this.offset += 8; }
    return val.toString();
  }

  getInt64(_offset) {
    let val;
    const offset = _offset || this.offset;
    if (!this.noAssert && ((this.buffer.length - offset) < 8)) {
      throw new RangeError('Index out of range');
    }
    if (this.bigEndian) {
      val = ref.readInt64BE(this.buffer, offset);
    } else {
      val = ref.readInt64LE(this.buffer, offset);
    }
    if (_offset === undefined) { this.offset += 8; }
    return val.toString();
  }

  getString(options = {}) {
    const offsetSpecified = (options.offset != null);
    const { length, offset, encoding } = defaults(options, {
      length: 0,
      offset: this.offset,
      encoding: 'utf-8'
    }
    );
    if (length === 0) { return ''; }
    const val = this.buffer.toString(encoding, offset, offset + length);
    if (!offsetSpecified) { this.offset += length; }
    return val;
  }

  getBytes(options = {}) {
    const offsetSpecified = (options.offset != null);
    const { length, offset } = defaults(options, {
      length: 0,
      offset: this.offset
    }
    );
    if (length === 0) { return []; }
    const val = Array.prototype.slice.call(this.buffer, offset, offset + length);
    if (!offsetSpecified) { this.offset += length; }
    return val;
  }
}

module.exports = CleverBufferReader;
