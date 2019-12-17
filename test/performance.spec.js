// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const assert      = require('assert');
const should      = require('should');
const Table       = require('cli-table');
const CleverBufferReader   = require(`${SRC}/clever-buffer-reader`);

const BIG_BUFFER = Buffer.from([
    0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
    0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21,
    0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
    0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21,
    0x45,0x58,0x50,0x45,0x43,0x54,0x45,0x44,0x20,0x52,0x45,0x54,0x55,0x52,0x4e,0x21,
    0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46,0x20,0x24,0x32,0x2e,0x30,0x30,0x21
]);

describe('Performance', function() {

  const table = new Table({
    head: ['Operation', 'time (ms)'],
    colWidths: [30, 20]});

  const run = function(name, op, count) {
    const start = new Date();
    for (let n = 0, end1 = count, asc = 0 <= end1; asc ? n <= end1 : n >= end1; asc ? n++ : n--) { op(); }
    const end = new Date();
    return table.push([`${name} * ${count}`, end - start]);
  };

  return it('prints some performance figures', function() {
    run('Read UInt8', readUnit8, 50000);
    run('Read UInt64', readUInt64, 50000);
    run('Read String', readString, 50000);
    console.log('');
    return console.log(table.toString());
  });
});


var readUnit8 = function() {
  const buf = Buffer.from([0x52,0x45,0x54,0x55,0x52,0x4e,0x20,0x4f,0x46]);
  const cleverBuffer = new CleverBufferReader(buf);
  return __range__(0, (buf.length - 1), true).map((i) =>
    assert.equal(cleverBuffer.getUInt8(), buf.readUInt8(i)));
};

var readUInt64 = function() {
  const buf = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
  const cleverBuffer = new CleverBufferReader(buf);
  return assert.equal(cleverBuffer.getUInt64(), '18446744073709551615');
};

var readString = function() {
  const buf = Buffer.from([0x48, 0x45, 0x4C, 0x4C, 0x4F]);
  const cleverBuffer = new CleverBufferReader(buf);
  return assert.equal(cleverBuffer.getString({length: 5}), 'HELLO');
};

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}