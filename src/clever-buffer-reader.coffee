_               = require 'lodash'
ref             = require 'ref'
CleverBuffer     = require './clever-buffer-common'

UINT32MAX_PLUS_ONE    = 4294967296


class CleverBufferReader extends CleverBuffer

  constructor: (buffer, options={}) ->
    super buffer, options

  getUInt8: (_offset) =>
    @buffer.readUInt8 _offset ? @offset++, @noAssert

  getInt8: (_offset) =>
    @buffer.readInt8 _offset ? @offset++, @noAssert

  getUInt16: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @buffer.readUInt16BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.readUInt16LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  getInt16: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @buffer.readInt16BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.readInt16LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  getUInt32: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @buffer.readUInt32BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.readUInt32LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  getInt32: (_offset) =>
    bigFunction = (offset, noAssert) =>
      @buffer.readInt32BE offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.readInt32LE offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  getUInt64: (_offset) =>
    offset = _offset ? @offset
    if @bigEndian
      val = ref.readUInt64BE(@buffer, offset)
    else
      val = ref.readUInt64LE(@buffer, offset)
    @offset += 8 if _offset is undefined
    val.toString()

  getInt64: (_offset) =>
    offset = _offset ? @offset
    if @bigEndian
      val = ref.readInt64BE(@buffer, offset)
    else
      val = ref.readInt64LE(@buffer, offset)
    @offset += 8 if _offset is undefined
    val.toString()

  getString: (options={}) =>
    { length, offset, encoding, offsetSpecified } = _.defaults options,
      length: 0
      offset: @offset
      offsetSpecified: options.offset?
      encoding: 'utf-8'
    return '' if length is 0
    val = @buffer.toString encoding, offset, offset + length
    @offset += length if not offsetSpecified
    val

module.exports = CleverBufferReader