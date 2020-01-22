const _ = require('lodash');
const should = require('should');

const CleverBufferReader = require(`${SRC}/clever-buffer-reader`);
const specHelper = require('./spec-helper');

describe('CleverBufferReader', () => {

  let testCase;
  let buf = Buffer.from([
      0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
      0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
  ]);

  it('should get Uint8', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    _.range(0, (buf.size - 1), true).map((i) => cleverBuffer.getUInt8().should.eql(buf.readUInt8(i, true)));
  });

  it('should get int8', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from(_.range(0, Math.pow(2,8), false)));
    _.range(0, (buf.size - 1), true).map((i) => cleverBuffer.getInt8().should.eql(buf.readInt8(i, true)));
  });

  it('should get Uint16 Little Endian', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    _.range(0, ((buf.size/2) - 1), true).map((i) => cleverBuffer.getUInt16().should.eql(buf.readUInt16LE(i, true)));
  });

  it('should get Uint16 Big Endian', () => {
    const cleverBuffer = new CleverBufferReader(buf, { bigEndian:true });
    _.range(0, ((buf.size/2) - 1), true).map((i) => cleverBuffer.getUInt16().should.eql(buf.readUInt16BE(i, true)));
  });

  it('should get int16 Little Endian', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from(_.range(0, Math.pow(2,16), false)));
    _.range(0, ((buf.size/2) - 1), true).map((i) => cleverBuffer.getInt16().should.eql(buf.readInt16LE(i, true)));
  });

  it('should get int16 Big Endian', () => {
    const cleverBuffer = new CleverBufferReader((Buffer.from(_.range(0, Math.pow(2,16), false))), { bigEndian:true });
    _.range(0, ((buf.size/2) - 1), true).map((i) => cleverBuffer.getInt16().should.eql(buf.readInt16BE(i, true)));
  });

  it('should get Uint32 Little Endian', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    _.range(0, ((buf.size/4) - 1), true).map((i) => cleverBuffer.getUInt32().should.eql(buf.readUInt32LE(i, true)));
  });

  it('should get Uint32 Big Endian', () => {
    const cleverBuffer = new CleverBufferReader(buf, { bigEndian:true });
    _.range(0, ((buf.size/4) - 1), true).map((i) => cleverBuffer.getUInt32().should.eql(buf.readUInt32BE(i, true)));
  });

  it('should get int32 Little Endian', () => {
    const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
    const cleverBuffer = new CleverBufferReader(mybuf);
    cleverBuffer.getInt32().should.eql((cleverBuffer.getBuffer().readInt32LE(0, true)));
  });

  it('should get int32 Big Endian', () => {
    const mybuf = Buffer.from([0x88, 0x88, 0xA0, 0xFF]);
    const cleverBuffer = new CleverBufferReader(mybuf, { bigEndian:true });
    cleverBuffer.getInt32().should.eql((cleverBuffer.getBuffer().readInt32BE(0, true)));
  });

  it('should get Uint64 little endian MAX', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
    cleverBuffer.getUInt64().should.eql('18446744073709551615');
  });

  it('should get Uint64 big endian MAX', () => {
    const cleverBuffer = new CleverBufferReader((Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])), { bigEndian:true });
    cleverBuffer.getUInt64().should.eql('18446744073709551615');
  });

  it('should get Uint64 little endian', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]));
    cleverBuffer.getUInt64().should.eql('4294967366');
  });

  it('should get Uint64 big endian', () => {
    const cleverBuffer = new CleverBufferReader((Buffer.from([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46])), { bigEndian:true });
    cleverBuffer.getUInt64().should.eql('4294967366');
  });

  it('should get int64 little endian', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
    cleverBuffer.getInt64().should.eql('-1');
  });

  it('should get int64 big endian', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from(([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), { bigEndian:true }));
    cleverBuffer.getInt64().should.eql('-1');
  });

  it('should get String', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getString({length:16}).should.eql('EXPECTED RETURN!');
    cleverBuffer.getString({length:16}).should.eql('RETURN OF $2.00!');
  });

  it('should return empty String when length is 0', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getString().should.eql('');
  });

  it('buffer should not be modified', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(0, true));
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(1, true));
    cleverBuffer.getBuffer().should.eql(buf);
  });

  it('internal offset should be incremented', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(0, true));
    cleverBuffer.getUInt8().should.eql(buf.readUInt8(1, true));
    cleverBuffer.getOffset().should.eql(2);
  });

  it('should skip bytes', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    const returnVal = cleverBuffer.skip(4);
    (typeof returnVal).should.eql('undefined'); // Skipping shouldn't return a value
    cleverBuffer.getOffset().should.eql(4);
  });

  it('should skip to set offset', () => {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.skip(4);
    cleverBuffer.getOffset().should.eql(4);
    cleverBuffer.skipTo(6);
    cleverBuffer.getOffset().should.eql(6);
  });

  it('should be able to readUInt8 at a specific offset', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x01, 0x02, 0x03, 0x04, 0x05
    ]));
    cleverBuffer.getUInt8(3).should.eql(4);
    cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should be able to readUInt16 at a specific offset', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x01, 0x02, 0x03, 0x00, 0x05
    ]));
    cleverBuffer.getUInt16(2).should.eql(3);
    cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should get Uint64 at a specific offset', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));
    cleverBuffer.getUInt64(2).should.eql('18446744073709551615');
    cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should get string of specified length at a specified offset', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
    ]));
    cleverBuffer.getString({length:5,offset: 5}).should.eql('HELLO');
    cleverBuffer.getOffset().should.eql(0);
  }); //should not increment currentOffset

  it('should get bytes', () => {
    const cleverBuffer = new CleverBufferReader(Buffer.from([
      0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
    ]));
    cleverBuffer.getBytes({offset: 2, length: 9}).should.eql([0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]);
    cleverBuffer.getBytes({length: 4}).should.eql([0x20, 0x6d, 0x57, 0x68]);
    cleverBuffer.getBytes({length: 1}).should.eql([0x61]);
  });

  it('should throw an error when reading past the length', () => {
    buf = Buffer.from([0x1]);
    const cleverBuffer = new CleverBufferReader(buf);
    should.equal(cleverBuffer.getUInt8(), 1);
    (() => cleverBuffer.getUInt8().should.throw());
  });

  it('when noAssert is true: should return <undefined> when reading past the length', () => {
    buf = Buffer.from([0x1]);
    const cleverBuffer = new CleverBufferReader(buf, { noAssert: true });
    should.equal(cleverBuffer.getUInt8(), 1);
    should.equal(typeof cleverBuffer.getUInt8(), 'undefined');
  });

  const testCases = specHelper.cartesianProduct({
    size: [1, 2, 4, 8],
    unsigned: [false, true],
    bigEndian: [false, true],
    offset: [undefined, 20],
  });

  testCases.map(testCase => (({
    size, unsigned, bigEndian, offset,
  }) => it(`when noAssert is false: should throw RangeError when reading past the length for ${JSON.stringify(testCase)}`, () => {
    buf = Buffer.alloc(((offset || 0) + size) - 1);
    const cleverBuffer = new CleverBufferReader(buf, { bigEndian, noAssert: false });
    const f = unsigned ? `getUInt${size * 8}` : `getInt${size * 8}`;
    (() => cleverBuffer[f](offset)).should.throw(RangeError);
  })
  )(testCase));

  testCases.map(testCase => (({
    size, unsigned, bigEndian, offset,
  }) => it(`when noAssert is true: should not throw RangeError when reading past the length for ${JSON.stringify(testCase)}`, () => {
    buf = Buffer.alloc(((offset || 0) + size) - 1);
    const cleverBuffer = new CleverBufferReader(buf, { bigEndian, noAssert: true });
    const f = unsigned ? `getUInt${size * 8}` : `getInt${size * 8}`;
    (() => cleverBuffer[f](offset)).should.not.throw();
  })
  )(testCase));
});
