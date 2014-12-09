ns = window

class Util
  wait: (_this, time) ->
    return $.Deferred((defer) ->
      setTimeout ->
        defer.resolve(_this)
      , time
    ).promise()

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

  remove: (el) -> el.parentNode.removeChild el



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



class Waltz
  _requestAnimeFrame = do ->
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      (callback) ->
        return window.setTimeout callback, 1000 / 60
    )

  _cancelAnimeFrame = do ->
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      (id) ->
        return window.clearTimeout id
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
      if circle?.options.frame >= circle?.options.max
        @circles.splice i, 1
      else
        circle?.render().progress()
    return this

  start: ->
    start = new Date().getTime()
    do frame = =>
      @_timerID = _requestAnimeFrame frame
      last = new Date().getTime()
      if last - start >= 100 - @options.fps and
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

    @util.addEvent window, 'mousemove', @add
    # @util.addEvent window, 'mouseleave', => @stop()
    @util.addEvent window, 'touchstart', @add
    @util.addEvent window, 'touchmove', @add
    # @util.addEvent window, 'touchend', => @stop()
    return this

ns.Waltz or= Waltz