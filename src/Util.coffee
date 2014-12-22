module.exports =
  class Util
    addEvent: (el, type, eventHandler) -> el.addEventListener type, eventHandler

    rmEvent: (el, type, eventHandler) -> el.removeEventListener type, eventHandler

    extend: (out) ->
      out or= {}
      for i in [1...arguments.length]
        unless arguments[i] then continue
        for own key, val of arguments[i]
          out[key] = arguments[i][key]
      return out

    getRandomInt: (min, max) ->
      return Math.floor(Math.random() * (max - min + 1)) + min

    filter: do ->
      if Array.filter
        return Array.filter
      else
        # https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        return (fun) ->
          'use strict'
          unless @? then throw new TypeError()
          t = Object @
          len = t.length >>> 0
          unless typeof fun is 'function'
            throw new TypeError()
          res = []
          thisp = arguments[1]
          i = 0
          while i < len
            if i of t
              val = t[i]
              if fun.call thisp, val, i, t
                res.push val
            i++
          return res
