/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
global.SRC = `${__dirname}/../src`;

// cartesianProduct takes an object of arrays and creates an array of objects
// with every combination of values from each array.
// example:
// cartesianProduct({ a: [1,2,3], b: [false, true] })
// -> [ { a: 1, b: false },
//      { a: 1, b: true  },
//      { a: 2, b: false },
//      { a: 2, b: true  },
//      { a: 3, b: false },
//      { a: 3, b: true  } ]
const cartesianProduct = function(arg) {
  let acc = [{}];
  for (let key of Object.keys(arg || {})) {
    const xs = arg[key];
    const acc_ = [];
    for (let a of Array.from(acc)) {
      for (let x of Array.from(xs)) {
        const r = Object.assign({}, a);
        r[key] = x;
        acc_.push(r);
      }
    }
    acc = acc_;
  }
  return acc;
};

module.exports =
  {cartesianProduct};
