/*!
 * VERSION: 0.2.1
 * DATE: 2016-01-09
 * http://greensock.com
 *
 * Requires TweenLite version 1.16.0 or later and CSSPlugin version 1.16.0 or later (or TweenMax 1.16.0 which contains both).
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	_gsScope._gsDefine("utils.ScrollTrigger", ["TweenLite"], function(TweenLite) {

		var _isArrayLike = function(e) {
				return (e.length && e[0] && ((e[0].nodeType && e[0].style && !e.nodeType) || (e[0].length && e[0][0]))) ? true : false; //could be an array of jQuery objects too, so accommodate that.
			},
			_flattenArray = function(a) {
				var result = [],
					l = a.length,
					i, e, j;
				for (i = 0; i < l; i++) {
					e = a[i];
					if (_isArrayLike(e)) {
						j = e.length;
						for (j = 0; j < e.length; j++) {
							result.push(e[j]);
						}
					} else {
						result.push(e);
					}
				}
				return result;
			},
			_dirty = false,
			_triggers = [],
			_doc = document,
			_docElement = _doc.documentElement,
			_viewportWidth,
			_viewportHeight,
			_update = function() {
				var i = _triggers.length;
				_viewportWidth = _docElement.clientWidth || window.innerWidth || _doc.body.clientWidth || 0;
				_viewportHeight = ((window.innerHeight || 0) - 20 < _docElement.clientHeight) ? _docElement.clientHeight : window.innerHeight || _doc.body.clientHeight || 0;
				while (--i > -1) {
					_triggers[i].update();
				}
				_dirty = false;
			},
			_onChange = function() {
				if (!_dirty) { //throttle. only allow one update per 100ms.
					TweenLite.delayedCall(0.1, _update);
					_dirty = true;
				}
			},
			_rewind = function(animation) {
				animation.pause(0);
				if (!animation.duration()) { //ensure zero-duration tweens render their starting values (pausing at 0 puts the playhead directly on top which renders at the end time)
					animation.render(-0.01, false, true);
				}
			},
			ScrollTrigger = function(target, vars) {
				this.vars = vars = (typeof(vars) === "function") ? {onEnter:vars} : vars || {};
				var self = this,
					position = ((vars.position + "") || "0 0").split(" "),
					yFactor = 1 - (parseFloat(position.pop()) || 0) * 0.01,
					xFactor = 1 - (parseFloat(position[0]) || 0) * 0.01,
					isVisible = false,
					prevTop = 999999,
					prevLeft = prevTop,
					e, cache, animation;
				self.target = target;
				if (vars.cache) {
					cache = vars.onEnter.call(this, target);
					if (!cache.progress) {
						console.log("Error: ScrollTrigger cache:true function must return a tween or timeline.");
					} else {
						animation = cache.progress(1);
						_rewind(animation);
					}
				}
				_triggers.push(self);
				e = target.parentNode;
				while (e && !e._gsTrigger) {
					e.addEventListener("scroll", _onChange);
					e.addEventListener("resize", _onChange);
					e._gsTrigger = true;
					e = e.parentNode;
				}
				self.update = function() {
					var rect = target.getBoundingClientRect(),
						top = rect.top,
						left = rect.left,
						isOutside = (top > _viewportHeight * (isVisible ? 1 : yFactor) || left > _viewportWidth * (isVisible ? 1 : xFactor) || rect.right < 0 || rect.bottom < 0);
					if (isVisible === isOutside) { //state changed
						isVisible = !isOutside;
						self.xChange = left - prevLeft;
						self.yChange = top - prevTop;
						if (isVisible) {
							if (!cache && !(vars.rewind && (prevTop < top || prevLeft < left))) {
								animation = vars.onEnter.call(self, target);
							}
							if (animation && animation.play) {
								animation.play();
							}
						} else {
							if (animation && vars.rewind && (top > _viewportHeight || left > _viewportWidth)) {
								_rewind(animation);
							}
							if (vars.onExit) {
								vars.onExit.call(self, target);
							}
						}
						prevLeft = left;
						prevTop = top;
					}
				};
				self.kill = function() {
					var i = _triggers.length;
					while (--i > -1) {
						if (_triggers[i] === self) {
							_triggers.splice(i, 1);
						}
					}
				};
				self.update();
			};
		_update();
		ScrollTrigger.create = function(targets, vars) {
			if (typeof(targets) === "string") {
				targets = TweenLite.selector(targets);
			}
			var a = _isArrayLike(targets) ? _flattenArray(targets) : [targets],
				i = a.length;
			while (--i > -1) {
				a[i] = new ScrollTrigger(a[i], vars);
			}
			return a;
		};
		ScrollTrigger.get = function(target) {
			var i = _triggers.length;
			while (--i > -1) {
				if (_triggers[i].target === target) {
					return _triggers[i];
				}
			}
		};
		ScrollTrigger.version = "0.2.1";
		ScrollTrigger.update = _update;
		window.addEventListener("resize", _update);
		TweenLite.delayedCall(0.1, _update); //ensures things are calibrated on initial page load
		return ScrollTrigger;

	}, true);


}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }

//export to AMD/RequireJS and CommonJS/Node (precursor to full modular build system coming at a later date)
(function(name) {
	"use strict";
	var getGlobal = function() {
		return (_gsScope.GreenSockGlobals || _gsScope)[name];
	};
	if (typeof(define) === "function" && define.amd) { //AMD
		define(["TweenLite"], getGlobal);
	} else if (typeof(module) !== "undefined" && module.exports) { //node
		require("../TweenLite.js");
		module.exports = getGlobal();
	}
}("ScrollTrigger"));
