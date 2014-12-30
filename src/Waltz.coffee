Util = require './Util'
Circle = require './Circle'

module.exports =
  class Waltz
    _requestAnimeFrame = do ->
      return (
        requestAnimationFrame or
        webkitRequestAnimationFrame or
        mozRequestAnimationFrame or
        msRequestAnimationFrame or
        oRequestAnimationFrame or
        (callback) ->
          setTimeout callback, 1000 / 60
      )

    _cancelAnimeFrame = do ->
      return (
        cancelAnimationFrame or
        webkitCancelAnimationFrame or
        mozCancelAnimationFrame or
        msCancelAnimationFrame or
        oCancelAnimationFrame or
        (id) ->
          clearTimeout id
      )

    defaults:
      fps: 60

    constructor: (canvas, options) ->
      @options = @util.extend {}, @defaults, options
      @canvas = canvas
      @ctx = @canvas.getContext '2d'
      @setField()
      @events()

    util: do -> new Util

    setField: ->
      @width = window.innerWidth
      @height = window.innerHeight
      @canvas.width = @width# * 2
      @canvas.height = @height# * 2
      # @canvas.style.cssText = "
      #   width: #{@width}px;
      #   height: #{@height}px;
      # "
      return this

    anime: ->
      @ctx.clearRect 0, 0, @width, @height
      for circle, i in @circles
        if circle.options.frame >= circle.options.max
          circle = null
        else
          circle.render().progress()

      @util.filter.call @circles, (i) -> i
      return this

    start: ->
      start = new Date().getTime()
      do frame = =>
        @_timerID = _requestAnimeFrame frame
        last = new Date().getTime()
        if last - start >= 100 - (100 - @options.fps) and
        @circles?
          @anime()
          start = new Date().getTime()
      return this

    stop: ->
      _cancelAnimeFrame @_timerID
      return this

    add: (ev) =>
      ev.preventDefault()
      if ev.type is 'mousemove'
        x = ev.x + @util.getRandomInt 0, 80
        y = ev.y + @util.getRandomInt 0, 80
      else if ev.type is 'touchstart' or
      ev.type is 'touchmove'
        x = ev.touches[0].pageX + @util.getRandomInt 0, 80
        y = ev.touches[0].pageY + @util.getRandomInt 0, 80

      @circles or= []
      @circles.push new Circle @ctx,
        x: x
        y: y
        size: @util.getRandomInt 0, 3
        max: @util.getRandomInt 5, 25
        color: "##{@util.getRandomInt(0, 16777215).toString(16)}"
      return this

    events: ->
      @util.addEvent window, 'resize', => @setField()
      @util.addEvent window, 'orientationchange', => @setField()

      @util.addEvent @canvas, 'mousemove', @add
      # @util.addEvent @canvas, 'mouseleave', => @stop()
      @util.addEvent @canvas, 'touchstart', @add
      @util.addEvent @canvas, 'touchmove', @add
      # @util.addEvent @canvas, 'touchend', => @stop()
      return this
