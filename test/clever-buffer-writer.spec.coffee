should                  = require 'should'
CleverBufferWriter       = require "#{SRC}/clever-buffer-writer"
{ writeToBuffer,
  writeToCleverBuffer }  = require './support/test-helper'

describe 'CleverBuffer', ->

  NUMBER_OF_ITERATIONS = 16

  it 'should write Uint8', ->
    numberOfBytesPerWord = 1

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeUInt8 value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, false, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeUInt8 value

    buf.should.eql cleverBuffer

  it 'should write int8', ->
    numberOfBytesPerWord = 1

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeInt8 value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, false, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeInt8 value

    buf.should.eql cleverBuffer

  it 'should write Uint16 Little Endian', ->
    numberOfBytesPerWord = 2

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeUInt16LE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, false, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeUInt16 value

    buf.should.eql cleverBuffer

  it 'should write int16 Little Endian', ->
    numberOfBytesPerWord = 2

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeInt16LE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, false, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeInt16 value

    buf.should.eql cleverBuffer

  it 'should write Uint16 Big Endian', ->
    numberOfBytesPerWord = 2

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeUInt16BE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, true, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeUInt16 value

    buf.should.eql cleverBuffer

  it 'should write int16 Big Endian', ->
    numberOfBytesPerWord = 2

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeInt16BE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, true, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeInt16 value

    buf.should.eql cleverBuffer

  it 'should write Uint32 Little Endian', ->
    numberOfBytesPerWord = 4

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeUInt32LE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, false, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeUInt32 value

    buf.should.eql cleverBuffer

  it 'should write int32 Little Endian', ->
    numberOfBytesPerWord = 4

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeInt32LE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, false, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeInt32 value

    buf.should.eql cleverBuffer

  it 'should write Uint32 Big Endian', ->
    numberOfBytesPerWord = 4

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeUInt32BE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, true, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeUInt32 value

    buf.should.eql cleverBuffer

  it 'should write int32 Big Endian', ->
    numberOfBytesPerWord = 4

    buf = writeToBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, (buf, value, offset) ->
      buf.writeInt32BE value, offset, true

    cleverBuffer = writeToCleverBuffer NUMBER_OF_ITERATIONS, numberOfBytesPerWord, true, (cleverBufferWriter, value) ->
      cleverBufferWriter.writeInt32 value

    buf.should.eql cleverBuffer

  it 'should skip bytes', ->
    buf = new Buffer 4
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeUInt8 0x10
    cleverBufferWriter.skip 2
    cleverBufferWriter.writeUInt8 0x20

    cleverBufferWriter.getBuffer().should.eql new Buffer [0x10, 0x00, 0x00, 0x20]

  it 'should skip to set offset', ->
    buf = new Buffer 4
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeUInt8 0x10
    cleverBufferWriter.skipTo 2
    cleverBufferWriter.writeUInt8 0x20

    cleverBufferWriter.getBuffer().should.eql new Buffer [0x10, 0x00, 0x20, 0x00]

  it 'should write string', ->
    buf = new Buffer 32
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeString 'EXPECTED RETURN!'
    cleverBufferWriter.writeString 'RETURN OF $2.00!'

    cleverBufferWriter.getBuffer().should.eql new Buffer [
      0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
      0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
    ]

  it 'should write string of specified length', ->
    buf = new Buffer 10
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeString 'HELLOWORLD', length:5

    #Only writes hello
    cleverBufferWriter.getBuffer().should.eql new Buffer [
      0x48, 0x45, 0x4C, 0x4C, 0x4F, 0x00, 0x00, 0x00, 0x00, 0x00
    ]
    cleverBufferWriter.getOffset().should.eql 5

  it 'should write string of specified length at a specified offset', ->
    buf = new Buffer 10
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeString 'HELLOWORLD',
      length:5
      offset: 5

    #Writes hello starting at offset 5
    cleverBufferWriter.getBuffer().should.eql new Buffer [
      0x00, 0x00, 0x00, 0x00, 0x00, 0x48, 0x45, 0x4C, 0x4C, 0x4F
    ]
    cleverBufferWriter.getOffset().should.eql 0

  it 'should be able to writeUInt8 at a specific offset', ->
    buf = new Buffer 5
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeUInt8 1
    cleverBufferWriter.writeUInt8 2
    cleverBufferWriter.writeUInt8 3
    cleverBufferWriter.writeUInt8 4
    cleverBufferWriter.writeUInt8 5
    cleverBufferWriter.writeUInt8 6, 1

    #Writes 6 at position 1
    cleverBufferWriter.getBuffer().should.eql new Buffer [
      0x01, 0x06, 0x03, 0x04, 0x05
    ]
    #Does not increment the offset
    cleverBufferWriter.getOffset().should.eql 5

  it 'should be able to writeUInt16 at a specific offset', ->
    buf = new Buffer 10
    buf.fill 0
    cleverBufferWriter = new CleverBufferWriter buf
    cleverBufferWriter.writeUInt16 1
    cleverBufferWriter.writeUInt16 2
    cleverBufferWriter.writeUInt16 3
    cleverBufferWriter.writeUInt16 4
    cleverBufferWriter.writeUInt16 5
    cleverBufferWriter.writeUInt16 6, 2

    #Writes 6 at position 2
    cleverBufferWriter.getBuffer().should.eql new Buffer [
      0x01, 0x00, 0x06, 0x00, 0x03, 0x00, 0x04, 0x00, 0x05, 0x00
    ]
    #Does not increment the offset
    cleverBufferWriter.getOffset().should.eql 10

  it 'should write Uint64 little endian MAX', ->
    buf = new Buffer 8
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf
    cleverBuffer.writeUInt64('18446744073709551615')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]

  it 'should write Uint64 big endian MAX', ->
    buf = new Buffer 8
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf, {bigEndian:true}
    cleverBuffer.writeUInt64('18446744073709551615')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]

  it 'should write Uint64 little endian', ->
    buf = new Buffer 8
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf
    cleverBuffer.writeUInt64('4294967366')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0x46, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00
    ]

  it 'should write Uint64 big endian', ->
    buf = new Buffer 8
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf, {bigEndian:true}
    cleverBuffer.writeUInt64('4294967366')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x46
    ]

  it 'should write int64 little endian', ->
    buf = new Buffer 8
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf
    cleverBuffer.writeUInt64('-1')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]

  it 'should write int64 big endian', ->
    buf = new Buffer 8
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf, {bigEndian:true}
    cleverBuffer.writeUInt64('-1')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]

  it 'should write Uint64 at specified offset, currentOffset should not increment', ->
    buf = new Buffer 10
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf
    cleverBuffer.writeUInt64('18446744073709551615', 2)
    cleverBuffer.getBuffer().should.eql new Buffer [
      0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]
    cleverBuffer.getOffset().should.eql 0

  it 'should write Uint64 at current offset, currentOffset should increment', ->
    buf = new Buffer 10
    buf.fill 0
    cleverBuffer = new CleverBufferWriter buf
    cleverBuffer.skip 1
    cleverBuffer.writeUInt64('18446744073709551615')
    cleverBuffer.getBuffer().should.eql new Buffer [
      0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00
    ]
    cleverBuffer.getOffset().should.eql 9

