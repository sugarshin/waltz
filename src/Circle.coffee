Util = require './Util'

module.exports =
  class Circle
    defaults:
      x: 0
      y: 0
      frame: 0
      max: 30
      size: 10
      color: '#f1f1f1'

    constructor: (ctx, options) ->
      @options = @util.extend {}, @defaults, options
      @ctx = ctx

    util: do -> new Util

    render: ->
      @ctx.beginPath()
      @ctx.fillStyle = @options.color
      @ctx.arc @options.x, @options.y, @options.frame * @options.size, 0, Math.PI * 2, false
      @ctx.fill()
      return this

    clear: ->
      @ctx.clearRect @options.x, @options.y, @options.frame * @options.size, 0
      return this

    progress: ->
      @options.frame++
      return this
