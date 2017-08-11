should             = require 'should'
CleverBufferReader = require "#{SRC}/clever-buffer-reader"

# cartesianProduct takes an object of arrays and creates an array of objects
# with every combination of values from each array.
# example:
# cartesianProduct({ a: [1,2,3], b: [false, true] })
# -> [ { a: 1, b: false },
#      { a: 1, b: true  },
#      { a: 2, b: false },
#      { a: 2, b: true  },
#      { a: 3, b: false },
#      { a: 3, b: true  } ]
cartesianProduct = (arg) ->
  acc = [{}]
  for own key, xs of arg
    acc_ = []
    for a in acc
      for x in xs
        r = Object.assign {}, a
        r[key] = x
        acc_.push r
    acc = acc_
  acc

describe 'CleverBufferReader', ->

  buf = new Buffer [
      0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
      0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
  ]

  it 'should get Uint8', ->
    cleverBuffer = new CleverBufferReader buf
    for i in [0..(buf.size - 1)]
      cleverBuffer.getUInt8().should.eql buf.readUInt8 i, true

  it 'should get int8', ->
    cleverBuffer = new CleverBufferReader new Buffer [0...Math.pow(2,8)]
    for i in [0..(buf.size - 1)]
      cleverBuffer.getInt8().should.eql buf.readInt8 i, true

  it 'should get Uint16 Little Endian', ->
    cleverBuffer = new CleverBufferReader buf
    for i in [0..(buf.size/2 - 1)]
      cleverBuffer.getUInt16().should.eql buf.readUInt16LE i, true

  it 'should get Uint16 Big Endian', ->
    cleverBuffer = new CleverBufferReader buf, { bigEndian:true }
    for i in [0..(buf.size/2 - 1)]
      cleverBuffer.getUInt16().should.eql buf.readUInt16BE i, true

  it 'should get int16 Little Endian', ->
    cleverBuffer = new CleverBufferReader new Buffer [0...Math.pow(2,16)]
    for i in [0..(buf.size/2 - 1)]
      cleverBuffer.getInt16().should.eql buf.readInt16LE i, true

  it 'should get int16 Big Endian', ->
    cleverBuffer = new CleverBufferReader new Buffer [0...Math.pow(2,16)], { bigEndian:true }
    for i in [0..(buf.size/2 - 1)]
      cleverBuffer.getInt16().should.eql buf.readInt16BE i, true

  it 'should get Uint32 Little Endian', ->
    cleverBuffer = new CleverBufferReader buf
    for i in [0..(buf.size/4 - 1)]
      cleverBuffer.getUInt32().should.eql buf.readUInt32LE i, true

  it 'should get Uint32 Big Endian', ->
    cleverBuffer = new CleverBufferReader buf, { bigEndian:true }
    for i in [0..(buf.size/4 - 1)]
      cleverBuffer.getUInt32().should.eql buf.readUInt32BE i, true

  it 'should get int32 Little Endian', ->
    mybuf = new Buffer [0x88, 0x88, 0xA0, 0xFF]
    cleverBuffer = new CleverBufferReader mybuf
    cleverBuffer.getInt32().should.eql (cleverBuffer.getBuffer().readInt32LE 0, true)

  it 'should get int32 Big Endian', ->
    mybuf = new Buffer [0x88, 0x88, 0xA0, 0xFF]
    cleverBuffer = new CleverBufferReader mybuf, { bigEndian:true }
    cleverBuffer.getInt32().should.eql (cleverBuffer.getBuffer().readInt32BE 0, true)

  it 'should get Uint64 little endian MAX', ->
    cleverBuffer = new CleverBufferReader new Buffer [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
    cleverBuffer.getUInt64().should.eql '18446744073709551615'

  it 'should get Uint64 big endian MAX', ->
    cleverBuffer = new CleverBufferReader (new Buffer [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), { bigEndian:true }
    cleverBuffer.getUInt64().should.eql '18446744073709551615'

  it 'should get Uint64 little endian', ->
    cleverBuffer = new CleverBufferReader new Buffer [0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]
    cleverBuffer.getUInt64().should.eql '4294967366'

  it 'should get Uint64 big endian', ->
    cleverBuffer = new CleverBufferReader (new Buffer [0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46]), { bigEndian:true }
    cleverBuffer.getUInt64().should.eql '4294967366'

  it 'should get int64 little endian', ->
    cleverBuffer = new CleverBufferReader new Buffer [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
    cleverBuffer.getInt64().should.eql '-1'

  it 'should get int64 big endian', ->
    cleverBuffer = new CleverBufferReader new Buffer ([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), { bigEndian:true }
    cleverBuffer.getInt64().should.eql '-1'

  it 'should get String', ->
    cleverBuffer = new CleverBufferReader buf
    cleverBuffer.getString(length:16).should.eql 'EXPECTED RETURN!'
    cleverBuffer.getString(length:16).should.eql 'RETURN OF $2.00!'

  it 'should return empty String when length is 0', ->
    cleverBuffer = new CleverBufferReader buf
    cleverBuffer.getString().should.eql ''

  it 'buffer should not be modified', ->
    cleverBuffer = new CleverBufferReader buf
    cleverBuffer.getUInt8().should.eql buf.readUInt8 0, true
    cleverBuffer.getUInt8().should.eql buf.readUInt8 1, true
    cleverBuffer.getBuffer().should.eql buf

  it 'internal offset should be incremented', ->
    cleverBuffer = new CleverBufferReader buf
    cleverBuffer.getUInt8().should.eql buf.readUInt8 0, true
    cleverBuffer.getUInt8().should.eql buf.readUInt8 1, true
    cleverBuffer.getOffset().should.eql 2

  it 'should skip bytes', ->
    cleverBuffer = new CleverBufferReader buf
    returnVal = cleverBuffer.skip 4
    (typeof returnVal).should.eql('undefined') # Skipping shouldn't return a value
    cleverBuffer.getOffset().should.eql 4

  it 'should skip to set offset', ->
    cleverBuffer = new CleverBufferReader buf
    cleverBuffer.skip 4
    cleverBuffer.getOffset().should.eql 4
    cleverBuffer.skipTo 6
    cleverBuffer.getOffset().should.eql 6

  it 'should be able to readUInt8 at a specific offset', ->
    cleverBuffer = new CleverBufferReader new Buffer [
      0x01, 0x02, 0x03, 0x04, 0x05
    ]
    cleverBuffer.getUInt8(3).should.eql 4
    cleverBuffer.getOffset().should.eql 0 #should not increment currentOffset

  it 'should be able to readUInt16 at a specific offset', ->
    cleverBuffer = new CleverBufferReader new Buffer [
      0x01, 0x02, 0x03, 0x00, 0x05
    ]
    cleverBuffer.getUInt16(2).should.eql 3
    cleverBuffer.getOffset().should.eql 0 #should not increment currentOffset

  it 'should get Uint64 at a specific offset', ->
    cleverBuffer = new CleverBufferReader new Buffer [0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
    cleverBuffer.getUInt64(2).should.eql '18446744073709551615'
    cleverBuffer.getOffset().should.eql 0 #should not increment currentOffset

  it 'should get string of specified length at a specified offset', ->
    cleverBuffer = new CleverBufferReader new Buffer [
      0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
    ]
    cleverBuffer.getString({length:5,offset: 5}).should.eql 'HELLO'

    cleverBuffer.getOffset().should.eql 0 #should not increment currentOffset

  it 'should get bytes', ->
    cleverBuffer = new CleverBufferReader new Buffer [
      0x20, 0x6d, 0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20
    ]
    cleverBuffer.getBytes(offset: 2, length: 9).should.eql [0x57, 0x68, 0x61, 0x74, 0x72, 0x72, 0x79, 0x21, 0x20]
    cleverBuffer.getBytes(length: 4).should.eql [0x20, 0x6d, 0x57, 0x68]
    cleverBuffer.getBytes(length: 1).should.eql [0x61]

  it 'should return <undefined> when reading past the length', ->
    buf = new Buffer [0x1]
    cleverBuffer = new CleverBufferReader buf
    should.equal(cleverBuffer.getUInt8(), 1)
    should.equal(typeof cleverBuffer.getUInt8(), 'undefined')

  testCases =
    size:      [1, 2, 4, 8]
    unsigned:  [false, true]
    bigEndian: [false, true]
    offset:    [undefined, 20]

  for testCase in (cartesianProduct testCases)
    do ({size, unsigned, bigEndian, offset} = testCase) ->
      it "should throw RangeError when reading past the length for #{JSON.stringify testCase}", ->
        buf = new Buffer (offset ? 0) + size - 1

        cleverBuffer = new CleverBufferReader buf,
          bigEndian: bigEndian
          noAssert: false

        f = if unsigned then "getUInt#{size*8}" else "getInt#{size*8}"
        (-> cleverBuffer[f](offset)).should.throw RangeError

  for testCase in (cartesianProduct testCases)
    do ({size, unsigned, bigEndian, offset} = testCase) ->
      it "should not throw RangeError when reading up to the length for #{JSON.stringify testCase}", ->
        buf = new Buffer (offset ? 0) + size

        cleverBuffer = new CleverBufferReader buf,
          bigEndian: bigEndian
          noAssert: false

        f = if unsigned then "getUInt#{size*8}" else "getInt#{size*8}"
        (-> cleverBuffer[f](offset)).should.not.throw()
