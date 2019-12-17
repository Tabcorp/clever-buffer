// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should              = require('should');
const CleverBufferReader   = require(`${SRC}/clever-buffer-reader`);

describe('CleverBufferCommon', function() {

  const buf = Buffer.from([
      0xa1,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,0xa8,0xa9
  ]);

  it('can slice from the current offset until the end', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(0xa1);
    cleverBuffer.getUInt8().should.eql(0xa2);
    return cleverBuffer.slice().toString('hex').should.eql('a3a4a5a6a7a8a9');
  });

  it('can slice from a given index (after the offset) until the end', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(0xa1);
    cleverBuffer.getUInt8().should.eql(0xa2);
    return cleverBuffer.slice(2).toString('hex').should.eql('a5a6a7a8a9');
  });

  it('can slice from between two indexes (after the offset)', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(0xa1);
    cleverBuffer.getUInt8().should.eql(0xa2);
    return cleverBuffer.slice(2, 5).toString('hex').should.eql('a5a6a7');
  });

  return it('cannot slice past the end', function() {
    const cleverBuffer = new CleverBufferReader(buf);
    cleverBuffer.getUInt8().should.eql(0xa1);
    cleverBuffer.getUInt8().should.eql(0xa2);
    return cleverBuffer.slice(2, 20).toString('hex').should.eql('a5a6a7a8a9');
  });
});
