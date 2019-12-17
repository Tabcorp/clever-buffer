should   = require 'should'
defaults = require "#{SRC}/defaults"

describe 'defaults', ->

  it 'does not override existing properties', ->
    obj = { a: 1 }
    res = defaults obj, { a: 2 }
    obj.should.eql { a: 1 }
    res.should.eql { a: 1 }

  it 'adds unset properties', ->
    obj = { a: 1 }
    res = defaults obj, { b: 2 }
    obj.should.eql { a: 1, b: 2 }
    res.should.eql { a: 1, b: 2 }

  it 'does not override falsy values', ->
    obj = { a: false }
    res = defaults obj, { a: true }
    obj.should.eql { a: false }
    res.should.eql { a: false }
