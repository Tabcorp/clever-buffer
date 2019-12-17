/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CleverBufferWriter       = require(`${SRC}/clever-buffer-writer`);

exports.writeToStupidBuffer = function(values, numberOfBytesPerWord, writeFunction) {
  const buf = Buffer.alloc(values.length*numberOfBytesPerWord);

  let offset = 0;
  for (let val of Array.from(values)) {
    writeFunction(buf, val, offset);
    offset += numberOfBytesPerWord;
  }
  return buf;
};

exports.writeToCleverBuffer = function(values, numberOfBytesPerWord, bigEndian, writeFunction) {
  const cleverBufferWriter = new CleverBufferWriter(Buffer.alloc(values.length*numberOfBytesPerWord), {bigEndian});

  for (let val of Array.from(values)) {
    writeFunction(cleverBufferWriter, val);
  }

  return cleverBufferWriter.getBuffer();
};
