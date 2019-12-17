
module.exports = (obj, props) ->
  for p of props
    obj[p] = props[p] unless obj[p]?
  obj
