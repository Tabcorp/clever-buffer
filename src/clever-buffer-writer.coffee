_               = require 'lodash'
ref             = require 'ref'
CleverBuffer     = require './clever-buffer-common'


UINT32MAX_PLUS_ONE    = 4294967296

class CleverBufferWriter extends CleverBuffer

  constructor: (buffer, options={}) ->

    super buffer, options

  writeUInt8: (value, _offset) ->
    @buffer.writeUInt8 value, _offset ? @offset++, @noAssert

  writeInt8: (value, _offset) ->
    @buffer.writeInt8 value, _offset ? @offset++, @noAssert

  writeUInt16: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @buffer.writeUInt16BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.writeUInt16LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  writeInt16: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @buffer.writeInt16BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.writeInt16LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  writeUInt32: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @buffer.writeUInt32BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.writeUInt32LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  writeInt32: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @buffer.writeInt32BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @buffer.writeInt32LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  writeUInt64: (value, _offset) ->
    offset = _offset ? @offset
    if @bigEndian
      ref.writeUInt64BE(@buffer, offset, value)
    else
      ref.writeUInt64LE(@buffer, offset, value)
    @offset += 8 if _offset is undefined

  writeInt64: (value, _offset) ->
    offset = _offset ? @offset
    if @bigEndian
      ref.writeInt64BE(@buffer, offset, value)
    else
      ref.writeInt64LE(@buffer, offset, value)
    @offset += 8 if _offset is undefined

  writeString: (value, options={}) ->
    offsetSpecified = options.offset?
    { length, offset, encoding } = _.defaults options,
      length: value.length
      offset: @offset
      encoding: 'utf-8'
    return if length is 0
    @buffer.write value, offset, length, encoding
    @offset += length if not offsetSpecified

  write: (value, options = {}) ->
    offsetSpecified = options.offset?
    offset = options.offset or @offset
    new Buffer(value).copy(@buffer, offset)
    @offset += value.length unless offsetSpecified

module.exports = CleverBufferWriter
