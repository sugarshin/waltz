/*!
 * @license Waltz v0.0.2
 * (c) 2014 sugarshin https://github.com/sugarshin
 * License: MIT
 */
(function() {
  var Circle, Util, Waltz, ns,
    __hasProp = {}.hasOwnProperty,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ns = window;

  Util = (function() {
    function Util() {}

    Util.prototype.wait = function(_this, time) {
      return $.Deferred(function(defer) {
        return setTimeout(function() {
          return defer.resolve(_this);
        }, time);
      }).promise();
    };

    Util.prototype.addEvent = function(el, type, eventHandler) {
      return el.addEventListener(type, eventHandler);
    };

    Util.prototype.rmEvent = function(el, type, eventHandler) {
      return el.removeEventListener(type, eventHandler);
    };

    Util.prototype.extend = function(out) {
      var i, key, val, _i, _ref, _ref1;
      out || (out = {});
      for (i = _i = 1, _ref = arguments.length; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        if (!arguments[i]) {
          continue;
        }
        _ref1 = arguments[i];
        for (key in _ref1) {
          if (!__hasProp.call(_ref1, key)) continue;
          val = _ref1[key];
          out[key] = arguments[i][key];
        }
      }
      return out;
    };

    Util.prototype.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    Util.prototype.remove = function(el) {
      return el.parentNode.removeChild(el);
    };

    return Util;

  })();

  Circle = (function() {
    Circle.prototype.defaults = {
      x: 0,
      y: 0,
      frame: 0,
      max: 30,
      size: 10,
      color: '#f1f1f1'
    };

    function Circle(ctx, options) {
      this.options = this.util.extend({}, this.defaults, options);
      this.ctx = ctx;
    }

    Circle.prototype.util = (function() {
      return new Util;
    })();

    Circle.prototype.render = function() {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.options.color;
      this.ctx.arc(this.options.x, this.options.y, this.options.frame * this.options.size, 0, Math.PI * 2, false);
      this.ctx.fill();
      return this;
    };

    Circle.prototype.clear = function() {
      this.ctx.clearRect(this.options.x, this.options.y, this.options.frame * this.options.size, 0);
      return this;
    };

    Circle.prototype.progress = function() {
      this.options.frame++;
      return this;
    };

    return Circle;

  })();

  Waltz = (function() {
    var _cancelAnimeFrame, _requestAnimeFrame;

    _requestAnimeFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })();

    _cancelAnimeFrame = (function() {
      return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
        return window.clearTimeout(id);
      };
    })();

    Waltz.prototype.defaults = {
      fps: 60
    };

    function Waltz(canvas, options) {
      this.add = __bind(this.add, this);
      this.options = this.util.extend({}, this.defaults, options);
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.setField();
      this.events();
    }

    Waltz.prototype.util = (function() {
      return new Util;
    })();

    Waltz.prototype.setField = function() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      return this;
    };

    Waltz.prototype.anime = function() {
      var circle, i, _i, _len, _ref;
      this.ctx.clearRect(0, 0, this.width, this.height);
      _ref = this.circles;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        circle = _ref[i];
        if ((circle != null ? circle.options.frame : void 0) >= (circle != null ? circle.options.max : void 0)) {
          this.circles.splice(i, 1);
        } else {
          if (circle != null) {
            circle.render().progress();
          }
        }
      }
      return this;
    };

    Waltz.prototype.start = function() {
      var frame, start;
      start = new Date().getTime();
      (frame = (function(_this) {
        return function() {
          var last;
          _this._timerID = _requestAnimeFrame(frame);
          last = new Date().getTime();
          if (last - start >= 100 - _this.options.fps && (_this.circles != null)) {
            _this.anime();
            return start = new Date().getTime();
          }
        };
      })(this))();
      return this;
    };

    Waltz.prototype.stop = function() {
      _cancelAnimeFrame(this._timerID);
      return this;
    };

    Waltz.prototype.add = function(ev) {
      var x, y;
      ev.preventDefault();
      if (ev.type === 'mousemove') {
        x = ev.x + this.util.getRandomInt(0, 80);
        y = ev.y + this.util.getRandomInt(0, 80);
      } else if (ev.type === 'touchstart' || ev.type === 'touchmove') {
        x = ev.touches[0].pageX + this.util.getRandomInt(0, 80);
        y = ev.touches[0].pageY + this.util.getRandomInt(0, 80);
      }
      this.circles || (this.circles = []);
      this.circles.push(new Circle(this.ctx, {
        x: x,
        y: y,
        size: this.util.getRandomInt(0, 3),
        max: this.util.getRandomInt(5, 25),
        color: "#" + (this.util.getRandomInt(0, 16777215).toString(16))
      }));
      return this;
    };

    Waltz.prototype.events = function() {
      this.util.addEvent(window, 'resize', (function(_this) {
        return function() {
          return _this.setField();
        };
      })(this));
      this.util.addEvent(window, 'orientationchange', (function(_this) {
        return function() {
          return _this.setField();
        };
      })(this));
      this.util.addEvent(window, 'mousemove', this.add);
      this.util.addEvent(window, 'touchstart', this.add);
      this.util.addEvent(window, 'touchmove', this.add);
      return this;
    };

    return Waltz;

  })();

  ns.Waltz || (ns.Waltz = Waltz);

}).call(this);