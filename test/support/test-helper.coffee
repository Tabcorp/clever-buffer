CleverBufferWriter       = require "#{SRC}/clever-buffer-writer"

exports.writeToStupidBuffer = (numberOfIterations, numberOfBytesPerWord, writeFunction) ->
    buf = new Buffer (numberOfIterations*numberOfBytesPerWord)

    for i in [0..numberOfIterations-1]
      writeFunction buf, _value(numberOfBytesPerWord, numberOfIterations, i), i*numberOfBytesPerWord
    buf

exports.writeToCleverBuffer = (numberOfIterations, numberOfBytesPerWord, bigEndian, writeFunction) ->
  cleverBufferWriter = new CleverBufferWriter new Buffer(numberOfIterations*numberOfBytesPerWord), {bigEndian:bigEndian}

  for i in [0..numberOfIterations-1]
    writeFunction cleverBufferWriter, _value(numberOfBytesPerWord, numberOfIterations, i)
  cleverBufferWriter.getBuffer()

# This to spread a range of values from 0 to maxInteger for number of bytes per word
# e.g for a single byte max int is 2^8 - 1
# So for numberOfIterations = 3 we want [0, 127, 255]
_value = (numberOfBytesPerWord, numberOfIterations, i) ->
  (Math.pow(2, (8*numberOfBytesPerWord - ((numberOfIterations-1)-i)))) - 1
