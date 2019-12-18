const defaults = require('./defaults');

class CleverBuffer {

  constructor(buffer, options = {}) {

    this._executeAndIncrement = this._executeAndIncrement.bind(this);
    this.getBuffer = this.getBuffer.bind(this);
    this.getOffset = this.getOffset.bind(this);
    this.skip = this.skip.bind(this);
    this.skipTo = this.skipTo.bind(this);
    this.trim = this.trim.bind(this);
    this.slice = this.slice.bind(this);
    this.buffer = buffer;

    ({ offset: this.offset, noAssert: this.noAssert, bigEndian: this.bigEndian } = defaults(options, {
      offset: 0,
      noAssert: true,
      bigEndian: false
    }
    ));
  }

  _executeAndIncrement(bigEndianFunction, littleEndianFunction, value, _offset) {
    let val;
    if (this.bigEndian) {
      val = bigEndianFunction(_offset != null ? _offset : this.offset, this.noAssert);
    } else {      
      val = littleEndianFunction(_offset != null ? _offset : this.offset, this.noAssert);
    }
    if (_offset === undefined) { this.offset += value; }
    return val;
  }

  getBuffer() {
    return this.buffer;
  }

  getOffset() {
    return this.offset;
  }

  skip(bytesToSkip) {
    this.offset += bytesToSkip;
  }

  skipTo(offset) {
    this.offset = offset;
  }

  trim() {
    return this.buffer.slice(0, this.offset);
  }

  slice(start, end) {
    const realEnd = end ? this.offset + end : this.buffer.length;
    return this.buffer.slice(this.offset + (start || 0), realEnd);
  }
}

module.exports = CleverBuffer;
