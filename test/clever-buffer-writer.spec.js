// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _                        = require('lodash');
const should                   = require('should');
const CleverBufferWriter       = require(`${SRC}/clever-buffer-writer`);
const { writeToStupidBuffer,
  writeToCleverBuffer }  = require('./support/test-helper');
const specHelper               = require('./spec-helper');

describe('CleverBufferWriter', function() {

  const powed = v => Math.pow(2, v) - 1;

  // generates a unsigned range, e.g [0, 1, 3, 7, 15, 31, 63, 127, 255]
  const unsignedValues = count => _.map(_.range(0, count+1, 1), powed);

  // generates a signed range, e.g [-127, -63, -31, -15, -7, -3, -1, 0, 1, 3, 7, 15, 31, 63, 127]
  const signedValues = function(count) {
    const values = _.map(_.range(0, count, 1), powed);
    // flip the signs, reverse it, remove the extra '0', and concat the orig values
    return _.concat(_.map(values, v => v * -1).reverse().slice(0,-1), values);
  };

  it('should write Uint8', function() {
    const numberOfBytesPerWord = 1;
    const values = unsignedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt8(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt8(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write int8', function() {
    const numberOfBytesPerWord = 1;
    const values = signedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt8(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeInt8(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write Uint16 Little Endian', function() {
    const numberOfBytesPerWord = 2;
    const values = unsignedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt16LE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt16(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write int16 Little Endian', function() {
    const numberOfBytesPerWord = 2;
    const values = signedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt16LE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeInt16(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write Uint16 Big Endian', function() {
    const numberOfBytesPerWord = 2;
    const values = unsignedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt16BE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt16(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write int16 Big Endian', function() {
    const numberOfBytesPerWord = 2;
    const values = signedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt16BE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeInt16(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write Uint32 Little Endian', function() {
    const numberOfBytesPerWord = 4;
    const values = unsignedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt32LE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt32(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write int32 Little Endian', function() {
    const numberOfBytesPerWord = 4;

    const values = signedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt32LE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, false, (cleverBufferWriter, value) => cleverBufferWriter.writeInt32(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write Uint32 Big Endian', function() {
    const numberOfBytesPerWord = 4;

    const values = unsignedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeUInt32BE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeUInt32(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write int32 Big Endian', function() {
    const numberOfBytesPerWord = 4;

    const values = signedValues(8 * numberOfBytesPerWord);

    const buf = writeToStupidBuffer(values, numberOfBytesPerWord, (buf, value, offset) => buf.writeInt32BE(value, offset, true));

    const cleverBuffer = writeToCleverBuffer(values, numberOfBytesPerWord, true, (cleverBufferWriter, value) => cleverBufferWriter.writeInt32(value));

    return buf.should.eql(cleverBuffer);
  });

  it('should write bytes', function() {
    const buf = Buffer.alloc(11);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeBytes([0x20, 0x6d, 0x65, 0x20, 0x57, 0x6f, 0x72, 0x72, 0x79, 0x21]);
    cleverBufferWriter.writeBytes([0x20]);
    cleverBufferWriter.writeBytes([0x57, 0x68, 0x61, 0x74], {offset: 2});

    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]));
});

  it('should skip bytes', function() {
    const buf = Buffer.alloc(4);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt8(0x10);
    cleverBufferWriter.skip(2);
    cleverBufferWriter.writeUInt8(0x20);

    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([0x10, 0x00, 0x00, 0x20]));
});

  it('should skip to set offset', function() {
    const buf = Buffer.alloc(4);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt8(0x10);
    cleverBufferWriter.skipTo(2);
    cleverBufferWriter.writeUInt8(0x20);

    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([0x10, 0x00, 0x20, 0x00]));
});

  it('should write string', function() {
    const buf = Buffer.alloc(32);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    let len = cleverBufferWriter.writeString('EXPECTED RETURN!');
    len += cleverBufferWriter.writeString('RETURN OF $2.00!');
    len.should.eql(32);
    cleverBufferWriter.getOffset().should.eql(32);
    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
      0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
    ]));
});

  it('should write string in multi-byte encodings', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('héllo', {encoding: 'utf-8'});
    len.should.eql(6);
    cleverBufferWriter.getOffset().should.eql(6);
    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x68, 0xc3, 0xa9, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00, 0x00
    ]));
});

  // because of buffer.write(value, offset, length, encoding)
  it('takes the encoding param into account, even if length is not specified', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('héllo', {encoding: 'utf16le'});
    return len.should.eql(10);
  });

  it('should write partial strings using length (number of bytes)', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('HELLOWORLD', {length: 5});
    //Only writes hello
    len.should.eql(5);
    cleverBufferWriter.getOffset().should.eql(5);
    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x48, 0x45, 0x4C, 0x4C, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x00
    ]));
});

  it('should write partial multi-byte strings using length (number of bytes)', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('héllo', {length: 4});
    // Only writes hél
    len.should.eql(4);
    cleverBufferWriter.getOffset().should.eql(4);
    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x68, 0xc3, 0xa9, 0x6c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]));
});

  it('does not write partially encoded characters', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    const len = cleverBufferWriter.writeString('éè', {length: 3});
    // Only writes é
    len.should.eql(2);
    cleverBufferWriter.getOffset().should.eql(2);
    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0xc3, 0xa9, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]));
});

  it('should write string at a specified offset', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeString('HELLO', {offset: 5});

    //Writes hello starting at offset 5
    cleverBufferWriter.getOffset().should.eql(0);
    return cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
    ]));
});

  it('should be able to writeUInt8 at a specific offset', function() {
    const buf = Buffer.alloc(5);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt8(1);
    cleverBufferWriter.writeUInt8(2);
    cleverBufferWriter.writeUInt8(3);
    cleverBufferWriter.writeUInt8(4);
    cleverBufferWriter.writeUInt8(5);
    cleverBufferWriter.writeUInt8(6, 1);

    //Writes 6 at position 1
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x01, 0x06, 0x03, 0x04, 0x05
    ]));
    //Does not increment the offset
    return cleverBufferWriter.getOffset().should.eql(5);
  });

  it('should be able to writeUInt16 at a specific offset', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBufferWriter = new CleverBufferWriter(buf);
    cleverBufferWriter.writeUInt16(1);
    cleverBufferWriter.writeUInt16(2);
    cleverBufferWriter.writeUInt16(3);
    cleverBufferWriter.writeUInt16(4);
    cleverBufferWriter.writeUInt16(5);
    cleverBufferWriter.writeUInt16(6, 2);

    //Writes 6 at position 2
    cleverBufferWriter.getBuffer().should.eql(Buffer.from([
      0x01, 0x00, 0x06, 0x00, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00
    ]));
    //Does not increment the offset
    return cleverBufferWriter.getOffset().should.eql(10);
  });

  it('should write Uint64 little endian MAX', function() {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64('18446744073709551615');
    return cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]));
});

  it('should write Uint64 big endian MAX', function() {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, {bigEndian:true});
    cleverBuffer.writeUInt64('18446744073709551615');
    return cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]));
});

  it('should write Uint64 little endian', function() {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64('4294967366');
    return cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00
    ]));
});

  it('should write Uint64 big endian', function() {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, {bigEndian:true});
    cleverBuffer.writeUInt64('4294967366');
    return cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46
    ]));
});

  it('should write int64 little endian', function() {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeInt64('-1');
    return cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]));
});

  it('should write int64 big endian', function() {
    const buf = Buffer.alloc(8);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf, {bigEndian:true});
    cleverBuffer.writeInt64('-1');
    return cleverBuffer.getBuffer().should.eql(Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]));
});

  it('should write Uint64 at specified offset, currentOffset should not increment', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.writeUInt64('18446744073709551615', 2);
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]));
    return cleverBuffer.getOffset().should.eql(0);
  });

  it('should write Uint64 at current offset, currentOffset should increment', function() {
    const buf = Buffer.alloc(10);
    buf.fill(0);
    const cleverBuffer = new CleverBufferWriter(buf);
    cleverBuffer.skip(1);
    cleverBuffer.writeUInt64('18446744073709551615');
    cleverBuffer.getBuffer().should.eql(Buffer.from([
      0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00
    ]));
    return cleverBuffer.getOffset().should.eql(9);
  });

  it('does nothing silently when writing past the length', function() {
    const buf = Buffer.from([0x0]);
    const cleverBuffer = new CleverBufferWriter(buf, {noAssert: true});
    cleverBuffer.writeUInt8(1);
    cleverBuffer.writeUInt8(1);
    return buf.should.eql(Buffer.from([0x1]));
});

  it('throws an exception when writing past the length with noAssert off', function() {
    const buf = Buffer.from([0x1]);
    const cleverBuffer = new CleverBufferWriter(buf, {noAssert: false});
    cleverBuffer.writeUInt8(1);
    return ((() => cleverBuffer.writeUInt8(1))).should.throw();
  });

  describe('leading zeros are handling correctly', () => Array.from(specHelper.cartesianProduct({
    size:      [1, 2, 4, 8],
    unsigned:  [false, true],
    bigEndian: [false, true]
  })).map((testCase) =>
    ((({size, unsigned, bigEndian}) => it(`should correctly handle leading zero for ${JSON.stringify(testCase)}`, function() {
      let f;
      const buf1 = Buffer.alloc(size);
      const buf2 = Buffer.alloc(size);

      const cleverBuffer1 = new CleverBufferWriter(buf1, {
        bigEndian,
        noAssert: false
      }
      );

      const cleverBuffer2 = new CleverBufferWriter(buf2, {
        bigEndian,
        noAssert: false
      }
      );

      if (unsigned) {
        f = `writeUInt${size*8}`;
        cleverBuffer1[f]("123");
        cleverBuffer2[f]("00123");
      } else {
        f = `writeInt${size*8}`;
        cleverBuffer1[f]("-123");
        cleverBuffer2[f]("-00123");
      }

      return buf1.should.eql(buf2);
    })))(testCase)));

  describe('check we handle numbers and strings identically', () => Array.from(specHelper.cartesianProduct({
    size:      [1, 2, 4, 8],
    unsigned:  [false, true],
    bigEndian: [false, true]
  })).map((testCase) =>
    ((({size, unsigned, bigEndian}) => it(`should correctly handle numbers and strings for ${JSON.stringify(testCase)}`, function() {
      let f;
      const buf1 = Buffer.alloc(size);
      const buf2 = Buffer.alloc(size);

      const cleverBuffer1 = new CleverBufferWriter(buf1, {
        bigEndian,
        noAssert: false
      }
      );

      const cleverBuffer2 = new CleverBufferWriter(buf2, {
        bigEndian,
        noAssert: false
      }
      );

      if (unsigned) {
        f = `writeUInt${size*8}`;
        cleverBuffer1[f]("123");
        cleverBuffer2[f](123);
      } else {
        f = `writeInt${size*8}`;
        cleverBuffer1[f]("-123");
        cleverBuffer2[f](-123);
      }

      return buf1.should.eql(buf2);
    })))(testCase)));

  return describe('check only throwing exception for writing negative unsigned integers when noAssert:false', () => Array.from(specHelper.cartesianProduct({
    size:      [1, 2, 4, 8],
    bigEndian: [false, true]
  })).map((testCase) =>
    (function({size, bigEndian}) {
      it(`should throw for noAssert:false ${JSON.stringify(testCase)}`, function() {
        let error;
        const cleverBuffer = new CleverBufferWriter((Buffer.alloc(size)), {
          bigEndian,
          noAssert: false
        }
        );
        try {
          cleverBuffer[`writeUInt${size*8}`]("-1");
        } catch (error1) {
          error = error1;
          error.toString().should.match(/TypeError|RangeError/);
        }
        try {
          return cleverBuffer[`writeUInt${size*8}`](-1);
        } catch (error2) {
          error = error2;
          return error.toString().should.match(/TypeError|RangeError/);
        }
      });

      return it(`should not throw for noAssert:true ${JSON.stringify(testCase)}`, function() {
        const buf = Buffer.alloc(size);
        const cleverBuffer = new CleverBufferWriter(buf, {
          bigEndian,
          noAssert: true
        }
        );
        ((() => cleverBuffer[`writeUInt${size*8}`]("-1"))).should.not.throw();
        return ((() => cleverBuffer[`writeUInt${size*8}`](-1))).should.not.throw();
      });
    })(testCase)));
});
