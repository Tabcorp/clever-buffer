/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should             = require('should');
const CleverBufferReader = require(`${SRC}/clever-buffer-reader`);
const specHelper         = require('./spec-helper');

describe('CleverBufferReader', function() {

  let testCase;
  let buf = Buffer.from([
      0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
      0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
  ]);

  it('should get Uint8', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    return __range__(0, (buf.size - 1), true).map((i) =>
      cleverBuffer.getUInt8().should.eql(buf.readUInt8(i, true)));
  });

  it('should get int8', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from(__range__(0, Math.pow(2,8), false)));
    return __range__(0, (buf.size - 1), true).map((i) =>
      cleverBuffer.getInt8().should.eql(buf.readInt8(i, true)));
  });

  it('should get Uint16 Little Endian', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    return __range__(0, ((buf.size/2) - 1), true).map((i) =>
      cleverBuffer.getUInt16().should.eql(buf.readUInt16LE(i, true)));
  });

  it('should get Uint16 Big Endian', function() {
    const cleverBuffer = new CleverBufferReader(buf, { bigEndian:true });
    return __range__(0, ((buf.size/2) - 1), true).map((i) =>
      cleverBuffer.getUInt16().should.eql(buf.readUInt16BE(i, true)));
  });

  it('should get int16 Little Endian', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from(__range__(0, Math.pow(2,16), false)));
    return __range__(0, ((buf.size/2) - 1), true).map((i) =>
      cleverBuffer.getInt16().should.eql(buf.readInt16LE(i, true)));
  });

  it('should get int16 Big Endian', function() {
    const cleverBuffer = new CleverBufferReader((Buffer.from(__range__(0, Math.pow(2,16), false))), { bigEndian:true });
    return __range__(0, ((buf.size/2) - 1), true).map((i) =>
      cleverBuffer.getInt16().should.eql(buf.readInt16BE(i, true)));
  });

  it('should get Uint32 Little Endian', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    return __range__(0, ((buf.size/4) - 1), true).map((i) =>
      cleverBuffer.getUInt32().should.eql(buf.readUInt32LE(i, true)));
  });

  it('should get Uint32 Big Endian', function() {
    const cleverBuffer = new CleverBufferReader(buf, { bigEndian:true });
    return __range__(0, ((buf.size/4) - 1), true).map((i) =>
      cleverBuffer.getUInt32().should.eql(buf.readUInt32BE(i, true)));
  });

  it('should get int32 Little Endian', function() {
    const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
    const cleverBuffer = new CleverBufferReader(mybuf);
    return cleverBuffer.getInt32().should.eql((cleverBuffer.getBuffer().readInt32LE(0, true)));
  });

  it('should get int32 Big Endian', function() {
    const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
    const cleverBuffer = new CleverBufferReader(mybuf, { bigEndian:true });
    return cleverBuffer.getInt32().should.eql((cleverBuffer.getBuffer().readInt32BE(0, true)));
  });

  it('should get Uint64 little endian MAX', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
    return cleverBuffer.getUInt64().should.eql('18446744073709551615');
  });

  it('should get Uint64 big endian MAX', function() {
    const cleverBuffer = new CleverBufferReader((Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])), { bigEndian:true });
    return cleverBuffer.getUInt64().should.eql('18446744073709551615');
  });

  it('should get Uint64 little endian', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]));
    return cleverBuffer.getUInt64().should.eql('4294967366');
  });

  it('should get Uint64 big endian', function() {
    const cleverBuffer = new CleverBufferReader((Buffer.from([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46])), { bigEndian:true });
    return cleverBuffer.getUInt64().should.eql('4294967366');
  });

  it('should get int64 little endian', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
    return cleverBuffer.getInt64().should.eql('-1');
  });

  it('should get int64 big endian', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from(([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), { bigEndian:true }));
    return cleverBuffer.getInt64().should.eql('-1');
  });

  it('should get String', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getString({length:16}).should.eql('EXPECTED RETURN!');
    return cleverBuffer.getString({length:16}).should.eql('RETURN OF $2.00!');
  });

  it('should return empty String when length is 0', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    return cleverBuffer.getString().should.eql('');
  });

  it('buffer should not be modified', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(0, true));
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(1, true));
    return cleverBuffer.getBuffer().should.eql(buf);
  });

  it('internal offset should be incremented', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(0, true));
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(1, true));
    return cleverBuffer.getOffset().should.eql(2);
  });

  it('should skip bytes', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    const returnVal = cleverBuffer.skip(4);
    (typeof returnVal).should.eql('undefined'); // Skipping shouldn't return a value
    return cleverBuffer.getOffset().should.eql(4);
  });

  it('should skip to set offset', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.skip(4);
    cleverBuffer.getOffset().should.eql(4);
    cleverBuffer.skipTo(6);
    return cleverBuffer.getOffset().should.eql(6);
  });

  it('should be able to readUInt8 at a specific offset', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x01, 0x02, 0x03, 0x04, 0x05
    ]));
    cleverBuffer.getUInt8(3).should.eql(4);
    return cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should be able to readUInt16 at a specific offset', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x01, 0x02, 0x03, 0x00, 0x05
    ]));
    cleverBuffer.getUInt16(2).should.eql(3);
    return cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should get Uint64 at a specific offset', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
    cleverBuffer.getUInt64(2).should.eql('18446744073709551615');
    return cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should get string of specified length at a specified offset', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
    ]));
    cleverBuffer.getString({length:5,offset: 5}).should.eql('HELLO');

    return cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should get bytes', function() {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
    ]));
    cleverBuffer.getBytes({offset: 2, length: 9}).should.eql([0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]);
    cleverBuffer.getBytes({length: 4}).should.eql([0x20, 0x6d, 0x57, 0x68]);
    return cleverBuffer.getBytes({length: 1}).should.eql([0x61]);
});

  it('should return <undefined> when reading past the length', function() {
    buf = Buffer.from([0x1]);
    const cleverBuffer = new CleverBufferReader(buf);
    should.equal(cleverBuffer.getUInt8(), 1);
    return should.equal(typeof cleverBuffer.getUInt8(), 'undefined');
  });

  const testCases = specHelper.cartesianProduct({
    size:      [1, 2, 4, 8],
    unsigned:  [false, true],
    bigEndian: [false, true],
    offset:    [undefined, 20]});

  for (testCase of Array.from(testCases)) {
    ((({size, unsigned, bigEndian, offset}) => it(`should throw RangeError when reading past the length for ${JSON.stringify(testCase)}`, function() {
      buf = Buffer.alloc(((offset != null ? offset : 0) + size) - 1);

      const cleverBuffer = new CleverBufferReader(buf, {
        bigEndian,
        noAssert: false
      }
      );

      const f = unsigned ? `getUInt${size*8}` : `getInt${size*8}`;
      return ((() => cleverBuffer[f](offset))).should.throw(RangeError);
    })))(testCase);
  }

  return (() => {
    const result = [];
    for (testCase of Array.from(testCases)) {
      result.push(((({size, unsigned, bigEndian, offset}) => it(`should not throw RangeError when reading up to the length for ${JSON.stringify(testCase)}`, function() {
        buf = Buffer.alloc((offset != null ? offset : 0) + size);

        const cleverBuffer = new CleverBufferReader(buf, {
          bigEndian,
          noAssert: false
        }
        );

        const f = unsigned ? `getUInt${size*8}` : `getInt${size*8}`;
        return ((() => cleverBuffer[f](offset))).should.not.throw();
      })))(testCase));
    }
    return result;
  })();
});

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}