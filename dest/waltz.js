/*!
 * @license Waltz v1.0.0
 * (c) 2014 sugarshin https://github.com/sugarshin
 * License: MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Waltz, waltz;

Waltz = require('./Waltz');

waltz = new Waltz(document.querySelector('#waltz', {
  fps: 60
}));

waltz.start();



},{"./Waltz":4}],2:[function(require,module,exports){
var Circle, Util;

Util = require('./Util');

module.exports = Circle = (function() {
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



},{"./Util":3}],3:[function(require,module,exports){
var Util,
  __hasProp = {}.hasOwnProperty;

module.exports = Util = (function() {
  function Util() {}

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

  Util.prototype.filter = (function() {
    if (Array.filter) {
      return Array.filter;
    } else {
      return function(fun) {
        'use strict';
        var i, len, res, t, thisp, val;
        if (typeof this === "undefined" || this === null) {
          throw new TypeError();
        }
        t = Object(this);
        len = t.length >>> 0;
        if (typeof fun !== 'function') {
          throw new TypeError();
        }
        res = [];
        thisp = arguments[1];
        i = 0;
        while (i < len) {
          if (i in t) {
            val = t[i];
            if (fun.call(thisp, val, i, t)) {
              res.push(val);
            }
          }
          i++;
        }
        return res;
      };
    }
  })();

  return Util;

})();



},{}],4:[function(require,module,exports){
var Circle, Util, Waltz,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Util = require('./Util');

Circle = require('./Circle');

module.exports = Waltz = (function() {
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
      if (circle.options.frame >= circle.options.max) {
        circle = null;
      } else {
        circle.render().progress();
      }
    }
    this.util.filter.call(this.circles, function(i) {
      return i;
    });
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



},{"./Circle":2,"./Util":3}]},{},[1]);
