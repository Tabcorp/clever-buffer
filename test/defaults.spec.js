// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const should   = require('should');
const defaults = require(`${SRC}/defaults`);

describe('defaults', function() {

  it('does not override existing properties', function() {
    const obj = { a: 1 };
    const res = defaults(obj, { a: 2 });
    obj.should.eql({ a: 1 });
    return res.should.eql({ a: 1 });
});

  it('adds unset properties', function() {
    const obj = { a: 1 };
    const res = defaults(obj, { b: 2 });
    obj.should.eql({ a: 1, b: 2 });
    return res.should.eql({ a: 1, b: 2 });
});

  return it('does not override falsy values', function() {
    const obj = { a: false };
    const res = defaults(obj, { a: true });
    obj.should.eql({ a: false });
    return res.should.eql({ a: false });
});
});
