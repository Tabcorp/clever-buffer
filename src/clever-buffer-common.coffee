_ = require 'lodash'

class CleverBuffer

  constructor: (buffer, options={}) ->

    @buffer = buffer

    { @offset, @noAssert, @bigEndian } = _.defaults options,
      offset: 0
      noAssert: true
      bigEndian: false

  _executeAndIncrement: (bigEndianFunction, littleEndianFunction, value, _offset) =>
    if @bigEndian
      val = bigEndianFunction(_offset ? @offset, @noAssert)
    else
      val = littleEndianFunction(_offset ? @offset, @noAssert)
    @offset += value if _offset is undefined
    val

  getBuffer: =>
    @buffer

  getOffset: =>
    @offset

  skip: (bytesToSkip) =>
    @offset += bytesToSkip
    return

  skipTo: (offset) =>
    @offset = offset

  trim: =>
    @buffer.slice 0, @offset

  slice: (start, end) =>
    realEnd = if end then @offset + end else @buffer.length
    @buffer.slice @offset + (start or 0), realEnd

module.exports = CleverBuffer
