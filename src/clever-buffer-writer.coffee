ref             = require 'ref'
defaults        = require './defaults'
CleverBuffer    = require './clever-buffer-common'

checkInt = (buffer, value, offset, ext, max, min) ->
  if (value > max || value < min)
    throw new TypeError('"value" argument is out of bounds')
  if (offset + ext > buffer.length)
    throw new RangeError('Index out of range')

class CleverBufferWriter extends CleverBuffer

  constructor: (buffer, options={}) ->

    super buffer, options

  legacyWriteUInt8: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 1, 0xff, 0
    @buffer[offset] = value
    offset + 1

  legacyWriteUInt16LE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 2, 0xffff, 0
    @buffer[offset] = value
    @buffer[offset + 1] = value >>> 8
    offset + 2

  legacyWriteUInt16BE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 2, 0xffff, 0
    @buffer[offset] = value >>> 8
    @buffer[offset + 1] = value
    offset + 2

  legacyWriteUInt32LE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 4, 0xffffffff, 0
    @buffer[offset + 3] = value >>> 24
    @buffer[offset + 2] = value >>> 16
    @buffer[offset + 1] = value >>> 8
    @buffer[offset] = value
    offset + 4

  legacyWriteUInt32BE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 4, 0xffffffff, 0
    @buffer[offset] = value >>> 24
    @buffer[offset + 1] = value >>> 16
    @buffer[offset + 2] = value >>> 8
    @buffer[offset + 3] = value
    offset + 4

  legacyWriteInt8: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 1, 0x7f, -0x80
    @buffer[offset] = value
    offset + 1

  legacyWriteInt16LE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 2, 0x7fff, -0x8000
    @buffer[offset] = value
    @buffer[offset + 1] = value >>> 8
    offset + 2

  legacyWriteInt16BE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 2, 0x7fff, -0x8000
    @buffer[offset] = value >>> 8
    @buffer[offset + 1] = value
    offset + 2

  legacyWriteInt32LE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 4, 0x7fffffff, -0x80000000
    @buffer[offset] = value
    @buffer[offset + 1] = value >>> 8
    @buffer[offset + 2] = value >>> 16
    @buffer[offset + 3] = value >>> 24
    offset + 4

  legacyWriteInt32BE: (value, offset, noAssert) ->
    value = +value
    offset = offset >>> 0
    if !noAssert
      checkInt @buffer, value, offset, 4, 0x7fffffff, -0x80000000
    @buffer[offset] = value >>> 24
    @buffer[offset + 1] = value >>> 16
    @buffer[offset + 2] = value >>> 8
    @buffer[offset + 3] = value
    offset + 4

  writeUInt8: (value, _offset) ->
    @legacyWriteUInt8 value, _offset ? @offset++, @noAssert

  writeInt8: (value, _offset) ->
    @legacyWriteInt8 value, _offset ? @offset++, @noAssert

  writeUInt16: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @legacyWriteUInt16BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyWriteUInt16LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  writeInt16: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @legacyWriteInt16BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyWriteInt16LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 2, _offset

  writeUInt32: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @legacyWriteUInt32BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyWriteUInt32LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  writeInt32: (value, _offset) ->
    bigFunction = (offset, noAssert) =>
      @legacyWriteInt32BE value, offset, noAssert
    littleFunction = (offset, noAssert) =>
      @legacyWriteInt32LE value, offset, noAssert
    @_executeAndIncrement bigFunction, littleFunction, 4, _offset

  writeUInt64: (value, _offset) ->
    offset = _offset ? @offset
    # ref treats leading zeros as denoting octal numbers, so we want to strip
    # them out to prevent this behaviour
    if typeof value is 'number'
      value = value.toString()
    if not @noAssert and not /^\d+$/.test value
      throw new RangeError '"value" argument is out of bounds'
    value = value.replace /^0+(\d)/, '$1'
    if @bigEndian
      ref.writeUInt64BE(@buffer, offset, value)
    else
      ref.writeUInt64LE(@buffer, offset, value)
    @offset += 8 if _offset is undefined

  writeInt64: (value, _offset) ->
    offset = _offset ? @offset
    if typeof value is 'number'
      value = value.toString()
    if not @noAssert and not /^-?\d+$/.test value
      throw new RangeError '"value" argument is out of bounds'
    # ref treats leading zeros as denoting octal numbers, so we want to strip
    # them out to prevent this behaviour.
    # Also, ref treats '-0123' as a negative octal
    value = value.replace /^(-?)0+(\d)/, '$1$2'
    if @bigEndian
      ref.writeInt64BE(@buffer, offset, value)
    else
      ref.writeInt64LE(@buffer, offset, value)
    @offset += 8 if _offset is undefined

  writeString: (value, options={}) ->
    offsetSpecified = options.offset?
    { length, offset, encoding } = defaults options,
      length: null
      offset: @offset
      encoding: 'utf-8'
    if length?
      length = @buffer.write value, offset, length, encoding
    else
      length = @buffer.write value, offset, encoding
    @offset += length if not offsetSpecified
    length

  writeBytes: (value, options = {}) ->
    offsetSpecified = options.offset?
    offset = options.offset or @offset
    Buffer.from(value).copy(@buffer, offset)
    @offset += value.length unless offsetSpecified

module.exports = CleverBufferWriter
