global.SRC = "#{__dirname}/../src"

# cartesianProduct takes an object of arrays and creates an array of objects
# with every combination of values from each array.
# example:
# cartesianProduct({ a: [1,2,3], b: [false, true] })
# -> [ { a: 1, b: false },
#      { a: 1, b: true  },
#      { a: 2, b: false },
#      { a: 2, b: true  },
#      { a: 3, b: false },
#      { a: 3, b: true  } ]
cartesianProduct = (arg) ->
  acc = [{}]
  for own key, xs of arg
    acc_ = []
    for a in acc
      for x in xs
        r = Object.assign {}, a
        r[key] = x
        acc_.push r
    acc = acc_
  acc

module.exports =
  cartesianProduct: cartesianProduct
