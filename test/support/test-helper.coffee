CleverBufferWriter       = require "#{SRC}/clever-buffer-writer"

exports.writeToStupidBuffer = (values, numberOfBytesPerWord, writeFunction) ->
  buf = Buffer.alloc values.length*numberOfBytesPerWord

  offset = 0
  for val in values
    writeFunction buf, val, offset
    offset += numberOfBytesPerWord
  buf

exports.writeToCleverBuffer = (values, numberOfBytesPerWord, bigEndian, writeFunction) ->
  cleverBufferWriter = new CleverBufferWriter Buffer.alloc(values.length*numberOfBytesPerWord), {bigEndian:bigEndian}

  for val in values
    writeFunction cleverBufferWriter, val

  cleverBufferWriter.getBuffer()
