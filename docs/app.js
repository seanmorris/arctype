(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("curvature/base/Bag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bag = void 0;
var _Bindable = require("./Bindable");
var _Mixin = require("./Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var toId = int => Number(int);
var fromId = id => parseInt(id);
var Mapped = Symbol('Mapped');
var Has = Symbol('Has');
var Add = Symbol('Add');
var Remove = Symbol('Remove');
var Delete = Symbol('Delete');
var Bag = /*#__PURE__*/function (_Mixin$with) {
  _inherits(Bag, _Mixin$with);
  var _super = _createSuper(Bag);
  function Bag(changeCallback = undefined) {
    var _this;
    _classCallCheck(this, Bag);
    _this = _super.call(this);
    _this.changeCallback = changeCallback;
    _this.content = new Map();
    _this.current = 0;
    _this.length = 0;
    _this.list = _Bindable.Bindable.makeBindable([]);
    _this.meta = Symbol('meta');
    _this.type = undefined;
    return _this;
  }
  _createClass(Bag, [{
    key: "has",
    value: function has(item) {
      if (this[Mapped]) {
        return this[Mapped].has(item);
      }
      return this[Has](item);
    }
  }, {
    key: Has,
    value: function value(item) {
      return this.content.has(item);
    }
  }, {
    key: "add",
    value: function add(item) {
      if (this[Mapped]) {
        return this[Mapped].add(item);
      }
      return this[Add](item);
    }
  }, {
    key: Add,
    value: function value(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be added to Bags.');
      }
      if (this.type && !(item instanceof this.type)) {
        console.error(this.type, item);
        throw new Error("Only objects of type ".concat(this.type, " may be added to this Bag."));
      }
      item = _Bindable.Bindable.make(item);
      if (this.content.has(item)) {
        return;
      }
      var adding = new CustomEvent('adding', {
        detail: {
          item: item
        }
      });
      if (!this.dispatchEvent(adding)) {
        return;
      }
      var id = toId(this.current++);
      this.content.set(item, id);
      this.list[id] = item;
      if (this.changeCallback) {
        this.changeCallback(item, this.meta, Bag.ITEM_ADDED, id);
      }
      var add = new CustomEvent('added', {
        detail: {
          item: item,
          id: id
        }
      });
      this.dispatchEvent(add);
      this.length = this.size;
      return id;
    }
  }, {
    key: "remove",
    value: function remove(item) {
      if (this[Mapped]) {
        return this[Mapped].remove(item);
      }
      return this[Remove](item);
    }
  }, {
    key: Remove,
    value: function value(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be removed from Bags.');
      }
      if (this.type && !(item instanceof this.type)) {
        console.error(this.type, item);
        throw new Error("Only objects of type ".concat(this.type, " may be removed from this Bag."));
      }
      item = _Bindable.Bindable.make(item);
      if (!this.content.has(item)) {
        if (this.changeCallback) {
          this.changeCallback(item, this.meta, 0, undefined);
        }
        return false;
      }
      var removing = new CustomEvent('removing', {
        detail: {
          item: item
        }
      });
      if (!this.dispatchEvent(removing)) {
        return;
      }
      var id = this.content.get(item);
      delete this.list[id];
      this.content.delete(item);
      if (this.changeCallback) {
        this.changeCallback(item, this.meta, Bag.ITEM_REMOVED, id);
      }
      var remove = new CustomEvent('removed', {
        detail: {
          item: item,
          id: id
        }
      });
      this.dispatchEvent(remove);
      this.length = this.size;
      return item;
    }
  }, {
    key: "delete",
    value: function _delete(item) {
      if (this[Mapped]) {
        return this[Mapped].delete(item);
      }
      this[Delete](item);
    }
  }, {
    key: Delete,
    value: function value(item) {
      this.remove(item);
    }
  }, {
    key: "map",
    value: function map(mapper = x => x, filter = x => x) {
      var mappedItems = new WeakMap();
      var mappedBag = new Bag();
      mappedBag[Mapped] = this;
      this.addEventListener('added', event => {
        var item = event.detail.item;
        if (!filter(item)) {
          return;
        }
        if (mappedItems.has(item)) {
          return;
        }
        var mapped = mapper(item);
        mappedItems.set(item, mapped);
        mappedBag[Add](mapped);
      });
      this.addEventListener('removed', event => {
        var item = event.detail.item;
        if (!mappedItems.has(item)) {
          return;
        }
        var mapped = mappedItems.get(item);
        mappedItems.delete(item);
        mappedBag[Remove](mapped);
      });
      return mappedBag;
    }
  }, {
    key: "size",
    get: function get() {
      return this.content.size;
    }
  }, {
    key: "items",
    value: function items() {
      return Array.from(this.content.entries()).map(entry => entry[0]);
    }
  }]);
  return Bag;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.Bag = Bag;
Object.defineProperty(Bag, 'ITEM_ADDED', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: 1
});
Object.defineProperty(Bag, 'ITEM_REMOVED', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: -1
});
  })();
});

require.register("curvature/base/Bindable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bindable = void 0;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var Ref = Symbol('ref');
var Original = Symbol('original');
var Deck = Symbol('deck');
var Binding = Symbol('binding');
var SubBinding = Symbol('subBinding');
var BindingAll = Symbol('bindingAll');
var IsBindable = Symbol('isBindable');
var Wrapping = Symbol('wrapping');
var Names = Symbol('Names');
var Executing = Symbol('executing');
var Stack = Symbol('stack');
var ObjSymbol = Symbol('object');
var Wrapped = Symbol('wrapped');
var Unwrapped = Symbol('unwrapped');
var GetProto = Symbol('getProto');
var OnGet = Symbol('onGet');
var OnAllGet = Symbol('onAllGet');
var BindChain = Symbol('bindChain');
var Descriptors = Symbol('Descriptors');
var Before = Symbol('Before');
var After = Symbol('After');
var NoGetters = Symbol('NoGetters');
var TypedArray = Object.getPrototypeOf(Int8Array);
var SetIterator = Set.prototype[Symbol.iterator];
var MapIterator = Map.prototype[Symbol.iterator];
var win = (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : void 0;
var isExcluded = object => typeof win.Map === 'function' && object instanceof win.Map || typeof win.Set === 'function' && object instanceof win.Set || typeof win.Node === 'function' && object instanceof win.Node || typeof win.WeakMap === 'function' && object instanceof win.WeakMap || typeof win.Location === 'function' && object instanceof win.Location || typeof win.Storage === 'function' && object instanceof win.Storage || typeof win.WeakSet === 'function' && object instanceof win.WeakSet || typeof win.ArrayBuffer === 'function' && object instanceof win.ArrayBuffer || typeof win.Promise === 'function' && object instanceof win.Promise || typeof win.File === 'function' && object instanceof win.File || typeof win.Event === 'function' && object instanceof win.Event || typeof win.CustomEvent === 'function' && object instanceof win.CustomEvent || typeof win.Gamepad === 'function' && object instanceof win.Gamepad || typeof win.ResizeObserver === 'function' && object instanceof win.ResizeObserver || typeof win.MutationObserver === 'function' && object instanceof win.MutationObserver || typeof win.PerformanceObserver === 'function' && object instanceof win.PerformanceObserver || typeof win.IntersectionObserver === 'function' && object instanceof win.IntersectionObserver || typeof win.IDBCursor === 'function' && object instanceof win.IDBCursor || typeof win.IDBCursorWithValue === 'function' && object instanceof win.IDBCursorWithValue || typeof win.IDBDatabase === 'function' && object instanceof win.IDBDatabase || typeof win.IDBFactory === 'function' && object instanceof win.IDBFactory || typeof win.IDBIndex === 'function' && object instanceof win.IDBIndex || typeof win.IDBKeyRange === 'function' && object instanceof win.IDBKeyRange || typeof win.IDBObjectStore === 'function' && object instanceof win.IDBObjectStore || typeof win.IDBOpenDBRequest === 'function' && object instanceof win.IDBOpenDBRequest || typeof win.IDBRequest === 'function' && object instanceof win.IDBRequest || typeof win.IDBTransaction === 'function' && object instanceof win.IDBTransaction || typeof win.IDBVersionChangeEvent === 'function' && object instanceof win.IDBVersionChangeEvent || typeof win.FileSystemFileHandle === 'function' && object instanceof win.FileSystemFileHandle || typeof win.RTCPeerConnection === 'function' && object instanceof win.RTCPeerConnection || typeof win.ServiceWorkerRegistration === 'function' && object instanceof win.ServiceWorkerRegistration;
var Bindable = /*#__PURE__*/function () {
  function Bindable() {
    _classCallCheck(this, Bindable);
  }
  _createClass(Bindable, null, [{
    key: "isBindable",
    value: function isBindable(object) {
      if (!object || !object[IsBindable]) {
        return false;
      }
      return object[IsBindable] === Bindable;
    }
  }, {
    key: "onDeck",
    value: function onDeck(object, key) {
      return object[Deck].get(key) || false;
    }
  }, {
    key: "ref",
    value: function ref(object) {
      return object[Ref] || object || false;
    }
  }, {
    key: "makeBindable",
    value: function makeBindable(object) {
      return this.make(object);
    }
  }, {
    key: "shuck",
    value: function shuck(original, seen) {
      seen = seen || new Map();
      var clone = Object.create({});
      if (original instanceof TypedArray || original instanceof ArrayBuffer) {
        var _clone = original.slice(0);
        seen.set(original, _clone);
        return _clone;
      }
      var properties = Object.keys(original);
      for (var i in properties) {
        var ii = properties[i];
        if (ii.substring(0, 3) === '___') {
          continue;
        }
        var alreadyCloned = seen.get(original[ii]);
        if (alreadyCloned) {
          clone[ii] = alreadyCloned;
          continue;
        }
        if (original[ii] === original) {
          seen.set(original[ii], clone);
          clone[ii] = clone;
          continue;
        }
        if (original[ii] && _typeof(original[ii]) === 'object') {
          var originalProp = original[ii];
          if (Bindable.isBindable(original[ii])) {
            originalProp = original[ii][Original];
          }
          clone[ii] = this.shuck(originalProp, seen);
        } else {
          clone[ii] = original[ii];
        }
        seen.set(original[ii], clone[ii]);
      }
      if (Bindable.isBindable(original)) {
        delete clone.bindTo;
        delete clone.isBound;
      }
      return clone;
    }
  }, {
    key: "make",
    value: function make(object) {
      if (!object || !['function', 'object'].includes(_typeof(object))) {
        return object;
      }
      if (object[Ref]) {
        return object[Ref];
      }
      if (object[IsBindable]) {
        return object;
      }
      if (Object.isSealed(object) || Object.isFrozen(object) || !Object.isExtensible(object) || isExcluded(object)) {
        return object;
      }
      Object.defineProperty(object, IsBindable, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Bindable
      });
      Object.defineProperty(object, Ref, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: false
      });
      Object.defineProperty(object, Original, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: object
      });
      Object.defineProperty(object, Deck, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, Binding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.create(null)
      });
      Object.defineProperty(object, SubBinding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, BindingAll, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Set()
      });
      Object.defineProperty(object, Executing, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Wrapping, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Stack, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Before, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Set()
      });
      Object.defineProperty(object, After, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Set()
      });
      Object.defineProperty(object, Wrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.preventExtensions(new Map())
      });
      Object.defineProperty(object, Unwrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.preventExtensions(new Map())
      });
      Object.defineProperty(object, Descriptors, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.preventExtensions(new Map())
      });
      var bindTo = (property, callback = null, options = {}) => {
        var bindToAll = false;
        if (Array.isArray(property)) {
          var debinders = property.map(p => bindTo(p, callback, options));
          return () => debinders.forEach(d => d());
        }
        if (property instanceof Function) {
          options = callback || {};
          callback = property;
          bindToAll = true;
        }
        if (options.delay >= 0) {
          callback = this.wrapDelayCallback(callback, options.delay);
        }
        if (options.throttle >= 0) {
          callback = this.wrapThrottleCallback(callback, options.throttle);
        }
        if (options.wait >= 0) {
          callback = this.wrapWaitCallback(callback, options.wait);
        }
        if (options.frame) {
          callback = this.wrapFrameCallback(callback, options.frame);
        }
        if (options.idle) {
          callback = this.wrapIdleCallback(callback);
        }
        if (bindToAll) {
          object[BindingAll].add(callback);
          if (!('now' in options) || options.now) {
            for (var i in object) {
              callback(object[i], i, object, false);
            }
          }
          return () => {
            object[BindingAll].delete(callback);
          };
        }
        if (!object[Binding][property]) {
          object[Binding][property] = new Set();
        }

        // let bindIndex = object[Binding][property].length;

        if (options.children) {
          var original = callback;
          callback = (...args) => {
            var v = args[0];
            var subDebind = object[SubBinding].get(original);
            if (subDebind) {
              object[SubBinding].delete(original);
              subDebind();
            }
            if (_typeof(v) !== 'object') {
              original(...args);
              return;
            }
            var vv = Bindable.make(v);
            if (Bindable.isBindable(vv)) {
              object[SubBinding].set(original, vv.bindTo((...subArgs) => original(...args, ...subArgs), Object.assign({}, options, {
                children: false
              })));
            }
            original(...args);
          };
        }
        object[Binding][property].add(callback);
        if (!('now' in options) || options.now) {
          callback(object[property], property, object, false);
        }
        var debinder = () => {
          var subDebind = object[SubBinding].get(callback);
          if (subDebind) {
            object[SubBinding].delete(callback);
            subDebind();
          }
          if (!object[Binding][property]) {
            return;
          }
          if (!object[Binding][property].has(callback)) {
            return;
          }
          object[Binding][property].delete(callback);
        };
        if (options.removeWith && options.removeWith instanceof View) {
          options.removeWith.onRemove(() => debinder);
        }
        return debinder;
      };
      Object.defineProperty(object, 'bindTo', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: bindTo
      });
      var ___before = callback => {
        object[Before].add(callback);
        return () => object[Before].delete(callback);
      };
      var ___after = callback => {
        object[After].add(callback);
        return () => object[After].delete(callback);
      };
      Object.defineProperty(object, BindChain, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: (path, callback) => {
          var parts = path.split('.');
          var node = parts.shift();
          var subParts = parts.slice(0);
          var debind = [];
          debind.push(object.bindTo(node, (v, k, t, d) => {
            var rest = subParts.join('.');
            if (subParts.length === 0) {
              callback(v, k, t, d);
              return;
            }
            if (v === undefined) {
              v = t[k] = this.make({});
            }
            debind = debind.concat(v[BindChain](rest, callback));
          }));
          return () => debind.forEach(x => x());
        }
      });
      Object.defineProperty(object, '___before', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___before
      });
      Object.defineProperty(object, '___after', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___after
      });
      var isBound = () => {
        if (object[BindingAll].size) {
          return true;
        }
        for (var callbacks of Object.values(object[Binding])) {
          if (callbacks.size) {
            return true;
          }
          // for(let callback of callbacks)
          // {
          // 	if(callback)
          // 	{
          // 		return true;
          // 	}
          // }
        }

        return false;
      };
      Object.defineProperty(object, 'isBound', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: isBound
      });
      for (var i in object) {
        // const descriptors = Object.getOwnPropertyDescriptors(object);

        if (!object[i] || _typeof(object[i]) !== 'object') {
          continue;
        }
        if (object[i][Ref] || object[i] instanceof Promise) {
          continue;
        }
        if (!Object.isExtensible(object[i]) || Object.isSealed(object[i])) {
          continue;
        }
        if (!isExcluded(object[i])) {
          object[i] = Bindable.make(object[i]);
        }
      }
      var descriptors = object[Descriptors];
      var wrapped = object[Wrapped];
      var stack = object[Stack];
      var set = (target, key, value) => {
        if (value && _typeof(value) === 'object') {
          value = Bindable.make(value);
          if (target[key] === value) {
            return true;
          }
        }
        if (wrapped.has(key)) {
          wrapped.delete(key);
        }
        var onDeck = object[Deck];
        var isOnDeck = onDeck.has(key);
        var valOnDeck = isOnDeck && onDeck.get(key);

        // if(onDeck[key] !== undefined && onDeck[key] === value)
        if (isOnDeck && valOnDeck === value) {
          return true;
        }
        if (key.slice && key.slice(-3) === '___') {
          return true;
        }
        if (target[key] === value || typeof value === 'number' && isNaN(valOnDeck) && isNaN(value)) {
          return true;
        }
        onDeck.set(key, value);
        for (var callback of object[BindingAll]) {
          callback(value, key, target, false);
        }
        if (key in object[Binding]) {
          for (var _callback of object[Binding][key]) {
            _callback(value, key, target, false, target[key]);
          }
        }
        onDeck.delete(key);
        var excluded = win.File && target instanceof win.File && key == 'lastModifiedDate';
        if (!excluded) {
          Reflect.set(target, key, value);
        }
        if (Array.isArray(target) && object[Binding]['length']) {
          for (var _i in object[Binding]['length']) {
            var _callback2 = object[Binding]['length'][_i];
            _callback2(target.length, 'length', target, false, target.length);
          }
        }
        return true;
      };
      var deleteProperty = (target, key) => {
        var onDeck = object[Deck];
        var isOnDeck = onDeck.has(key);
        if (isOnDeck) {
          return true;
        }
        if (!(key in target)) {
          return true;
        }
        if (descriptors.has(key)) {
          var descriptor = descriptors.get(key);
          if (descriptor && !descriptor.configurable) {
            return false;
          }
          descriptors.delete(key);
        }
        onDeck.set(key, null);
        if (wrapped.has(key)) {
          wrapped.delete(key);
        }
        for (var callback of object[BindingAll]) {
          callback(undefined, key, target, true, target[key]);
        }
        if (key in object[Binding]) {
          for (var binding of object[Binding][key]) {
            binding(undefined, key, target, true, target[key]);
          }
        }
        Reflect.deleteProperty(target, key);
        onDeck.delete(key);
        return true;
      };
      var construct = (target, args) => {
        var key = 'constructor';
        for (var callback of target[Before]) {
          callback(target, key, object[Stack], undefined, args);
        }
        var instance = Bindable.make(new target[Original](...args));
        for (var _callback3 of target[After]) {
          _callback3(target, key, object[Stack], instance, args);
        }
        return instance;
      };
      var get = (target, key) => {
        if (wrapped.has(key)) {
          return wrapped.get(key);
        }
        if (key === Ref || key === Original || key === 'apply' || key === 'isBound' || key === 'bindTo' || key === '__proto__' || key === 'constructor') {
          return object[key];
        }
        var descriptor;
        if (descriptors.has(key)) {
          descriptor = descriptors.get(key);
        } else {
          descriptor = Object.getOwnPropertyDescriptor(object, key);
          descriptors.set(key, descriptor);
        }
        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          return object[key];
        }
        if (OnAllGet in object) {
          return object[OnAllGet](key);
        }
        if (OnGet in object && !(key in object)) {
          return object[OnGet](key);
        }
        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          wrapped.set(key, object[key]);
          return object[key];
        }
        if (typeof object[key] === 'function') {
          if (Names in object[key]) {
            return object[key];
          }
          object[Unwrapped].set(key, object[key]);
          var prototype = Object.getPrototypeOf(object);
          var isMethod = prototype[key] === object[key];
          var objRef =
          // (typeof Promise === 'function'                    && object instanceof Promise)
          // || (typeof Storage === 'function'                 && object instanceof Storage)
          // || (typeof Map === 'function'                     && object instanceof Map)
          // || (typeof Set === 'function'                     && object instanceof Set)
          // || (typeof WeakMap === 'function'                 && object instanceof WeakMap)
          // || (typeof WeakSet === 'function'                 && object instanceof WeakSet)
          // || (typeof ArrayBuffer === 'function'             && object instanceof ArrayBuffer)
          // || (typeof ResizeObserver === 'function'          && object instanceof ResizeObserver)
          // || (typeof MutationObserver === 'function'        && object instanceof MutationObserver)
          // || (typeof PerformanceObserver === 'function'     && object instanceof PerformanceObserver)
          // || (typeof IntersectionObserver === 'function'    && object instanceof IntersectionObserver)
          isExcluded(object) || typeof object[Symbol.iterator] === 'function' && key === 'next' || typeof TypedArray === 'function' && object instanceof TypedArray || typeof EventTarget === 'function' && object instanceof EventTarget || typeof Date === 'function' && object instanceof Date || typeof MapIterator === 'function' && object.prototype === MapIterator || typeof SetIterator === 'function' && object.prototype === SetIterator ? object : object[Ref];
          var wrappedMethod = function wrappedMethod(...providedArgs) {
            object[Executing] = key;
            stack.unshift(key);
            for (var beforeCallback of object[Before]) {
              beforeCallback(object, key, stack, object, providedArgs);
            }
            var ret;
            if (new.target) {
              ret = new (object[Unwrapped].get(key))(...providedArgs);
            } else {
              var func = object[Unwrapped].get(key);
              if (isMethod) {
                ret = func.apply(objRef || object, providedArgs);
              } else {
                ret = func(...providedArgs);
              }
            }
            for (var afterCallback of object[After]) {
              afterCallback(object, key, stack, object, providedArgs);
            }
            object[Executing] = null;
            stack.shift();
            return ret;
          };
          wrappedMethod[OnAllGet] = _key => object[key][_key];
          var result = Bindable.make(wrappedMethod);
          wrapped.set(key, result);
          return result;
        }
        return object[key];
      };
      var getPrototypeOf = target => {
        if (GetProto in object) {
          return object[GetProto];
        }
        return Reflect.getPrototypeOf(target);
      };
      var handlerDef = Object.create(null);
      handlerDef.set = set;
      handlerDef.construct = construct;
      handlerDef.deleteProperty = deleteProperty;
      if (!object[NoGetters]) {
        handlerDef.getPrototypeOf = getPrototypeOf;
        handlerDef.get = get;
      }
      Object.defineProperty(object, Ref, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Proxy(object, handlerDef)
      });
      return object[Ref];
    }
  }, {
    key: "clearBindings",
    value: function clearBindings(object) {
      var maps = func => (...os) => os.map(func);
      var clearObj = o => Object.keys(o).map(k => delete o[k]);
      var clearObjs = maps(clearObj);
      object[BindingAll].clear();
      clearObjs(object[Wrapped], object[Binding], object[After], object[Before]);
    }
  }, {
    key: "resolve",
    value: function resolve(object, path, owner = false) {
      var node;
      var pathParts = path.split('.');
      var top = pathParts[0];
      while (pathParts.length) {
        if (owner && pathParts.length === 1) {
          var obj = this.make(object);
          return [obj, pathParts.shift(), top];
        }
        node = pathParts.shift();
        if (!(node in object) || !object[node] || !(_typeof(object[node]) === 'object')) {
          object[node] = Object.create(null);
        }
        object = this.make(object[node]);
      }
      return [this.make(object), node, top];
    }
  }, {
    key: "wrapDelayCallback",
    value: function wrapDelayCallback(callback, delay) {
      return (...args) => setTimeout(() => callback(...args), delay);
    }
  }, {
    key: "wrapThrottleCallback",
    value: function wrapThrottleCallback(callback, throttle) {
      this.throttles.set(callback, false);
      return (...args) => {
        if (this.throttles.get(callback, true)) {
          return;
        }
        callback(...args);
        this.throttles.set(callback, true);
        setTimeout(() => {
          this.throttles.set(callback, false);
        }, throttle);
      };
    }
  }, {
    key: "wrapWaitCallback",
    value: function wrapWaitCallback(callback, wait) {
      return (...args) => {
        var waiter;
        if (waiter = this.waiters.get(callback)) {
          this.waiters.delete(callback);
          clearTimeout(waiter);
        }
        waiter = setTimeout(() => callback(...args), wait);
        this.waiters.set(callback, waiter);
      };
    }
  }, {
    key: "wrapFrameCallback",
    value: function wrapFrameCallback(callback, frames) {
      return (...args) => {
        requestAnimationFrame(() => callback(...args));
      };
    }
  }, {
    key: "wrapIdleCallback",
    value: function wrapIdleCallback(callback) {
      return (...args) => {
        // Compatibility for Safari 08/2020
        var req = window.requestIdleCallback || requestAnimationFrame;
        req(() => callback(...args));
      };
    }
  }]);
  return Bindable;
}();
exports.Bindable = Bindable;
_defineProperty(Bindable, "waiters", new WeakMap());
_defineProperty(Bindable, "throttles", new WeakMap());
Object.defineProperty(Bindable, 'OnGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnGet
});
Object.defineProperty(Bindable, 'NoGetters', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NoGetters
});
Object.defineProperty(Bindable, 'GetProto', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: GetProto
});
Object.defineProperty(Bindable, 'OnAllGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnAllGet
});
  })();
});

require.register("curvature/base/Cache.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Cache = /*#__PURE__*/function () {
  function Cache() {
    _classCallCheck(this, Cache);
  }
  _createClass(Cache, null, [{
    key: "store",
    value: function store(key, value, expiry, bucket = 'standard') {
      var expiration = 0;
      if (expiry) {
        expiration = expiry * 1000 + new Date().getTime();
      }
      if (!this.buckets) {
        this.buckets = new Map();
      }
      if (!this.buckets.has(bucket)) {
        this.buckets.set(bucket, new Map());
      }
      var eventEnd = new CustomEvent('cvCacheStore', {
        cancelable: true,
        detail: {
          key: key,
          value: value,
          expiry: expiry,
          bucket: bucket
        }
      });
      if (document.dispatchEvent(eventEnd)) {
        this.buckets.get(bucket).set(key, {
          value: value,
          expiration: expiration
        });
      }
    }
  }, {
    key: "load",
    value: function load(key, defaultvalue = false, bucket = 'standard') {
      var eventEnd = new CustomEvent('cvCacheLoad', {
        cancelable: true,
        detail: {
          key: key,
          defaultvalue: defaultvalue,
          bucket: bucket
        }
      });
      if (!document.dispatchEvent(eventEnd)) {
        return defaultvalue;
      }
      if (this.buckets && this.buckets.has(bucket) && this.buckets.get(bucket).has(key)) {
        var entry = this.buckets.get(bucket).get(key);
        // console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
        if (entry.expiration === 0 || entry.expiration > new Date().getTime()) {
          return this.buckets.get(bucket).get(key).value;
        }
      }
      return defaultvalue;
    }
  }]);
  return Cache;
}();
exports.Cache = Cache;
  })();
});

require.register("curvature/base/Config.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var AppConfig = {};
var _require = require;
var win = (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : void 0;
try {
  AppConfig = _require('/Config').Config;
} catch (error) {
  win.devMode === true && console.error(error);
  AppConfig = {};
}
var Config = /*#__PURE__*/function () {
  function Config() {
    _classCallCheck(this, Config);
  }
  _createClass(Config, null, [{
    key: "get",
    value: function get(name) {
      return this.configs[name];
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this.configs[name] = value;
      return this;
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.configs;
    }
  }, {
    key: "init",
    value: function init(...configs) {
      for (var i in configs) {
        var config = configs[i];
        if (typeof config === 'string') {
          config = JSON.parse(config);
        }
        for (var name in config) {
          var value = config[name];
          return this.configs[name] = value;
        }
      }
      return this;
    }
  }]);
  return Config;
}();
exports.Config = Config;
Object.defineProperty(Config, 'configs', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: AppConfig
});
  })();
});

require.register("curvature/base/Dom.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dom = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var traversals = 0;
var Dom = /*#__PURE__*/function () {
  function Dom() {
    _classCallCheck(this, Dom);
  }
  _createClass(Dom, null, [{
    key: "mapTags",
    value: function mapTags(doc, selector, callback, startNode, endNode) {
      var result = [];
      var started = true;
      if (startNode) {
        started = false;
      }
      var ended = false;
      var _globalThis$window = globalThis.window,
        Node = _globalThis$window.Node,
        Element = _globalThis$window.Element,
        NodeFilter = _globalThis$window.NodeFilter,
        document = _globalThis$window.document;
      var treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: (node, walker) => {
          if (!started) {
            if (node === startNode) {
              started = true;
            } else {
              return NodeFilter.FILTER_SKIP;
            }
          }
          if (endNode && node === endNode) {
            ended = true;
          }
          if (ended) {
            return NodeFilter.FILTER_SKIP;
          }
          if (selector) {
            if (node instanceof Element) {
              if (node.matches(selector)) {
                return NodeFilter.FILTER_ACCEPT;
              }
            }
            return NodeFilter.FILTER_SKIP;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);
      var traversal = traversals++;
      while (treeWalker.nextNode()) {
        result.push(callback(treeWalker.currentNode, treeWalker));
      }
      return result;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(doc, event) {
      doc.dispatchEvent(event);
      this.mapTags(doc, false, node => {
        node.dispatchEvent(event);
      });
    }
  }]);
  return Dom;
}();
exports.Dom = Dom;
  })();
});

require.register("curvature/base/Mixin.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mixin = void 0;
var _Bindable = require("./Bindable");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Constructor = Symbol('constructor');
var MixinList = Symbol('mixinList');
var Mixin = /*#__PURE__*/function () {
  function Mixin() {
    _classCallCheck(this, Mixin);
  }
  _createClass(Mixin, null, [{
    key: "from",
    value: function from(baseClass, ...mixins) {
      var newClass = /*#__PURE__*/function (_baseClass) {
        _inherits(newClass, _baseClass);
        var _super = _createSuper(newClass);
        function newClass(...args) {
          var _this;
          _classCallCheck(this, newClass);
          var instance = baseClass.constructor ? _this = _super.call(this, ...args) : null;
          for (var mixin of mixins) {
            if (mixin[Mixin.Constructor]) {
              mixin[Mixin.Constructor].apply(_assertThisInitialized(_this));
            }
            switch (_typeof(mixin)) {
              case 'function':
                Mixin.mixClass(mixin, newClass);
                break;
              case 'object':
                Mixin.mixObject(mixin, _assertThisInitialized(_this));
                break;
            }
          }
          return _possibleConstructorReturn(_this, instance);
        }
        return _createClass(newClass);
      }(baseClass);
      return newClass;
    }
  }, {
    key: "make",
    value: function make(...classes) {
      var base = classes.pop();
      return Mixin.to(base, ...classes);
    }
  }, {
    key: "to",
    value: function to(base, ...mixins) {
      var descriptors = {};
      mixins.map(mixin => {
        switch (_typeof(mixin)) {
          case 'object':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin));
            break;
          case 'function':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin.prototype));
            break;
        }
        delete descriptors.constructor;
        Object.defineProperties(base.prototype, descriptors);
      });
    }
  }, {
    key: "with",
    value: function _with(...mixins) {
      return this.from( /*#__PURE__*/function () {
        function _class() {
          _classCallCheck(this, _class);
        }
        return _createClass(_class);
      }(), ...mixins);
    }
  }, {
    key: "mixObject",
    value: function mixObject(mixin, instance) {
      for (var func of Object.getOwnPropertyNames(mixin)) {
        if (typeof mixin[func] === 'function') {
          instance[func] = mixin[func].bind(instance);
          continue;
        }
        instance[func] = mixin[func];
      }
      for (var _func of Object.getOwnPropertySymbols(mixin)) {
        if (typeof mixin[_func] === 'function') {
          instance[_func] = mixin[_func].bind(instance);
          continue;
        }
        instance[_func] = mixin[_func];
      }
    }
  }, {
    key: "mixClass",
    value: function mixClass(cls, newClass) {
      for (var func of Object.getOwnPropertyNames(cls.prototype)) {
        if (['name', 'prototype', 'length'].includes(func)) {
          continue;
        }
        var descriptor = Object.getOwnPropertyDescriptor(newClass, func);
        if (descriptor && !descriptor.writable) {
          continue;
        }
        if (typeof cls[func] !== 'function') {
          newClass.prototype[func] = cls.prototype[func];
          continue;
        }
        newClass.prototype[func] = cls.prototype[func].bind(newClass.prototype);
      }
      for (var _func2 of Object.getOwnPropertySymbols(cls.prototype)) {
        if (typeof cls[_func2] !== 'function') {
          newClass.prototype[_func2] = cls.prototype[_func2];
          continue;
        }
        newClass.prototype[_func2] = cls.prototype[_func2].bind(newClass.prototype);
      }
      var _loop = function _loop() {
        if (['name', 'prototype', 'length'].includes(_func3)) {
          return "continue";
        }
        var descriptor = Object.getOwnPropertyDescriptor(newClass, _func3);
        if (descriptor && !descriptor.writable) {
          return "continue";
        }
        if (typeof cls[_func3] !== 'function') {
          newClass[_func3] = cls[_func3];
          return "continue";
        }
        var prev = newClass[_func3] || false;
        var meth = cls[_func3].bind(newClass);
        newClass[_func3] = (...args) => {
          prev && prev(...args);
          return meth(...args);
        };
      };
      for (var _func3 of Object.getOwnPropertyNames(cls)) {
        var _ret = _loop();
        if (_ret === "continue") continue;
      }
      var _loop2 = function _loop2() {
        if (typeof cls[_func4] !== 'function') {
          newClass.prototype[_func4] = cls[_func4];
          return "continue";
        }
        var prev = newClass[_func4] || false;
        var meth = cls[_func4].bind(newClass);
        newClass[_func4] = (...args) => {
          prev && prev(...args);
          return meth(...args);
        };
      };
      for (var _func4 of Object.getOwnPropertySymbols(cls)) {
        var _ret2 = _loop2();
        if (_ret2 === "continue") continue;
      }
    }
  }, {
    key: "mix",
    value: function mix(mixinTo) {
      var constructors = [];
      var allStatic = {};
      var allInstance = {};
      var mixable = _Bindable.Bindable.makeBindable(mixinTo);
      var _loop3 = function _loop3(base) {
        var instanceNames = Object.getOwnPropertyNames(base.prototype);
        var staticNames = Object.getOwnPropertyNames(base);
        var prefix = /^(before|after)__(.+)/;
        var _loop5 = function _loop5(_methodName2) {
          var match = _methodName2.match(prefix);
          if (match) {
            switch (match[1]) {
              case 'before':
                mixable.___before((t, e, s, o, a) => {
                  if (e !== match[2]) {
                    return;
                  }
                  var method = base[_methodName2].bind(o);
                  return method(...a);
                });
                break;
              case 'after':
                mixable.___after((t, e, s, o, a) => {
                  if (e !== match[2]) {
                    return;
                  }
                  var method = base[_methodName2].bind(o);
                  return method(...a);
                });
                break;
            }
            return "continue";
          }
          if (allStatic[_methodName2]) {
            return "continue";
          }
          if (typeof base[_methodName2] !== 'function') {
            return "continue";
          }
          allStatic[_methodName2] = base[_methodName2];
        };
        for (var _methodName2 of staticNames) {
          var _ret3 = _loop5(_methodName2);
          if (_ret3 === "continue") continue;
        }
        var _loop6 = function _loop6(_methodName3) {
          var match = _methodName3.match(prefix);
          if (match) {
            switch (match[1]) {
              case 'before':
                mixable.___before((t, e, s, o, a) => {
                  if (e !== match[2]) {
                    return;
                  }
                  var method = base.prototype[_methodName3].bind(o);
                  return method(...a);
                });
                break;
              case 'after':
                mixable.___after((t, e, s, o, a) => {
                  if (e !== match[2]) {
                    return;
                  }
                  var method = base.prototype[_methodName3].bind(o);
                  return method(...a);
                });
                break;
            }
            return "continue";
          }
          if (allInstance[_methodName3]) {
            return "continue";
          }
          if (typeof base.prototype[_methodName3] !== 'function') {
            return "continue";
          }
          allInstance[_methodName3] = base.prototype[_methodName3];
        };
        for (var _methodName3 of instanceNames) {
          var _ret4 = _loop6(_methodName3);
          if (_ret4 === "continue") continue;
        }
      };
      for (var base = this; base && base.prototype; base = Object.getPrototypeOf(base)) {
        _loop3(base);
      }
      for (var methodName in allStatic) {
        mixinTo[methodName] = allStatic[methodName].bind(mixinTo);
      }
      var _loop4 = function _loop4(_methodName) {
        mixinTo.prototype[_methodName] = function (...args) {
          return allInstance[_methodName].apply(this, args);
        };
      };
      for (var _methodName in allInstance) {
        _loop4(_methodName);
      }
      return mixable;
    }
  }]);
  return Mixin;
}();
exports.Mixin = Mixin;
Mixin.Constructor = Constructor;
  })();
});

require.register("curvature/base/Router.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = void 0;
var _View = require("./View");
var _Cache = require("./Cache");
var _Config = require("./Config");
var _Routes = require("./Routes");
var _win$CustomEvent;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var NotFoundError = Symbol('NotFound');
var InternalError = Symbol('Internal');
var win = (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : void 0;
win.CustomEvent = (_win$CustomEvent = win.CustomEvent) !== null && _win$CustomEvent !== void 0 ? _win$CustomEvent : win.Event;
var Router = /*#__PURE__*/function () {
  function Router() {
    _classCallCheck(this, Router);
  }
  _createClass(Router, null, [{
    key: "wait",
    value: function wait(view, event = 'DOMContentLoaded', node = document) {
      node.addEventListener(event, () => {
        this.listen(view);
      });
    }
  }, {
    key: "listen",
    value: function listen(listener, routes = false) {
      this.listener = listener || this.listener;
      this.routes = routes || listener.routes;
      Object.assign(this.query, this.queryOver({}));
      var listen = event => {
        event.preventDefault();
        if (event.state && 'routedId' in event.state) {
          if (event.state.routedId <= this.routeCount) {
            this.history.splice(event.state.routedId);
            this.routeCount = event.state.routedId;
          } else if (event.state.routedId > this.routeCount) {
            this.history.push(event.state.prev);
            this.routeCount = event.state.routedId;
          }
          this.state = event.state;
        } else {
          if (this.prevPath !== null && this.prevPath !== location.pathname) {
            this.history.push(this.prevPath);
          }
        }
        if (!this.isOriginLimited(location)) {
          this.match(location.pathname, listener);
        } else {
          this.match(this.nextPath, listener);
        }
      };
      window.addEventListener('cvUrlChanged', listen);
      window.addEventListener('popstate', listen);
      var route = !this.isOriginLimited(location) ? location.pathname + location.search : false;
      if (!this.isOriginLimited(location) && location.hash) {
        route += location.hash;
      }
      var state = {
        routedId: this.routeCount,
        url: location.pathname,
        prev: this.prevPath
      };
      if (!this.isOriginLimited(location)) {
        history.replaceState(state, null, location.pathname);
      }
      this.go(route !== false ? route : '/');
    }
  }, {
    key: "go",
    value: function go(path, silent = false) {
      var configTitle = _Config.Config.get('title');
      if (configTitle) {
        document.title = configTitle;
      }
      var state = {
        routedId: this.routeCount,
        prev: this.prevPath,
        url: location.pathname
      };
      if (silent === -1) {
        this.match(path, this.listener, true);
      } else if (this.isOriginLimited(location)) {
        this.nextPath = path;
      } else if (silent === 2 && location.pathname !== path) {
        history.replaceState(state, null, path);
      } else if (location.pathname !== path) {
        history.pushState(state, null, path);
      }
      if (!silent || silent < 0) {
        if (silent === false) {
          this.path = null;
        }
        if (!silent) {
          if (path.substring(0, 1) === '#') {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          } else {
            window.dispatchEvent(new CustomEvent('cvUrlChanged'));
          }
        }
      }
      this.prevPath = path;
    }
  }, {
    key: "processRoute",
    value: function processRoute(routes, selected, args) {
      var result = false;
      if (typeof routes[selected] === 'function') {
        if (routes[selected].prototype instanceof _View.View) {
          result = new routes[selected](args);
        } else {
          result = routes[selected](args);
        }
      } else {
        result = routes[selected];
      }
      return result;
    }
  }, {
    key: "handleError",
    value: function handleError(error, routes, selected, args, listener, path, prev, forceRefresh) {
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('cvRouteError', {
          detail: {
            error: error,
            path: path,
            prev: prev,
            view: listener,
            routes: routes,
            selected: selected
          }
        }));
      }
      var result = win['devMode'] ? 'Unexpected error: ' + String(error) : 'Unexpected error.';
      if (routes[InternalError]) {
        args[InternalError] = error;
        result = this.processRoute(routes, InternalError, args);
      }
      this.update(listener, path, result, routes, selected, args, forceRefresh);
    }
  }, {
    key: "match",
    value: function match(path, listener, options = false) {
      var event = null,
        request = null,
        forceRefresh = false;
      if (options === true) {
        forceRefresh = options;
      }
      if (options && _typeof(options) === 'object') {
        forceRefresh = options.forceRefresh;
        event = options.event;
      }
      if (typeof document !== 'undefined' && this.path === path && !forceRefresh) {
        return;
      }
      var origin = 'http://example.com';
      if (typeof document !== 'undefined') {
        origin = this.isOriginLimited(location) ? origin : location.origin;
        this.queryString = location.search;
      }
      var url = new URL(path, origin);
      path = this.path = url.pathname;
      if (typeof document === 'undefined') {
        this.queryString = url.search;
      }
      var prev = this.prevPath;
      var current = listener && listener.args ? listener.args.content : null;
      var routes = this.routes || listener && listener.routes || _Routes.Routes.dump();
      var query = new URLSearchParams(this.queryString);
      if (event && event.request) {
        this.request = event.request;
      }
      for (var key in Object.keys(this.query)) {
        delete this.query[key];
      }
      for (var _ref3 of query) {
        var _ref2 = _slicedToArray(_ref3, 2);
        var _key = _ref2[0];
        var value = _ref2[1];
        this.query[_key] = value;
      }
      var args = {},
        selected = false,
        result = '';
      if (path.substring(0, 1) === '/') {
        path = path.substring(1);
      }
      path = path.split('/');
      for (var i in this.query) {
        args[i] = this.query[i];
      }
      L1: for (var _i2 in routes) {
        var route = _i2.split('/');
        if (route.length < path.length && route[route.length - 1] !== '*') {
          continue;
        }
        L2: for (var j in route) {
          if (route[j].substr(0, 1) == '%') {
            var argName = null;
            var groups = /^%(\w+)\??/.exec(route[j]);
            if (groups && groups[1]) {
              argName = groups[1];
            }
            if (!argName) {
              throw new Error("".concat(route[j], " is not a valid argument segment in route \"").concat(_i2, "\""));
            }
            if (!path[j]) {
              if (route[j].substr(route[j].length - 1, 1) == '?') {
                args[argName] = '';
              } else {
                continue L1;
              }
            } else {
              args[argName] = path[j];
            }
          } else if (route[j] !== '*' && path[j] !== route[j]) {
            continue L1;
          }
        }
        selected = _i2;
        result = routes[_i2];
        if (route[route.length - 1] === '*') {
          args.pathparts = path.slice(route.length - 1);
        }
        break;
      }
      var eventStart = new CustomEvent('cvRouteStart', {
        cancelable: true,
        detail: {
          path: path,
          prev: prev,
          root: listener,
          selected: selected,
          routes: routes
        }
      });
      if (typeof document !== 'undefined') {
        if (!document.dispatchEvent(eventStart)) {
          return;
        }
      }
      if (!forceRefresh && listener && current && _typeof(result) === 'object' && current.constructor === result.constructor && !(result instanceof Promise) && current.update(args)) {
        listener.args.content = current;
        return true;
      }
      if (!(selected in routes)) {
        routes[selected] = routes[NotFoundError];
      }
      try {
        result = this.processRoute(routes, selected, args);
        if (result === false) {
          result = this.processRoute(routes, NotFoundError, args);
        }
        if (typeof document === 'undefined') {
          if (!(result instanceof Promise)) {
            return Promise.resolve(result);
          }
          return result;
        }
        if (!(result instanceof Promise)) {
          return this.update(listener, path, result, routes, selected, args, forceRefresh);
        }
        return result.then(realResult => this.update(listener, path, realResult, routes, selected, args, forceRefresh)).catch(error => {
          this.handleError(error, routes, selected, args, listener, path, prev, forceRefresh);
        });
      } catch (error) {
        this.handleError(error, routes, selected, args, listener, path, prev, forceRefresh);
      }
    }
  }, {
    key: "update",
    value: function update(listener, path, result, routes, selected, args, forceRefresh) {
      if (!listener) {
        return;
      }
      var prev = this.prevPath;
      var event = new CustomEvent('cvRoute', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          prev: prev,
          view: listener,
          routes: routes,
          selected: selected
        }
      });
      if (result !== false) {
        if (listener.args.content instanceof _View.View) {
          listener.args.content.pause(true);
          listener.args.content.remove();
        }
        if (document.dispatchEvent(event)) {
          listener.args.content = result;
        }
        if (result instanceof _View.View) {
          result.pause(false);
          result.update(args, forceRefresh);
        }
      }
      var eventEnd = new CustomEvent('cvRouteEnd', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          prev: prev,
          view: listener,
          routes: routes,
          selected: selected
        }
      });
      document.dispatchEvent(eventEnd);
    }
  }, {
    key: "isOriginLimited",
    value: function isOriginLimited({
      origin: origin
    }) {
      return origin === 'null' || origin === 'file://';
    }
  }, {
    key: "queryOver",
    value: function queryOver(args = {}) {
      var params = new URLSearchParams(location.search);
      var finalArgs = {};
      var query = {};
      for (var pair of params) {
        query[pair[0]] = pair[1];
      }
      finalArgs = Object.assign(finalArgs, query, args);
      delete finalArgs['api'];
      return finalArgs;

      // for(let i in query)
      // {
      // 	finalArgs[i] = query[i];
      // }

      // for(let i in args)
      // {
      // 	finalArgs[i] = args[i];
      // }
    }
  }, {
    key: "queryToString",
    value: function queryToString(args = {}, fresh = false) {
      var parts = [],
        finalArgs = args;
      if (!fresh) {
        finalArgs = this.queryOver(args);
      }
      for (var i in finalArgs) {
        if (finalArgs[i] === '') {
          continue;
        }
        parts.push(i + '=' + encodeURIComponent(finalArgs[i]));
      }
      return parts.join('&');
    }
  }, {
    key: "setQuery",
    value: function setQuery(name, value, silent) {
      var args = this.queryOver();
      args[name] = value;
      if (value === undefined) {
        delete args[name];
      }
      var queryString = this.queryToString(args, true);
      this.go(location.pathname + (queryString ? '?' + queryString : '?'), silent);
    }
  }]);
  return Router;
}();
exports.Router = Router;
Object.defineProperty(Router, 'query', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: {}
});
Object.defineProperty(Router, 'history', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: []
});
Object.defineProperty(Router, 'routeCount', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: 0
});
Object.defineProperty(Router, 'prevPath', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: null
});
Object.defineProperty(Router, 'queryString', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: null
});
Object.defineProperty(Router, 'InternalError', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: InternalError
});
Object.defineProperty(Router, 'NotFoundError', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NotFoundError
});
  })();
});

require.register("curvature/base/Routes.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var AppRoutes = {};
var _require = require;
var imported = false;
var runImport = () => {
  if (imported) {
    return;
  }
  ;
  try {
    Object.assign(AppRoutes, _require('Routes').Routes || {});
  } catch (error) {
    globalThis.devMode === true && console.warn(error);
  }
  imported = true;
};
var Routes = /*#__PURE__*/function () {
  function Routes() {
    _classCallCheck(this, Routes);
  }
  _createClass(Routes, null, [{
    key: "get",
    value: function get(name) {
      runImport();
      return this.routes[name];
    }
  }, {
    key: "dump",
    value: function dump() {
      runImport();
      return this.routes;
    }
  }]);
  return Routes;
}();
exports.Routes = Routes;
Object.defineProperty(Routes, 'routes', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: AppRoutes
});
  })();
});

require.register("curvature/base/RuleSet.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleSet = void 0;
var _Dom = require("./Dom");
var _Tag = require("./Tag");
var _View = require("./View");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var RuleSet = /*#__PURE__*/function () {
  function RuleSet() {
    _classCallCheck(this, RuleSet);
  }
  _createClass(RuleSet, [{
    key: "add",
    value: function add(selector, callback) {
      this.rules = this.rules || {};
      this.rules[selector] = this.rules[selector] || [];
      this.rules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply(doc = document, view = null) {
      RuleSet.apply(doc, view);
      for (var selector in this.rules) {
        for (var i in this.rules[selector]) {
          var callback = this.rules[selector][i];
          var wrapped = RuleSet.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);
          for (var node of nodes) {
            wrapped(node);
          }
        }
      }
    }
  }, {
    key: "purge",
    value: function purge() {
      if (!this.rules) {
        return;
      }
      for (var _ref3 of Object.entries(this.rules)) {
        var _ref2 = _slicedToArray(_ref3, 2);
        var k = _ref2[0];
        var v = _ref2[1];
        if (!this.rules[k]) {
          continue;
        }
        for (var kk in this.rules[k]) {
          delete this.rules[k][kk];
        }
      }
    }
  }], [{
    key: "add",
    value: function add(selector, callback) {
      this.globalRules = this.globalRules || {};
      this.globalRules[selector] = this.globalRules[selector] || [];
      this.globalRules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply(doc = document, view = null) {
      for (var selector in this.globalRules) {
        for (var i in this.globalRules[selector]) {
          var callback = this.globalRules[selector][i];
          var wrapped = this.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);
          for (var node of nodes) {
            wrapped(node);
          }
        }
      }
    }
  }, {
    key: "wait",
    value: function wait(event = 'DOMContentLoaded', node = document) {
      var listener = ((event, node) => () => {
        node.removeEventListener(event, listener);
        return this.apply();
      })(event, node);
      node.addEventListener(event, listener);
    }
  }, {
    key: "wrap",
    value: function wrap(doc, originalCallback, view = null) {
      var callback = originalCallback;
      if (originalCallback instanceof _View.View || originalCallback && originalCallback.prototype && originalCallback.prototype instanceof _View.View) {
        callback = () => originalCallback;
      }
      return element => {
        if (typeof element.___cvApplied___ === 'undefined') {
          Object.defineProperty(element, '___cvApplied___', {
            enumerable: false,
            writable: false,
            value: new WeakSet()
          });
        }
        if (element.___cvApplied___.has(originalCallback)) {
          return;
        }
        var direct, parentView;
        if (view) {
          direct = parentView = view;
          if (view.viewList) {
            parentView = view.viewList.parent;
          }
        }
        var tag = new _Tag.Tag(element, parentView, null, undefined, direct);
        var parent = tag.element.parentNode;
        var sibling = tag.element.nextSibling;
        var result = callback(tag);
        if (result !== false) {
          element.___cvApplied___.add(originalCallback);
        }
        if (result instanceof HTMLElement) {
          result = new _Tag.Tag(result);
        }
        if (result instanceof _Tag.Tag) {
          if (!result.element.contains(tag.element)) {
            while (tag.element.firstChild) {
              result.element.appendChild(tag.element.firstChild);
            }
            tag.remove();
          }
          if (sibling) {
            parent.insertBefore(result.element, sibling);
          } else {
            parent.appendChild(result.element);
          }
        }
        if (result && result.prototype && result.prototype instanceof _View.View) {
          result = new result({}, view);
        }
        if (result instanceof _View.View) {
          if (view) {
            view.cleanup.push(() => result.remove());
            view.cleanup.push(view.args.bindTo((v, k, t) => {
              t[k] = v;
              result.args[k] = v;
            }));
            view.cleanup.push(result.args.bindTo((v, k, t, d) => {
              t[k] = v;
              view.args[k] = v;
            }));
          }
          tag.clear();
          result.render(tag.element);
        }
      };
    }
  }]);
  return RuleSet;
}();
exports.RuleSet = RuleSet;
  })();
});

require.register("curvature/base/SetMap.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetMap = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SetMap = /*#__PURE__*/function () {
  function SetMap() {
    _classCallCheck(this, SetMap);
    _defineProperty(this, "_map", new Map());
  }
  _createClass(SetMap, [{
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "getOne",
    value: function getOne(key) {
      var set = this.get(key);
      for (var entry of set) {
        return entry;
      }
    }
  }, {
    key: "add",
    value: function add(key, value) {
      var set = this._map.get(key);
      if (!set) {
        this._map.set(key, set = new Set());
      }
      return set.add(value);
    }
  }, {
    key: "remove",
    value: function remove(key, value) {
      var set = this._map.get(key);
      if (!set) {
        return;
      }
      var res = set.delete(value);
      if (!set.size) {
        this._map.delete(key);
      }
      return res;
    }
  }, {
    key: "values",
    value: function values() {
      return new Set(...[...this._map.values()].map(set => [...set.values()]));
    }
  }]);
  return SetMap;
}();
exports.SetMap = SetMap;
  })();
});

require.register("curvature/base/Tag.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tag = void 0;
var _Bindable = require("./Bindable");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CurrentStyle = Symbol('CurrentStyle');
var styler = function styler(styles) {
  if (!this.node) {
    return;
  }
  for (var property in styles) {
    var stringedProperty = String(styles[property]);
    if (this[CurrentStyle].has(property) && this[CurrentStyle].get(property) === styles[property]) {
      continue;
    }
    if (property[0] === '-') {
      this.node.style.setProperty(property, stringedProperty);
    } else {
      this.node.style[property] = stringedProperty;
    }
    if (styles[property] !== undefined) {
      this[CurrentStyle].set(property, styles[property]);
    } else {
      this[CurrentStyle].delete(property);
    }
  }
};
var getter = function getter(name) {
  if (typeof this[name] === 'function') {
    return this[name];
  }
  if (this.node && typeof this.node[name] === 'function') {
    return this[name] = (...args) => this.node[name](...args);
  }
  if (name === 'style') {
    return this.proxy.style;
  }
  if (this.node && name in this.node) {
    return this.node[name];
  }
  return this[name];
};
var Tag = /*#__PURE__*/function () {
  function Tag(element, parent, ref, index, direct) {
    _classCallCheck(this, Tag);
    if (typeof element === 'string') {
      var subdoc = document.createRange().createContextualFragment(element);
      element = subdoc.firstChild;
    }
    this.element = _Bindable.Bindable.makeBindable(element);
    this.node = this.element;
    this.parent = parent;
    this.direct = direct;
    this.ref = ref;
    this.index = index;
    this.cleanup = [];
    this[_Bindable.Bindable.OnAllGet] = getter.bind(this);
    this[CurrentStyle] = new Map();
    var boundStyler = _Bindable.Bindable.make(styler.bind(this));
    Object.defineProperty(this, 'style', {
      value: boundStyler
    });
    this.proxy = _Bindable.Bindable.make(this);
    this.proxy.style.bindTo((v, k, t, d) => {
      if (this[CurrentStyle].has(k) && this[CurrentStyle].get(k) === v) {
        return;
      }
      this.node.style[k] = v;
      if (!d && v !== undefined) {
        this[CurrentStyle].set(k, v);
      } else {
        this[CurrentStyle].delete(k);
      }
    });
    this.proxy.bindTo((v, k) => {
      if (k === 'index') {
        return;
      }
      if (k in element && element[k] !== v) {
        element[k] = v;
      }
      return false;
    });
    return this.proxy;
  }
  _createClass(Tag, [{
    key: "attr",
    value: function attr(attributes) {
      for (var attribute in attributes) {
        if (attributes[attribute] === undefined) {
          this.node.removeAttribute(attribute);
        } else if (attributes[attribute] === null) {
          this.node.setAttribute(attribute, '');
        } else {
          this.node.setAttribute(attribute, attributes[attribute]);
        }
      }
      return this;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.node) {
        this.node.remove();
      }
      _Bindable.Bindable.clearBindings(this);
      var cleanup;
      while (cleanup = this.cleanup.shift()) {
        cleanup();
      }
      this.clear();
      if (!this.node) {
        return;
      }
      var detachEvent = new Event('cvDomDetached');
      this.node.dispatchEvent(detachEvent);
      this.node = this.element = this.ref = this.parent = undefined;
    }
  }, {
    key: "clear",
    value: function clear() {
      if (!this.node) {
        return;
      }
      var detachEvent = new Event('cvDomDetached');
      while (this.node.firstChild) {
        this.node.firstChild.dispatchEvent(detachEvent);
        this.node.removeChild(this.node.firstChild);
      }
    }
  }, {
    key: "pause",
    value: function pause(paused = true) {}
  }, {
    key: "listen",
    value: function listen(eventName, callback, options) {
      var node = this.node;
      node.addEventListener(eventName, callback, options);
      var remove = () => {
        node.removeEventListener(eventName, callback, options);
      };
      var remover = () => {
        remove();
        remove = () => console.warn('Already removed!');
      };
      this.parent.onRemove(() => remover());
      return remover;
    }
  }]);
  return Tag;
}();
exports.Tag = Tag;
  })();
});

require.register("curvature/base/Uuid.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uuid = void 0;
var _Symbol$toPrimitive;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var win = (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object' ? self : void 0;
var crypto = win.crypto;
_Symbol$toPrimitive = Symbol.toPrimitive;
var Uuid = /*#__PURE__*/function () {
  function Uuid(uuid = null, version = 4) {
    _classCallCheck(this, Uuid);
    _defineProperty(this, "uuid", null);
    _defineProperty(this, "version", 4);
    if (uuid) {
      if (typeof uuid !== 'string' && !(uuid instanceof Uuid) || !uuid.match(/[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}/)) {
        throw new Error("Invalid input for Uuid: \"".concat(uuid, "\""));
      }
      this.version = version;
      this.uuid = uuid;
    } else if (crypto && typeof crypto.randomUUID === 'function') {
      this.uuid = crypto.randomUUID();
    } else {
      var init = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
      var rand = crypto && typeof crypto.randomUUID === 'function' ? () => crypto.getRandomValues(new Uint8Array(1))[0] : () => Math.trunc(Math.random() * 256);
      this.uuid = init.replace(/[018]/g, c => (c ^ rand() & 15 >> c / 4).toString(16));
    }
    Object.freeze(this);
  }
  _createClass(Uuid, [{
    key: _Symbol$toPrimitive,
    value: function value() {
      return this.toString();
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.uuid;
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return {
        version: this.version,
        uuid: this.uuid
      };
    }
  }]);
  return Uuid;
}();
exports.Uuid = Uuid;
  })();
});

require.register("curvature/base/View.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;
var _Bindable = require("./Bindable");
var _ViewList = require("./ViewList");
var _Router = require("./Router");
var _Uuid = require("./Uuid");
var _Dom = require("./Dom");
var _Tag = require("./Tag");
var _Bag = require("./Bag");
var _RuleSet = require("./RuleSet");
var _Mixin = require("./Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var dontParse = Symbol('dontParse');
var expandBind = Symbol('expandBind');
var uuid = Symbol('uuid');
var View = /*#__PURE__*/function (_Mixin$with) {
  _inherits(View, _Mixin$with);
  var _super = _createSuper(View);
  function View(args = {}, mainView = null) {
    var _this;
    _classCallCheck(this, View);
    _this = _super.call(this, args, mainView);
    _this[_EventTargetMixin.EventTargetMixin.Parent] = mainView;
    Object.defineProperty(_assertThisInitialized(_this), 'args', {
      value: _Bindable.Bindable.make(args)
    });
    Object.defineProperty(_assertThisInitialized(_this), uuid, {
      value: _this.constructor.uuid()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'nodesAttached', {
      value: new _Bag.Bag((i, s, a) => {})
    });
    Object.defineProperty(_assertThisInitialized(_this), 'nodesDetached', {
      value: new _Bag.Bag((i, s, a) => {})
    });
    Object.defineProperty(_assertThisInitialized(_this), '_onRemove', {
      value: new _Bag.Bag((i, s, a) => {})
    });
    Object.defineProperty(_assertThisInitialized(_this), 'cleanup', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'parent', {
      value: mainView,
      writable: true
    });
    Object.defineProperty(_assertThisInitialized(_this), 'views', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'viewLists', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'withViews', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'tags', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(_assertThisInitialized(_this), 'nodes', {
      value: _Bindable.Bindable.make([])
    });
    Object.defineProperty(_assertThisInitialized(_this), 'timeouts', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'intervals', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'frames', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'ruleSet', {
      value: new _RuleSet.RuleSet()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'preRuleSet', {
      value: new _RuleSet.RuleSet()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'subBindings', {
      value: {}
    });
    Object.defineProperty(_assertThisInitialized(_this), 'templates', {
      value: {}
    });
    Object.defineProperty(_assertThisInitialized(_this), 'postMapping', {
      value: new Set()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'eventCleanup', {
      value: []
    });
    Object.defineProperty(_assertThisInitialized(_this), 'unpauseCallbacks', {
      value: new Map()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'interpolateRegex', {
      value: /(\[\[((?:\$+)?[\w\.\|-]+)\]\])/g
    });
    Object.defineProperty(_assertThisInitialized(_this), 'rendered', {
      value: new Promise((accept, reject) => Object.defineProperty(_assertThisInitialized(_this), 'renderComplete', {
        value: accept
      }))
    });
    _this.onRemove(() => {
      if (!_this[_EventTargetMixin.EventTargetMixin.Parent]) {
        return;
      }
      _this[_EventTargetMixin.EventTargetMixin.Parent] = null;
    });
    _this.controller = _assertThisInitialized(_this);
    _this.template = "";
    _this.firstNode = null;
    _this.lastNode = null;
    _this.viewList = null;
    _this.mainView = null;
    _this.preserve = false;
    _this.removed = false;
    _this.loaded = Promise.resolve(_assertThisInitialized(_this));

    // return Bindable.make(this);
    return _this;
  }
  _createClass(View, [{
    key: "_id",
    get: function get() {
      return this[uuid];
    }
  }, {
    key: "onFrame",
    value: function onFrame(callback) {
      var stopped = false;
      var cancel = () => {
        stopped = true;
      };
      var c = timestamp => {
        if (this.removed || stopped) {
          return;
        }
        if (!this.paused) {
          callback(Date.now());
        }
        requestAnimationFrame(c);
      };
      requestAnimationFrame(() => c(Date.now()));
      this.frames.push(cancel);
      return cancel;
    }
  }, {
    key: "onNextFrame",
    value: function onNextFrame(callback) {
      return requestAnimationFrame(() => callback(Date.now()));
    }
  }, {
    key: "onIdle",
    value: function onIdle(callback) {
      return requestIdleCallback(() => callback(Date.now()));
    }
  }, {
    key: "onTimeout",
    value: function onTimeout(time, callback) {
      var timeoutInfo = {
        timeout: null,
        callback: null,
        time: time,
        fired: false,
        created: new Date().getTime(),
        paused: false
      };
      var wrappedCallback = () => {
        callback();
        timeoutInfo.fired = true;
        this.timeouts.delete(timeoutInfo.timeout);
      };
      var timeout = setTimeout(wrappedCallback, time);
      timeoutInfo.callback = wrappedCallback;
      timeoutInfo.timeout = timeout;
      this.timeouts.set(timeoutInfo.timeout, timeoutInfo);
      return timeout;
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout(_x) {
        return _clearTimeout.apply(this, arguments);
      }
      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };
      return clearTimeout;
    }(function (timeout) {
      if (!this.timeouts.has(timeout)) {
        return;
      }
      var timeoutInfo = this.timeouts.get(timeout);
      clearTimeout(timeoutInfo.timeout);
      this.timeouts.delete(timeoutInfo.timeout);
    })
  }, {
    key: "onInterval",
    value: function onInterval(time, callback) {
      var timeout = setInterval(callback, time);
      this.intervals.set(timeout, {
        timeout: timeout,
        callback: callback,
        time: time,
        paused: false
      });
      return timeout;
    }
  }, {
    key: "clearInterval",
    value: function clearInterval(timeout) {
      if (!this.intervals.has(timeout)) {
        return;
      }
      var timeoutInfo = this.intervals.get(timeout);
      clearTimeout(timeoutInfo.timeout);
      this.intervals.delete(timeoutInfo.timeout);
    }
  }, {
    key: "pause",
    value: function pause(paused = undefined) {
      if (paused === undefined) {
        this.paused = !this.paused;
      }
      this.paused = paused;
      if (this.paused) {
        for (var _ref3 of this.timeouts) {
          var _ref2 = _slicedToArray(_ref3, 2);
          var callback = _ref2[0];
          var timeout = _ref2[1];
          if (timeout.fired) {
            this.timeouts.delete(timeout.timeout);
            continue;
          }
          clearTimeout(timeout.timeout);
          timeout.paused = true;
          timeout.time = Math.max(0, timeout.time - (Date.now() - timeout.created));
        }
        for (var _ref6 of this.intervals) {
          var _ref5 = _slicedToArray(_ref6, 2);
          var _callback = _ref5[0];
          var _timeout = _ref5[1];
          clearInterval(_timeout.timeout);
          _timeout.paused = true;
        }
      } else {
        for (var _ref9 of this.timeouts) {
          var _ref8 = _slicedToArray(_ref9, 2);
          var _callback2 = _ref8[0];
          var _timeout2 = _ref8[1];
          if (!_timeout2.paused) {
            continue;
          }
          if (_timeout2.fired) {
            this.timeouts.delete(_timeout2.timeout);
            continue;
          }
          _timeout2.timeout = setTimeout(_timeout2.callback, _timeout2.time);
          _timeout2.paused = false;
        }
        for (var _ref12 of this.intervals) {
          var _ref11 = _slicedToArray(_ref12, 2);
          var _callback3 = _ref11[0];
          var _timeout3 = _ref11[1];
          if (!_timeout3.paused) {
            continue;
          }
          _timeout3.timeout = setInterval(_timeout3.callback, _timeout3.time);
          _timeout3.paused = false;
        }
        for (var _ref15 of this.unpauseCallbacks) {
          var _ref14 = _slicedToArray(_ref15, 2);
          var _callback4 = _ref14[1];
          _callback4();
        }
        this.unpauseCallbacks.clear();
      }
      for (var _ref18 of this.viewLists) {
        var _ref17 = _slicedToArray(_ref18, 2);
        var tag = _ref17[0];
        var viewList = _ref17[1];
        viewList.pause(!!paused);
      }
      for (var i in this.tags) {
        if (Array.isArray(this.tags[i])) {
          for (var j in this.tags[i]) {
            this.tags[i][j].pause(!!paused);
          }
          continue;
        }
        this.tags[i].pause(!!paused);
      }
    }
  }, {
    key: "render",
    value: function render(parentNode = null, insertPoint = null, outerView = null) {
      var document = globalThis.window.document;
      if (parentNode instanceof View) {
        parentNode = parentNode.firstNode.parentNode;
      }
      if (insertPoint instanceof View) {
        insertPoint = insertPoint.firstNode;
      }
      if (this.firstNode) {
        return this.reRender(parentNode, insertPoint, outerView);
      }
      this.dispatchEvent(new CustomEvent('render'));
      var templateIsFragment = _typeof(this.template) === 'object' && typeof this.template.cloneNode === 'function';
      var templateParsed = templateIsFragment || View.templates.has(this.template);
      var subDoc;
      if (templateParsed) {
        if (templateIsFragment) {
          subDoc = this.template.cloneNode(true);
        } else {
          subDoc = View.templates.get(this.template).cloneNode(true);
        }
      } else {
        subDoc = document.createRange().createContextualFragment(this.template);
      }
      if (!templateParsed && !templateIsFragment) {
        View.templates.set(this.template, subDoc.cloneNode(true));
      }
      this.mainView || this.preRuleSet.apply(subDoc, this);
      this.mapTags(subDoc);
      this.mainView || this.ruleSet.apply(subDoc, this);
      if (globalThis.devMode === true) {
        this.firstNode = document.createComment("Template ".concat(this._id, " Start"));
        this.lastNode = document.createComment("Template ".concat(this._id, " End"));
      } else {
        this.firstNode = document.createTextNode('');
        this.lastNode = document.createTextNode('');
      }
      this.nodes.push(this.firstNode, ...Array.from(subDoc.childNodes), this.lastNode);
      this.postRender(parentNode);
      this.dispatchEvent(new CustomEvent('rendered'));
      if (!this.dispatchAttach()) {
        return;
      }
      if (parentNode) {
        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }
        parentNode.insertBefore(subDoc, this.lastNode);
        var rootNode = parentNode.getRootNode();
        if (rootNode.isConnected) {
          this.attached(rootNode, parentNode);
          this.dispatchAttached(rootNode, parentNode, outerView);
        } else if (outerView) {
          var firstDomAttach = event => {
            var rootNode = parentNode.getRootNode();
            this.attached(rootNode, parentNode);
            this.dispatchAttached(rootNode, parentNode, outerView);
            outerView.removeEventListener('attached', firstDomAttach);
          };
          outerView.addEventListener('attached', firstDomAttach);
        }
      }
      this.renderComplete(this.nodes);
      return this.nodes;
    }
  }, {
    key: "dispatchAttach",
    value: function dispatchAttach() {
      var CustomEvent = globalThis.window.CustomEvent;
      return this.dispatchEvent(new CustomEvent('attach', {
        cancelable: true,
        target: this
      }));
    }
  }, {
    key: "dispatchAttached",
    value: function dispatchAttached(rootNode, parentNode, view = undefined) {
      var CustomEvent = globalThis.window.CustomEvent;
      this.dispatchEvent(new CustomEvent('attached', {
        detail: {
          view: view || this,
          node: parentNode,
          root: rootNode,
          mainView: this
        }
      }));
      this.dispatchDomAttached(view);
      for (var callback of this.nodesAttached.items()) {
        callback(rootNode, parentNode);
      }
    }
  }, {
    key: "dispatchDomAttached",
    value: function dispatchDomAttached(view) {
      var _globalThis$window = globalThis.window,
        Node = _globalThis$window.Node,
        CustomEvent = _globalThis$window.CustomEvent;
      this.nodes.filter(n => n.nodeType !== Node.COMMENT_NODE).forEach(child => {
        if (!child.matches) {
          return;
        }
        child.dispatchEvent(new CustomEvent('cvDomAttached', {
          target: child,
          detail: {
            view: view || this,
            mainView: this
          }
        }));
        _Dom.Dom.mapTags(child, false, (tag, walker) => {
          if (!tag.matches) {
            return;
          }
          tag.dispatchEvent(new CustomEvent('cvDomAttached', {
            target: tag,
            detail: {
              view: view || this,
              mainView: this
            }
          }));
        });
      });
    }
  }, {
    key: "reRender",
    value: function reRender(parentNode, insertPoint, outerView) {
      var CustomEvent = globalThis.window.CustomEvent;
      var willReRender = this.dispatchEvent(new CustomEvent('reRender'), {
        cancelable: true,
        target: this,
        view: outerView
      });
      if (!willReRender) {
        return;
      }
      var subDoc = new DocumentFragment();
      if (this.firstNode.isConnected) {
        var detach = this.nodesDetached.items();
        for (var i in detach) {
          detach[i]();
        }
      }
      subDoc.append(...this.nodes);
      if (parentNode) {
        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }
        parentNode.insertBefore(subDoc, this.lastNode);
        this.dispatchEvent(new CustomEvent('reRendered'), {
          cancelable: true,
          target: this,
          view: outerView
        });
        var rootNode = parentNode.getRootNode();
        if (rootNode.isConnected) {
          this.attached(rootNode, parentNode);
          this.dispatchAttached(rootNode, parentNode);
        }
      }
      return this.nodes;
    }
  }, {
    key: "mapTags",
    value: function mapTags(subDoc) {
      _Dom.Dom.mapTags(subDoc, false, (tag, walker) => {
        if (tag[dontParse]) {
          return;
        }
        if (tag.matches) {
          tag = this.mapInterpolatableTag(tag);
          tag = tag.matches('[cv-template]') && this.mapTemplateTag(tag) || tag;
          tag = tag.matches('[cv-slot]') && this.mapSlotTag(tag) || tag;
          tag = tag.matches('[cv-prerender]') && this.mapPrendererTag(tag) || tag;
          tag = tag.matches('[cv-link]') && this.mapLinkTag(tag) || tag;
          tag = tag.matches('[cv-attr]') && this.mapAttrTag(tag) || tag;
          tag = tag.matches('[cv-expand]') && this.mapExpandableTag(tag) || tag;
          tag = tag.matches('[cv-ref]') && this.mapRefTag(tag) || tag;
          tag = tag.matches('[cv-on]') && this.mapOnTag(tag) || tag;
          tag = tag.matches('[cv-each]') && this.mapEachTag(tag) || tag;
          tag = tag.matches('[cv-bind]') && this.mapBindTag(tag) || tag;
          tag = tag.matches('[cv-with]') && this.mapWithTag(tag) || tag;
          tag = tag.matches('[cv-if]') && this.mapIfTag(tag) || tag;
          tag = tag.matches('[cv-view]') && this.mapViewTag(tag) || tag;
        } else {
          tag = this.mapInterpolatableTag(tag);
        }
        if (tag !== walker.currentNode) {
          walker.currentNode = tag;
        }
      });
      this.postMapping.forEach(c => c());
    }
  }, {
    key: "mapExpandableTag",
    value: function mapExpandableTag(tag) {
      // const tagCompiler = this.compileExpandableTag(tag);
      // const newTag = tagCompiler(this);
      // tag.replaceWith(newTag);
      // return newTag;

      var existing = tag[expandBind];
      if (existing) {
        existing();
        tag[expandBind] = false;
      }
      var _Bindable$resolve = _Bindable.Bindable.resolve(this.args, tag.getAttribute('cv-expand'), true),
        _Bindable$resolve2 = _slicedToArray(_Bindable$resolve, 2),
        proxy = _Bindable$resolve2[0],
        expandProperty = _Bindable$resolve2[1];
      tag.removeAttribute('cv-expand');
      if (!proxy[expandProperty]) {
        proxy[expandProperty] = {};
      }
      proxy[expandProperty] = _Bindable.Bindable.make(proxy[expandProperty]);
      this.onRemove(tag[expandBind] = proxy[expandProperty].bindTo((v, k, t, d, p) => {
        if (d || v === undefined) {
          tag.removeAttribute(k, v);
          return;
        }
        if (v === null) {
          tag.setAttribute(k, '');
          return;
        }
        tag.setAttribute(k, v);
      }));

      // let expandProperty = tag.getAttribute('cv-expand');
      // let expandArg = Bindable.makeBindable(
      // 	this.args[expandProperty] || {}
      // );

      // tag.removeAttribute('cv-expand');

      // for(let i in expandArg)
      // {
      // 	if(i === 'name' || i === 'type')
      // 	{
      // 		continue;
      // 	}

      // 	let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
      // 		tag.setAttribute(i, v);
      // 	})(tag,i));

      // 	this.onRemove(()=>{
      // 		debind();
      // 		if(expandArg.isBound())
      // 		{
      // 			Bindable.clearBindings(expandArg);
      // 		}
      // 	});
      // }

      return tag;
    }

    // compileExpandableTag(sourceTag)
    // {
    // 	return (bindingView) => {

    // 		const tag = sourceTag.cloneNode(true);

    // 		let expandProperty = tag.getAttribute('cv-expand');
    // 		let expandArg = Bindable.make(
    // 			bindingView.args[expandProperty] || {}
    // 		);

    // 		tag.removeAttribute('cv-expand');

    // 		for(let i in expandArg)
    // 		{
    // 			if(i === 'name' || i === 'type')
    // 			{
    // 				continue;
    // 			}

    // 			let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
    // 				tag.setAttribute(i, v);
    // 			})(tag,i));

    // 			bindingView.onRemove(()=>{
    // 				debind();
    // 				if(expandArg.isBound())
    // 				{
    // 					Bindable.clearBindings(expandArg);
    // 				}
    // 			});
    // 		}

    // 		return tag;
    // 	};
    // }
  }, {
    key: "mapAttrTag",
    value: function mapAttrTag(tag) {
      var tagCompiler = this.compileAttrTag(tag);
      var newTag = tagCompiler(this);
      tag.replaceWith(newTag);
      return newTag;

      // let attrProperty = tag.getAttribute('cv-attr');

      // tag.removeAttribute('cv-attr');

      // let pairs = attrProperty.split(',');
      // let attrs = pairs.map((p) => p.split(':'));

      // for (let i in attrs)
      // {
      // 	let proxy        = this.args;
      // 	let bindProperty = attrs[i][1];
      // 	let property     = bindProperty;

      // 	if(bindProperty.match(/\./))
      // 	{
      // 		[proxy, property] = Bindable.resolve(
      // 			this.args
      // 			, bindProperty
      // 			, true
      // 		);
      // 	}

      // 	let attrib = attrs[i][0];

      // 	this.onRemove(proxy.bindTo(
      // 		property
      // 		, (v)=>{
      // 			if(v == null)
      // 			{
      // 				tag.setAttribute(attrib, '');
      // 				return;
      // 			}
      // 			tag.setAttribute(attrib, v);
      // 		}
      // 	));
      // }

      // return tag;
    }
  }, {
    key: "compileAttrTag",
    value: function compileAttrTag(sourceTag) {
      var attrProperty = sourceTag.getAttribute('cv-attr');
      var pairs = attrProperty.split(/[,;]/);
      var attrs = pairs.map(p => p.split(':'));
      sourceTag.removeAttribute('cv-attr');
      return bindingView => {
        var tag = sourceTag.cloneNode(true);
        var _loop = function _loop() {
          var bindProperty = attrs[i][1] || attrs[i][0];
          var _Bindable$resolve3 = _Bindable.Bindable.resolve(bindingView.args, bindProperty, true),
            _Bindable$resolve4 = _slicedToArray(_Bindable$resolve3, 2),
            proxy = _Bindable$resolve4[0],
            property = _Bindable$resolve4[1];
          var attrib = attrs[i][0];
          bindingView.onRemove(proxy.bindTo(property, (v, k, t, d) => {
            if (d || v === undefined) {
              tag.removeAttribute(attrib, v);
              return;
            }
            if (v === null) {
              tag.setAttribute(attrib, '');
              return;
            }
            tag.setAttribute(attrib, v);
          }));
        };
        for (var i in attrs) {
          _loop();
        }
        return tag;
      };
    }
  }, {
    key: "mapInterpolatableTag",
    value: function mapInterpolatableTag(tag) {
      var _this2 = this;
      var regex = this.interpolateRegex;
      var _globalThis$window2 = globalThis.window,
        Node = _globalThis$window2.Node,
        document = _globalThis$window2.document;
      if (tag.nodeType === Node.TEXT_NODE) {
        var original = tag.nodeValue;
        if (!this.interpolatable(original)) {
          return tag;
        }
        var header = 0;
        var match;
        var _loop2 = function _loop2() {
          var bindProperty = match[2];
          var unsafeHtml = false;
          var unsafeView = false;
          var propertySplit = bindProperty.split('|');
          var transformer = false;
          if (propertySplit.length > 1) {
            transformer = _this2.stringTransformer(propertySplit.slice(1));
            bindProperty = propertySplit[0];
          }
          if (bindProperty.substr(0, 2) === '$$') {
            unsafeHtml = true;
            unsafeView = true;
            bindProperty = bindProperty.substr(2);
          }
          if (bindProperty.substr(0, 1) === '$') {
            unsafeHtml = true;
            bindProperty = bindProperty.substr(1);
          }
          if (bindProperty.substr(0, 3) === '000') {
            expand = true;
            bindProperty = bindProperty.substr(3);
            return "continue";
          }
          var staticPrefix = original.substring(header, match.index);
          header = match.index + match[1].length;
          var staticNode = document.createTextNode(staticPrefix);
          staticNode[dontParse] = true;
          tag.parentNode.insertBefore(staticNode, tag);
          var dynamicNode;
          if (unsafeHtml) {
            dynamicNode = document.createElement('div');
          } else {
            dynamicNode = document.createTextNode('');
          }
          dynamicNode[dontParse] = true;
          var proxy = _this2.args;
          var property = bindProperty;
          if (bindProperty.match(/\./)) {
            var _Bindable$resolve5 = _Bindable.Bindable.resolve(_this2.args, bindProperty, true);
            var _Bindable$resolve6 = _slicedToArray(_Bindable$resolve5, 2);
            proxy = _Bindable$resolve6[0];
            property = _Bindable$resolve6[1];
          }
          tag.parentNode.insertBefore(dynamicNode, tag);
          if (_typeof(proxy) !== 'object') {
            return "break";
          }
          proxy = _Bindable.Bindable.make(proxy);
          var debind = proxy.bindTo(property, (v, k, t) => {
            if (t[k] !== v && (t[k] instanceof View || t[k] instanceof Node || t[k] instanceof _Tag.Tag)) {
              if (!t[k].preserve) {
                t[k].remove();
              }
            }
            dynamicNode.nodeValue = '';
            if (unsafeView && !(v instanceof View)) {
              var _v;
              var unsafeTemplate = (_v = v) !== null && _v !== void 0 ? _v : '';
              v = new View(_this2.args, _this2);
              v.template = unsafeTemplate;
            }
            if (transformer) {
              v = transformer(v);
            }
            if (v instanceof View) {
              v[_EventTargetMixin.EventTargetMixin.Parent] = _this2;
              v.render(tag.parentNode, dynamicNode, _this2);
              var cleanup = () => {
                if (!v.preserve) {
                  v.remove();
                }
              };
              _this2.onRemove(cleanup);
              v.onRemove(() => _this2._onRemove.remove(cleanup));
            } else if (v instanceof Node) {
              tag.parentNode.insertBefore(v, dynamicNode);
              _this2.onRemove(() => v.remove());
            } else if (v instanceof _Tag.Tag) {
              if (v.node) {
                tag.parentNode.insertBefore(v.node, dynamicNode);
                _this2.onRemove(() => v.remove());
              } else {
                v.remove();
              }
            } else {
              if (v instanceof Object && v.__toString instanceof Function) {
                v = v.__toString();
              }
              if (unsafeHtml) {
                dynamicNode.innerHTML = v;
              } else {
                dynamicNode.nodeValue = v;
              }
            }
            dynamicNode[dontParse] = true;
          });
          _this2.onRemove(debind);
        };
        while (match = regex.exec(original)) {
          var _ret = _loop2();
          if (_ret === "continue") continue;
          if (_ret === "break") break;
        }
        var staticSuffix = original.substring(header);
        var staticNode = document.createTextNode(staticSuffix);
        staticNode[dontParse] = true;
        tag.parentNode.insertBefore(staticNode, tag);
        tag.nodeValue = '';
      } else if (tag.nodeType === Node.ELEMENT_NODE) {
        var _loop3 = function _loop3() {
          if (!_this2.interpolatable(tag.attributes[i].value)) {
            return "continue";
          }
          var header = 0;
          var match;
          var original = tag.attributes[i].value;
          var attribute = tag.attributes[i];
          var bindProperties = {};
          var segments = [];
          while (match = regex.exec(original)) {
            segments.push(original.substring(header, match.index));
            if (!bindProperties[match[2]]) {
              bindProperties[match[2]] = [];
            }
            bindProperties[match[2]].push(segments.length);
            segments.push(match[1]);
            header = match.index + match[1].length;
          }
          segments.push(original.substring(header));
          var _loop4 = function _loop4() {
            var proxy = _this2.args;
            var property = j;
            var propertySplit = j.split('|');
            var transformer = false;
            var longProperty = j;
            if (propertySplit.length > 1) {
              transformer = _this2.stringTransformer(propertySplit.slice(1));
              property = propertySplit[0];
            }
            if (property.match(/\./)) {
              var _Bindable$resolve7 = _Bindable.Bindable.resolve(_this2.args, property, true);
              var _Bindable$resolve8 = _slicedToArray(_Bindable$resolve7, 2);
              proxy = _Bindable$resolve8[0];
              property = _Bindable$resolve8[1];
            }
            var matching = [];
            var bindProperty = j;
            var matchingSegments = bindProperties[longProperty];

            // const changeAttribute = (v, k, t, d) => {
            // 	tag.setAttribute(attribute.name, segments.join(''));
            // };

            _this2.onRemove(proxy.bindTo(property, (v, k, t, d) => {
              if (transformer) {
                v = transformer(v);
              }
              for (var _i2 in bindProperties) {
                for (var _j in bindProperties[longProperty]) {
                  segments[bindProperties[longProperty][_j]] = t[_i2];
                  if (k === property) {
                    segments[bindProperties[longProperty][_j]] = v;
                  }
                }
              }
              if (!_this2.paused) {
                // changeAttribute(v,k,t,d);
                tag.setAttribute(attribute.name, segments.join(''));
              } else {
                // this.unpauseCallbacks.set(attribute, () => changeAttribute(v,k,t,d));
                _this2.unpauseCallbacks.set(attribute, () => tag.setAttribute(attribute.name, segments.join('')));
              }
            }));

            // this.onRemove(()=>{
            // 	if(!proxy.isBound())
            // 	{
            // 		Bindable.clearBindings(proxy);
            // 	}
            // });
          };
          for (var j in bindProperties) {
            _loop4();
          }
        };
        for (var i = 0; i < tag.attributes.length; i++) {
          var _ret2 = _loop3();
          if (_ret2 === "continue") continue;
        }
      }
      return tag;
    }
  }, {
    key: "mapRefTag",
    value: function mapRefTag(tag) {
      var refAttr = tag.getAttribute('cv-ref');
      var _refAttr$split = refAttr.split(':'),
        _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
        refProp = _refAttr$split2[0],
        _refAttr$split2$ = _refAttr$split2[1],
        refClassname = _refAttr$split2$ === void 0 ? null : _refAttr$split2$,
        _refAttr$split2$2 = _refAttr$split2[2],
        refKey = _refAttr$split2$2 === void 0 ? null : _refAttr$split2$2;
      var refClass = _Tag.Tag;
      if (refClassname) {
        refClass = this.stringToClass(refClassname);
      }
      tag.removeAttribute('cv-ref');
      Object.defineProperty(tag, '___tag___', {
        enumerable: false,
        writable: true
      });
      this.onRemove(() => {
        tag.___tag___ = null;
        tag.remove();
      });
      var parent = this;
      var direct = this;
      if (this.viewList) {
        parent = this.viewList.parent;
        // if(!this.viewList.parent.tags[refProp])
        // {
        // 	this.viewList.parent.tags[refProp] = [];
        // }

        // let refKeyVal = this.args[refKey];

        // this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
        // 	tag, this, refProp, refKeyVal
        // );
      }
      // else
      // {
      // 	this.tags[refProp] = new refClass(
      // 		tag, this, refProp
      // 	);
      // }

      var tagObject = new refClass(tag, this, refProp, undefined, direct);
      tag.___tag___ = tagObject;
      this.tags[refProp] = tagObject;
      while (parent) {
        var refKeyVal = this.args[refKey];
        if (refKeyVal !== undefined) {
          if (!parent.tags[refProp]) {
            parent.tags[refProp] = [];
          }
          parent.tags[refProp][refKeyVal] = tagObject;
        } else {
          parent.tags[refProp] = tagObject;
        }
        if (!parent.parent) {
          break;
        }
        parent = parent.parent;
      }
      return tag;
    }
  }, {
    key: "mapBindTag",
    value: function mapBindTag(tag) {
      var bindArg = tag.getAttribute('cv-bind');
      var proxy = this.args;
      var property = bindArg;
      var top = null;
      if (bindArg.match(/\./)) {
        var _Bindable$resolve9 = _Bindable.Bindable.resolve(this.args, bindArg, true);
        var _Bindable$resolve10 = _slicedToArray(_Bindable$resolve9, 3);
        proxy = _Bindable$resolve10[0];
        property = _Bindable$resolve10[1];
        top = _Bindable$resolve10[2];
      }
      if (proxy !== this.args) {
        this.subBindings[bindArg] = this.subBindings[bindArg] || [];
        this.onRemove(this.args.bindTo(top, () => {
          while (this.subBindings.length) {
            this.subBindings.shift()();
          }
        }));
      }
      var unsafeHtml = false;
      if (property.substr(0, 1) === '$') {
        property = property.substr(1);
        unsafeHtml = true;
      }
      var autoEventStarted = false;
      var debind = proxy.bindTo(property, (v, k, t, d, p) => {
        if ((p instanceof View || p instanceof Node || p instanceof _Tag.Tag) && p !== v) {
          p.remove();
        }
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag.tagName)) {
          var _type = tag.getAttribute('type');
          if (_type && _type.toLowerCase() === 'checkbox') {
            tag.checked = !!v;
          } else if (_type && _type.toLowerCase() === 'radio') {
            tag.checked = v == tag.value;
          } else if (_type !== 'file') {
            if (tag.tagName === 'SELECT') {
              var selectOption = () => {
                for (var i = 0; i < tag.options.length; i++) {
                  var option = tag.options[i];
                  if (option.value == v) {
                    tag.selectedIndex = i;
                  }
                }
              };
              selectOption();
              this.nodesAttached.add(selectOption);
            } else {
              tag.value = v == null ? '' : v;
            }
          }
          if (autoEventStarted) {
            tag.dispatchEvent(new CustomEvent('cvAutoChanged', {
              bubbles: true
            }));
          }
          autoEventStarted = true;
        } else {
          if (v instanceof View) {
            for (var node of tag.childNodes) {
              node.remove();
            }
            v[_EventTargetMixin.EventTargetMixin.Parent] = this;
            v.render(tag, null, this);
          } else if (v instanceof Node) {
            tag.insert(v);
          } else if (v instanceof _Tag.Tag) {
            tag.append(v.node);
          } else if (unsafeHtml) {
            if (tag.innerHTML !== v) {
              v = String(v);
              if (tag.innerHTML === v.substring(0, tag.innerHTML.length)) {
                tag.innerHTML += v.substring(tag.innerHTML.length);
              } else {
                for (var _node of tag.childNodes) {
                  _node.remove();
                }
                tag.innerHTML = v;
              }
              _Dom.Dom.mapTags(tag, false, t => t[dontParse] = true);
            }
          } else {
            if (tag.textContent !== v) {
              for (var _node2 of tag.childNodes) {
                _node2.remove();
              }
              tag.textContent = v;
            }
          }
        }
      });
      if (proxy !== this.args) {
        this.subBindings[bindArg].push(debind);
      }
      this.onRemove(debind);
      var type = tag.getAttribute('type');
      var multi = tag.getAttribute('multiple');
      var inputListener = event => {
        if (event.target !== tag) {
          return;
        }
        if (type && type.toLowerCase() === 'checkbox') {
          if (tag.checked) {
            proxy[property] = event.target.getAttribute('value');
          } else {
            proxy[property] = false;
          }
        } else if (event.target.matches('[contenteditable=true]')) {
          proxy[property] = event.target.innerHTML;
        } else if (type === 'file' && multi) {
          var files = Array.from(event.target.files);
          var current = proxy[property] || _Bindable.Bindable.onDeck(proxy, property);
          if (!current || !files.length) {
            proxy[property] = files;
          } else {
            var _loop5 = function _loop5(i) {
              if (files[i] !== current[i]) {
                files[i].toJSON = () => {
                  return {
                    name: file[i].name,
                    size: file[i].size,
                    type: file[i].type,
                    date: file[i].lastModified
                  };
                };
                current[i] = files[i];
                return "break";
              }
            };
            for (var i in files) {
              var _ret3 = _loop5(i);
              if (_ret3 === "break") break;
            }
          }
        } else if (type === 'file' && !multi && event.target.files.length) {
          var _file = event.target.files.item(0);
          _file.toJSON = () => {
            return {
              name: _file.name,
              size: _file.size,
              type: _file.type,
              date: _file.lastModified
            };
          };
          proxy[property] = _file;
        } else {
          proxy[property] = event.target.value;
        }
      };
      if (type === 'file' || type === 'radio') {
        tag.addEventListener('change', inputListener);
      } else {
        tag.addEventListener('input', inputListener);
        tag.addEventListener('change', inputListener);
        tag.addEventListener('value-changed', inputListener);
      }
      this.onRemove(() => {
        if (type === 'file' || type === 'radio') {
          tag.removeEventListener('change', inputListener);
        } else {
          tag.removeEventListener('input', inputListener);
          tag.removeEventListener('change', inputListener);
          tag.removeEventListener('value-changed', inputListener);
        }
      });
      tag.removeAttribute('cv-bind');
      return tag;
    }
  }, {
    key: "mapOnTag",
    value: function mapOnTag(tag) {
      var referents = String(tag.getAttribute('cv-on'));
      referents.split(';').map(a => a.split(':')).forEach(a => {
        a = a.map(a => a.trim());
        var argLen = a.length;
        var eventName = String(a.shift()).trim();
        var callbackName = String(a.shift() || eventName).trim();
        var eventFlags = String(a.shift() || '').trim();
        var argList = [];
        var groups = /(\w+)(?:\(([$\w\s-'",]+)\))?/.exec(callbackName);
        if (groups) {
          callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
          if (groups[2]) {
            argList = groups[2].split(',').map(s => s.trim());
          }
        }
        if (!argList.length) {
          argList.push('$event');
        }
        if (!eventName || argLen === 1) {
          eventName = callbackName;
        }
        var eventMethod;
        var parent = this;
        var _loop6 = function _loop6() {
          var controller = parent.controller;
          if (typeof controller[callbackName] === 'function') {
            eventMethod = (...args) => {
              controller[callbackName](...args);
            };
            return "break";
          } else if (typeof parent[callbackName] === 'function') {
            eventMethod = (...args) => {
              parent[callbackName](...args);
            };
            return "break";
          }
          if (parent.parent) {
            parent = parent.parent;
          } else {
            return "break";
          }
        };
        while (parent) {
          var _ret4 = _loop6();
          if (_ret4 === "break") break;
        }
        var eventListener = event => {
          var argRefs = argList.map(arg => {
            var match;
            if (Number(arg) == arg) {
              return arg;
            } else if (arg === 'event' || arg === '$event') {
              return event;
            } else if (arg === '$view') {
              return parent;
            } else if (arg === '$controller') {
              return controller;
            } else if (arg === '$tag') {
              return tag;
            } else if (arg === '$parent') {
              return this.parent;
            } else if (arg === '$subview') {
              return this;
            } else if (arg in this.args) {
              return this.args[arg];
            } else if (match = /^['"]([\w-]+?)["']$/.exec(arg)) {
              return match[1];
            }
          });
          if (!(typeof eventMethod === 'function')) {
            throw new Error("".concat(callbackName, " is not defined on View object.") + "\n" + "Tag:" + "\n" + "".concat(tag.outerHTML));
          }
          eventMethod(...argRefs);
        };
        var eventOptions = {};
        if (eventFlags.includes('p')) {
          eventOptions.passive = true;
        } else if (eventFlags.includes('P')) {
          eventOptions.passive = false;
        }
        if (eventFlags.includes('c')) {
          eventOptions.capture = true;
        } else if (eventFlags.includes('C')) {
          eventOptions.capture = false;
        }
        if (eventFlags.includes('o')) {
          eventOptions.once = true;
        } else if (eventFlags.includes('O')) {
          eventOptions.once = false;
        }
        switch (eventName) {
          case '_init':
            eventListener();
            break;
          case '_attach':
            this.nodesAttached.add(eventListener);
            break;
          case '_detach':
            this.nodesDetached.add(eventListener);
            break;
          default:
            tag.addEventListener(eventName, eventListener, eventOptions);
            this.onRemove(() => {
              tag.removeEventListener(eventName, eventListener, eventOptions);
            });
            break;
        }
        return [eventName, callbackName, argList];
      });
      tag.removeAttribute('cv-on');
      return tag;
    }
  }, {
    key: "mapLinkTag",
    value: function mapLinkTag(tag) {
      // const tagCompiler = this.compileLinkTag(tag);

      // const newTag = tagCompiler(this);

      // tag.replaceWith(newTag);

      // return newTag;

      var linkAttr = tag.getAttribute('cv-link');
      tag.setAttribute('href', linkAttr);
      var linkClick = event => {
        event.preventDefault();
        if (linkAttr.substring(0, 4) === 'http' || linkAttr.substring(0, 2) === '//') {
          globalThis.open(tag.getAttribute('href', linkAttr));
          return;
        }
        _Router.Router.go(tag.getAttribute('href'));
      };
      tag.addEventListener('click', linkClick);
      this.onRemove(((tag, eventListener) => () => {
        tag.removeEventListener('click', eventListener);
        tag = undefined;
        eventListener = undefined;
      })(tag, linkClick));
      tag.removeAttribute('cv-link');
      return tag;
    }

    // compileLinkTag(sourceTag)
    // {
    // 	const linkAttr = sourceTag.getAttribute('cv-link');
    // 	sourceTag.removeAttribute('cv-link');
    // 	return (bindingView) => {
    // 		const tag = sourceTag.cloneNode(true);
    // 		tag.setAttribute('href', linkAttr);
    // 		return tag;
    // 	};
    // }
  }, {
    key: "mapPrendererTag",
    value: function mapPrendererTag(tag) {
      var prerenderAttr = tag.getAttribute('cv-prerender');
      var prerendering = globalThis.prerenderer || navigator.userAgent.match(/prerender/i);
      tag.removeAttribute('cv-prerender');
      if (prerendering) {
        globalThis.prerenderer = globalThis.prerenderer || true;
      }
      if (prerenderAttr === 'never' && prerendering || prerenderAttr === 'only' && !prerendering) {
        this.postMapping.add(() => tag.parentNode.removeChild(tag));
      }
      return tag;
    }
  }, {
    key: "mapWithTag",
    value: function mapWithTag(tag) {
      var _this3 = this;
      var withAttr = tag.getAttribute('cv-with');
      var carryAttr = tag.getAttribute('cv-carry');
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-with');
      tag.removeAttribute('cv-carry');
      tag.removeAttribute('cv-view');
      var viewClass = viewAttr ? this.stringToClass(viewAttr) : View;
      var subTemplate = new DocumentFragment();
      [...tag.childNodes].forEach(n => subTemplate.appendChild(n));
      var carryProps = [];
      if (carryAttr) {
        carryProps = carryAttr.split(',').map(s => s.trim());
      }
      var debind = this.args.bindTo(withAttr, (v, k, t, d) => {
        if (this.withViews.has(tag)) {
          this.withViews.delete(tag);
        }
        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }
        var view = new viewClass({}, this);
        this.onRemove((view => () => {
          view.remove();
        })(view));
        view.template = subTemplate;
        var _loop7 = function _loop7() {
          var debind = _this3.args.bindTo(carryProps[i], (v, k) => {
            view.args[k] = v;
          });
          view.onRemove(debind);
          _this3.onRemove(() => {
            debind();
            view.remove();
          });
        };
        for (var i in carryProps) {
          _loop7();
        }
        var _loop8 = function _loop8() {
          if (_typeof(v) !== 'object') {
            return "continue";
          }
          v = _Bindable.Bindable.make(v);
          var debind = v.bindTo(_i3, (vv, kk, tt, dd) => {
            if (!dd) {
              view.args[kk] = vv;
            } else if (kk in view.args) {
              delete view.args[kk];
            }
          });
          var debindUp = view.args.bindTo(_i3, (vv, kk, tt, dd) => {
            if (!dd) {
              v[kk] = vv;
            } else if (kk in v) {
              delete v[kk];
            }
          });
          _this3.onRemove(() => {
            debind();
            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }
            view.remove();
          });
          view.onRemove(() => {
            debind();
            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }
          });
        };
        for (var _i3 in v) {
          var _ret5 = _loop8();
          if (_ret5 === "continue") continue;
        }
        view.render(tag, null, this);
        this.withViews.set(tag, view);
      });
      this.onRemove(() => {
        this.withViews.delete(tag);
        debind();
      });
      return tag;
    }
  }, {
    key: "mapViewTag",
    value: function mapViewTag(tag) {
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-view');
      var subTemplate = new DocumentFragment();
      [...tag.childNodes].forEach(n => subTemplate.appendChild(n));
      var parts = viewAttr.split(':');
      var viewName = parts.shift();
      var viewClass = parts.length ? this.stringToClass(parts[0]) : View;
      var view = new viewClass(this.args, this);
      this.views.set(tag, view);
      this.views.set(viewName, view);
      this.onRemove(() => {
        view.remove();
        this.views.delete(tag);
        this.views.delete(viewName);
      });
      view.template = subTemplate;
      view.render(tag, null, this);
      return tag;
    }
  }, {
    key: "mapEachTag",
    value: function mapEachTag(tag) {
      var eachAttr = tag.getAttribute('cv-each');
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-each');
      tag.removeAttribute('cv-view');
      var viewClass = viewAttr ? this.stringToClass(viewAttr) : View;
      var subTemplate = new DocumentFragment();
      [...tag.childNodes].forEach(n => subTemplate.appendChild(n));
      var _eachAttr$split = eachAttr.split(':'),
        _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
        eachProp = _eachAttr$split2[0],
        asProp = _eachAttr$split2[1],
        keyProp = _eachAttr$split2[2];
      var proxy = this.args;
      var property = eachProp;
      if (eachProp.match(/\./)) {
        var _Bindable$resolve11 = _Bindable.Bindable.resolve(this.args, eachProp, true);
        var _Bindable$resolve12 = _slicedToArray(_Bindable$resolve11, 2);
        proxy = _Bindable$resolve12[0];
        property = _Bindable$resolve12[1];
      }
      var debind = proxy.bindTo(property, (v, k, t, d, p) => {
        if (v instanceof _Bag.Bag) {
          v = v.list;
        }
        if (this.viewLists.has(tag)) {
          this.viewLists.get(tag).remove();
        }
        var viewList = new _ViewList.ViewList(subTemplate, asProp, v, this, keyProp, viewClass);
        var viewListRemover = () => viewList.remove();
        this.onRemove(viewListRemover);
        viewList.onRemove(() => this._onRemove.remove(viewListRemover));
        var debindA = this.args.bindTo((v, k, t, d) => {
          if (k === '_id') {
            return;
          }
          if (!d) {
            viewList.subArgs[k] = v;
          } else {
            if (k in viewList.subArgs) {
              delete viewList.subArgs[k];
            }
          }
        });
        var debindB = viewList.args.bindTo((v, k, t, d, p) => {
          if (k === '_id' || k === 'value' || String(k).substring(0, 3) === '___') {
            return;
          }
          if (!d) {
            if (k in this.args) {
              this.args[k] = v;
            }
          } else {
            delete this.args[k];
          }
        });
        viewList.onRemove(debindA);
        viewList.onRemove(debindB);
        this.onRemove(debindA);
        this.onRemove(debindB);
        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }
        this.viewLists.set(tag, viewList);
        viewList.render(tag, null, this);
      });
      this.onRemove(debind);
      return tag;
    }
  }, {
    key: "mapIfTag",
    value: function mapIfTag(tag) {
      var sourceTag = tag;
      var viewProperty = sourceTag.getAttribute('cv-view');
      var ifProperty = sourceTag.getAttribute('cv-if');
      var isProperty = sourceTag.getAttribute('cv-is');
      var inverted = false;
      var defined = false;
      sourceTag.removeAttribute('cv-view');
      sourceTag.removeAttribute('cv-if');
      sourceTag.removeAttribute('cv-is');
      var viewClass = viewProperty ? this.stringToClass(viewProperty) : View;
      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }
      if (ifProperty.substr(0, 1) === '?') {
        ifProperty = ifProperty.substr(1);
        defined = true;
      }
      var subTemplate = new DocumentFragment();
      [...sourceTag.childNodes].forEach(n => subTemplate.appendChild(n));
      var bindingView = this;
      var ifDoc = new DocumentFragment();

      // let view = new viewClass(Object.assign({}, this.args), bindingView);
      var view = new viewClass(this.args, bindingView);
      view.tags.bindTo((v, k) => this.tags[k] = v, {
        removeWith: this
      });
      view.template = subTemplate;
      var proxy = bindingView.args;
      var property = ifProperty;
      if (ifProperty.match(/\./)) {
        var _Bindable$resolve13 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);
        var _Bindable$resolve14 = _slicedToArray(_Bindable$resolve13, 2);
        proxy = _Bindable$resolve14[0];
        property = _Bindable$resolve14[1];
      }
      view.render(ifDoc, null, this);
      var propertyDebind = proxy.bindTo(property, (v, k) => {
        var o = v;
        if (defined) {
          v = v !== null && v !== undefined;
        }
        if (v instanceof _Bag.Bag) {
          v = v.list;
        }
        if (Array.isArray(v)) {
          v = !!v.length;
        }
        if (isProperty !== null) {
          v = o == isProperty;
        }
        if (inverted) {
          v = !v;
        }
        if (v) {
          tag.appendChild(ifDoc);
          [...ifDoc.childNodes].forEach(node => _Dom.Dom.mapTags(node, false, (tag, walker) => {
            if (!tag.matches) {
              return;
            }
            tag.dispatchEvent(new CustomEvent('cvDomAttached', {
              target: tag,
              detail: {
                view: view || this,
                mainView: this
              }
            }));
          }));
        } else {
          view.nodes.forEach(n => ifDoc.appendChild(n));
          _Dom.Dom.mapTags(ifDoc, false, (tag, walker) => {
            if (!tag.matches) {
              return;
            }
            new CustomEvent('cvDomDetached', {
              target: tag,
              detail: {
                view: view || this,
                mainView: this
              }
            });
          });
        }
      }, {
        children: Array.isArray(proxy[property])
      });

      // const propertyDebind = this.args.bindChain(property, onUpdate);

      bindingView.onRemove(propertyDebind);

      // const debindA = this.args.bindTo((v,k,t,d) => {
      // 	if(k === '_id')
      // 	{
      // 		return;
      // 	}

      // 	if(!d)
      // 	{
      // 		view.args[k] = v;
      // 	}
      // 	else if(k in view.args)
      // 	{
      // 		delete view.args[k];
      // 	}

      // });

      // const debindB = view.args.bindTo((v,k,t,d,p) => {
      // 	if(k === '_id' || String(k).substring(0,3) === '___')
      // 	{
      // 		return;
      // 	}

      // 	if(k in this.args)
      // 	{
      // 		if(!d)
      // 		{
      // 			this.args[k] = v;
      // 		}
      // 		else
      // 		{
      // 			delete this.args[k];
      // 		}
      // 	}
      // });

      var viewDebind = () => {
        propertyDebind();
        // debindA();
        // debindB();
        bindingView._onRemove.remove(propertyDebind);
        // bindingView._onRemove.remove(bindableDebind);
      };

      bindingView.onRemove(viewDebind);
      this.onRemove(() => {
        // debindA();
        // debindB();
        view.remove();
        if (bindingView !== this) {
          bindingView.remove();
        }
      });
      return tag;
    }

    // compileIfTag(sourceTag)
    // {
    // 	let ifProperty = sourceTag.getAttribute('cv-if');
    // 	let inverted   = false;

    // 	sourceTag.removeAttribute('cv-if');

    // 	if(ifProperty.substr(0, 1) === '!')
    // 	{
    // 		ifProperty = ifProperty.substr(1);
    // 		inverted   = true;
    // 	}

    // 	const subTemplate = new DocumentFragment;

    // 	[...sourceTag.childNodes].forEach(
    // 		n => subTemplate.appendChild(n.cloneNode(true))
    // 	);

    // 	return (bindingView) => {

    // 		const tag = sourceTag.cloneNode();

    // 		const ifDoc = new DocumentFragment;

    // 		let view = new View({}, bindingView);

    // 		view.template = subTemplate;
    // 		// view.parent   = bindingView;

    // 		bindingView.syncBind(view);

    // 		let proxy    = bindingView.args;
    // 		let property = ifProperty;

    // 		if(ifProperty.match(/\./))
    // 		{
    // 			[proxy, property] = Bindable.resolve(
    // 				bindingView.args
    // 				, ifProperty
    // 				, true
    // 			);
    // 		}

    // 		let hasRendered = false;

    // 		const propertyDebind = proxy.bindTo(property, (v,k) => {

    // 			if(!hasRendered)
    // 			{
    // 				const renderDoc = (bindingView.args[property] || inverted)
    // 					? tag : ifDoc;

    // 				view.render(renderDoc);

    // 				hasRendered = true;

    // 				return;
    // 			}

    // 			if(Array.isArray(v))
    // 			{
    // 				v = !!v.length;
    // 			}

    // 			if(inverted)
    // 			{
    // 				v = !v;
    // 			}

    // 			if(v)
    // 			{
    // 				tag.appendChild(ifDoc);
    // 			}
    // 			else
    // 			{
    // 				view.nodes.forEach(n=>ifDoc.appendChild(n));
    // 			}

    // 		});

    // 		// let cleaner = bindingView;

    // 		// while(cleaner.parent)
    // 		// {
    // 		// 	cleaner = cleaner.parent;
    // 		// }

    // 		bindingView.onRemove(propertyDebind);

    // 		let bindableDebind = () => {

    // 			if(!proxy.isBound())
    // 			{
    // 				Bindable.clearBindings(proxy);
    // 			}

    // 		};

    // 		let viewDebind = ()=>{
    // 			propertyDebind();
    // 			bindableDebind();
    // 			bindingView._onRemove.remove(propertyDebind);
    // 			bindingView._onRemove.remove(bindableDebind);
    // 		};

    // 		view.onRemove(viewDebind);

    // 		return tag;
    // 	};
    // }
  }, {
    key: "mapTemplateTag",
    value: function mapTemplateTag(tag) {
      // const templateName = tag.getAttribute('cv-template');

      // tag.removeAttribute('cv-template');

      // this.templates[ templateName ] = tag.tagName === 'TEMPLATE'
      // 	? tag.cloneNode(true).content
      // 	: new DocumentFragment(tag.innerHTML);

      var templateName = tag.getAttribute('cv-template');
      tag.removeAttribute('cv-template');
      var source = tag.innerHTML;
      if (!View.templates.has(source)) {
        View.templates.set(source, document.createRange().createContextualFragment(tag.innerHTML));
      }
      this.templates[templateName] = View.templates.get(source);
      this.postMapping.add(() => tag.remove());
      return tag;
    }
  }, {
    key: "mapSlotTag",
    value: function mapSlotTag(tag) {
      var templateName = tag.getAttribute('cv-slot');
      var template = this.templates[templateName];
      if (!template) {
        var parent = this;
        while (parent) {
          template = parent.templates[templateName];
          if (template) {
            break;
          }
          parent = this.parent;
        }
        if (!template) {
          console.error("Template ".concat(templateName, " not found."));
          return;
        }
      }
      tag.removeAttribute('cv-slot');
      while (tag.firstChild) {
        tag.firstChild.remove();
      }
      tag.appendChild(template.cloneNode(true));
      return tag;
    }

    // syncBind(subView)
    // {
    // 	let debindA = this.args.bindTo((v,k,t,d)=>{
    // 		if(k === '_id')
    // 		{
    // 			return;
    // 		}

    // 		if(subView.args[k] !== v)
    // 		{
    // 			subView.args[k] = v;
    // 		}
    // 	});

    // 	let debindB = subView.args.bindTo((v,k,t,d,p)=>{

    // 		if(k === '_id')
    // 		{
    // 			return;
    // 		}

    // 		let newRef = v;
    // 		let oldRef = p;

    // 		if(newRef instanceof View)
    // 		{
    // 			newRef = newRef.___ref___;
    // 		}

    // 		if(oldRef instanceof View)
    // 		{
    // 			oldRef = oldRef.___ref___;
    // 		}

    // 		if(newRef !== oldRef && oldRef instanceof View)
    // 		{
    // 			p.remove();
    // 		}

    // 		if(k in this.args)
    // 		{
    // 			this.args[k] = v;
    // 		}

    // 	});

    // 	this.onRemove(debindA);
    // 	this.onRemove(debindB);

    // 	subView.onRemove(()=>{
    // 		this._onRemove.remove(debindA);
    // 		this._onRemove.remove(debindB);
    // 	});
    // }
  }, {
    key: "postRender",
    value: function postRender(parentNode) {}
  }, {
    key: "attached",
    value: function attached(parentNode) {}
  }, {
    key: "interpolatable",
    value: function interpolatable(str) {
      return !!String(str).match(this.interpolateRegex);
    }
  }, {
    key: "remove",
    value: function remove(now = false) {
      if (!this.dispatchEvent(new CustomEvent('remove', {
        detail: {
          view: this
        },
        cancelable: true
      }))) {
        return;
      }
      var remover = () => {
        for (var i in this.tags) {
          if (Array.isArray(this.tags[i])) {
            this.tags[i] && this.tags[i].forEach(t => t.remove());
            this.tags[i].splice(0);
          } else {
            this.tags[i] && this.tags[i].remove();
            this.tags[i] = undefined;
          }
        }
        for (var _i4 in this.nodes) {
          this.nodes[_i4] && this.nodes[_i4].dispatchEvent(new Event('cvDomDetached'));
          this.nodes[_i4] && this.nodes[_i4].remove();
          this.nodes[_i4] = undefined;
        }
        this.nodes.splice(0);
        this.firstNode = this.lastNode = undefined;
      };
      if (now) {
        remover();
      } else {
        requestAnimationFrame(remover);
      }
      var callbacks = this._onRemove.items();
      for (var callback of callbacks) {
        callback();
        this._onRemove.remove(callback);
      }
      for (var cleanup of this.cleanup) {
        cleanup && cleanup();
      }
      this.cleanup.length = 0;
      for (var _ref21 of this.viewLists) {
        var _ref20 = _slicedToArray(_ref21, 2);
        var tag = _ref20[0];
        var viewList = _ref20[1];
        viewList.remove();
      }
      this.viewLists.clear();
      for (var _ref24 of this.timeouts) {
        var _ref23 = _slicedToArray(_ref24, 2);
        var _callback5 = _ref23[0];
        var timeout = _ref23[1];
        clearTimeout(timeout.timeout);
        this.timeouts.delete(timeout.timeout);
      }
      for (var interval of this.intervals) {
        clearInterval(interval);
      }
      this.intervals.length = 0;
      for (var frame of this.frames) {
        frame();
      }
      this.frames.length = 0;
      this.preRuleSet.purge();
      this.ruleSet.purge();
      this.removed = true;
      this.dispatchEvent(new CustomEvent('removed', {
        detail: {
          view: this
        },
        cancelable: true
      }));
    }
  }, {
    key: "findTag",
    value: function findTag(selector) {
      for (var i in this.nodes) {
        var result = void 0;
        if (!this.nodes[i].querySelector) {
          continue;
        }
        if (this.nodes[i].matches(selector)) {
          return new _Tag.Tag(this.nodes[i], this, undefined, undefined, this);
        }
        if (result = this.nodes[i].querySelector(selector)) {
          return new _Tag.Tag(result, this, undefined, undefined, this);
        }
      }
    }
  }, {
    key: "findTags",
    value: function findTags(selector) {
      var topLevel = this.nodes.filter(n => n.matches && n.matches(selector));
      var subLevel = this.nodes.filter(n => n.querySelectorAll).map(n => [...n.querySelectorAll(selector)]).flat().map(n => new _Tag.Tag(n, this, undefined, undefined, this)) || [];
      return topLevel.concat(subLevel);
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      if (callback instanceof Event) {
        return;
      }
      this._onRemove.add(callback);
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "beforeUpdate",
    value: function beforeUpdate(args) {}
  }, {
    key: "afterUpdate",
    value: function afterUpdate(args) {}
  }, {
    key: "stringTransformer",
    value: function stringTransformer(methods) {
      return x => {
        for (var m in methods) {
          var parent = this;
          var method = methods[m];
          while (parent && !parent[method]) {
            parent = parent.parent;
          }
          if (!parent) {
            return;
          }
          x = parent[methods[m]](x);
        }
        return x;
      };
    }
  }, {
    key: "stringToClass",
    value: function stringToClass(refClassname) {
      if (View.refClasses.has(refClassname)) {
        return View.refClasses.get(refClassname);
      }
      var refClassSplit = refClassname.split('/');
      var refShortClass = refClassSplit[refClassSplit.length - 1];
      var refClass = require(refClassname);
      View.refClasses.set(refClassname, refClass[refShortClass]);
      return refClass[refShortClass];
    }
  }, {
    key: "preventParsing",
    value: function preventParsing(node) {
      node[dontParse] = true;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.nodes.map(n => n.outerHTML).join(' ');
    }
  }, {
    key: "listen",
    value: function listen(node, eventName, callback, options) {
      if (typeof node === 'string') {
        options = callback;
        callback = eventName;
        eventName = node;
        node = this;
      }
      if (node instanceof View) {
        return this.listen(node.nodes, eventName, callback, options);
      }
      if (Array.isArray(node)) {
        return node.map(n => this.listen(n, eventName, callback, options));
        // .forEach(r => r());
      }

      if (node instanceof _Tag.Tag) {
        return this.listen(node.element, eventName, callback, options);
      }
      node.addEventListener(eventName, callback, options);
      var remove = () => node.removeEventListener(eventName, callback, options);
      var remover = () => {
        remove();
        remove = () => {};
      };
      this.onRemove(() => remover());
      return remover;
    }
  }, {
    key: "detach",
    value: function detach() {
      for (var n in this.nodes) {
        this.nodes[n].remove();
      }
      return this.nodes;
    }
  }], [{
    key: "from",
    value: function from(template, args = {}, mainView = null) {
      var view = new this(args, mainView);
      view.template = template;
      return view;
    }
  }, {
    key: "isView",
    value: function isView() {
      return View;
    }
  }, {
    key: "uuid",
    value: function uuid() {
      return new _Uuid.Uuid();
    }
  }]);
  return View;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.View = View;
Object.defineProperty(View, 'templates', {
  value: new Map()
});
Object.defineProperty(View, 'refClasses', {
  value: new Map()
});
  })();
});

require.register("curvature/base/ViewList.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewList = void 0;
var _Bindable = require("./Bindable");
var _SetMap = require("./SetMap");
var _Bag = require("./Bag");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ViewList = /*#__PURE__*/function () {
  function ViewList(template, subProperty, list, parent, keyProperty = null, viewClass = null) {
    _classCallCheck(this, ViewList);
    this.removed = false;
    this.args = _Bindable.Bindable.makeBindable(Object.create(null));
    this.args.value = _Bindable.Bindable.makeBindable(list || Object.create(null));
    this.subArgs = _Bindable.Bindable.makeBindable(Object.create(null));
    this.views = [];
    this.cleanup = [];
    this.viewClass = viewClass;
    this._onRemove = new _Bag.Bag();
    this.template = template;
    this.subProperty = subProperty;
    this.keyProperty = keyProperty;
    this.tag = null;
    this.downDebind = [];
    this.upDebind = [];
    this.paused = false;
    this.parent = parent;
    this.viewCount = 0;
    this.rendered = new Promise((accept, reject) => {
      Object.defineProperty(this, 'renderComplete', {
        configurable: false,
        writable: true,
        value: accept
      });
    });
    this.willReRender = false;
    this.args.___before((t, e, s, o, a) => {
      if (e == 'bindTo') {
        return;
      }
      this.paused = true;
    });
    this.args.___after((t, e, s, o, a) => {
      if (e == 'bindTo') {
        return;
      }
      this.paused = s.length > 1;
      this.reRender();
    });
    var debind = this.args.value.bindTo((v, k, t, d) => {
      if (this.paused) {
        return;
      }
      var kk = k;
      if (_typeof(k) === 'symbol') {
        return;
      }
      if (isNaN(k)) {
        kk = '_' + k;
      }
      if (d) {
        if (this.views[kk]) {
          this.views[kk].remove(true);
        }
        delete this.views[kk];
        for (var i in this.views) {
          if (!this.views[i]) {
            continue;
          }
          if (isNaN(i)) {
            this.views[i].args[this.keyProperty] = i.substr(1);
            continue;
          }
          this.views[i].args[this.keyProperty] = i;
        }
      } else if (!this.views[kk]) {
        if (!this.viewCount) {
          this.reRender();
        } else {
          if (this.willReRender === false) {
            this.willReRender = requestAnimationFrame(() => {
              this.willReRender = false;
              this.reRender();
            });
          }
        }
      } else if (this.views[kk] && this.views[kk].args) {
        this.views[kk].args[this.keyProperty] = k;
        this.views[kk].args[this.subProperty] = v;
      }
    }, {
      wait: 0
    });
    this._onRemove.add(debind);
    Object.preventExtensions(this);
  }
  _createClass(ViewList, [{
    key: "render",
    value: function render(tag) {
      var _this = this;
      var renders = [];
      var _loop = function _loop(view) {
        view.viewList = _this;
        view.render(tag, null, _this.parent);
        renders.push(view.rendered.then(() => view));
      };
      for (var view of this.views) {
        _loop(view);
      }
      this.tag = tag;
      Promise.all(renders).then(views => this.renderComplete(views));
      this.parent.dispatchEvent(new CustomEvent('listRendered', {
        detail: {
          detail: {
            key: this.subProperty,
            value: this.args.value
          }
        }
      }));
    }
  }, {
    key: "reRender",
    value: function reRender() {
      var _this2 = this;
      if (this.paused || !this.tag) {
        return;
      }
      var views = [];
      var existingViews = new _SetMap.SetMap();
      for (var i in this.views) {
        var view = this.views[i];
        if (view === undefined) {
          views[i] = view;
          continue;
        }
        var rawValue = view.args[this.subProperty];
        existingViews.add(rawValue, view);
        views[i] = view;
      }
      var finalViews = [];
      var finalViewSet = new Set();
      this.downDebind.length && this.downDebind.forEach(d => d && d());
      this.upDebind.length && this.upDebind.forEach(d => d && d());
      this.upDebind.length = 0;
      this.downDebind.length = 0;
      var minKey = Infinity;
      var anteMinKey = Infinity;
      var _loop2 = function _loop2() {
        var found = false;
        var k = _i;
        if (isNaN(k)) {
          k = '_' + _i;
        } else if (String(k).length) {
          k = Number(k);
        }
        if (_this2.args.value[_i] !== undefined && existingViews.has(_this2.args.value[_i])) {
          var existingView = existingViews.getOne(_this2.args.value[_i]);
          if (existingView) {
            existingView.args[_this2.keyProperty] = _i;
            finalViews[k] = existingView;
            finalViewSet.add(existingView);
            found = true;
            if (!isNaN(k)) {
              minKey = Math.min(minKey, k);
              k > 0 && (anteMinKey = Math.min(anteMinKey, k));
            }
            existingViews.remove(_this2.args.value[_i], existingView);
          }
        }
        if (!found) {
          var viewArgs = Object.create(null);
          var _view = finalViews[k] = new _this2.viewClass(viewArgs, _this2.parent);
          if (!isNaN(k)) {
            minKey = Math.min(minKey, k);
            k > 0 && (anteMinKey = Math.min(anteMinKey, k));
          }
          finalViews[k].template = _this2.template;
          finalViews[k].viewList = _this2;
          finalViews[k].args[_this2.keyProperty] = _i;
          finalViews[k].args[_this2.subProperty] = _this2.args.value[_i];
          _this2.upDebind[k] = viewArgs.bindTo(_this2.subProperty, (v, k, t, d) => {
            var index = viewArgs[_this2.keyProperty];
            if (d) {
              delete _this2.args.value[index];
              return;
            }
            _this2.args.value[index] = v;
          });
          _this2.downDebind[k] = _this2.subArgs.bindTo((v, k, t, d) => {
            if (d) {
              delete viewArgs[k];
              return;
            }
            viewArgs[k] = v;
          });
          var upDebind = () => {
            _this2.upDebind.filter(x => x).forEach(d => d());
            _this2.upDebind.length = 0;
          };
          var downDebind = () => {
            _this2.downDebind.filter(x => x).forEach(d => d());
            _this2.downDebind.length = 0;
          };
          _view.onRemove(() => {
            _this2._onRemove.remove(upDebind);
            _this2._onRemove.remove(downDebind);
            _this2.upDebind[k] && _this2.upDebind[k]();
            _this2.downDebind[k] && _this2.downDebind[k]();
            delete _this2.upDebind[k];
            delete _this2.downDebind[k];
          });
          _this2._onRemove.add(upDebind);
          _this2._onRemove.add(downDebind);
          viewArgs[_this2.subProperty] = _this2.args.value[_i];
        }
      };
      for (var _i in this.args.value) {
        _loop2();
      }
      for (var _i2 in views) {
        if (views[_i2] && !finalViewSet.has(views[_i2])) {
          views[_i2].remove(true);
        }
      }
      if (Array.isArray(this.args.value)) {
        var localMin = minKey === 0 && finalViews[1] !== undefined && finalViews.length > 1 || anteMinKey === Infinity ? minKey : anteMinKey;
        var renderRecurse = (i = 0) => {
          var ii = finalViews.length - i - 1;
          while (ii > localMin && finalViews[ii] === undefined) {
            ii--;
          }
          if (ii < localMin) {
            return Promise.resolve();
          }
          if (finalViews[ii] === this.views[ii]) {
            if (finalViews[ii] && !finalViews[ii].firstNode) {
              finalViews[ii].render(this.tag, finalViews[ii + 1], this.parent);
              return finalViews[ii].rendered.then(() => renderRecurse(Number(i) + 1));
            } else {
              var split = 500;
              if (i === 0 || i % split) {
                return renderRecurse(Number(i) + 1);
              } else {
                return new Promise(accept => requestAnimationFrame(() => accept(renderRecurse(Number(i) + 1))));
              }
            }
          }
          finalViews[ii].render(this.tag, finalViews[ii + 1], this.parent);
          this.views.splice(ii, 0, finalViews[ii]);
          return finalViews[ii].rendered.then(() => renderRecurse(i + 1));
        };
        this.rendered = renderRecurse();
      } else {
        var renders = [];
        var leftovers = Object.assign(Object.create(null), finalViews);
        var isInt = x => parseInt(x) === x - 0;
        var keys = Object.keys(finalViews).sort((a, b) => {
          if (isInt(a) && isInt(b)) {
            return Math.sign(a - b);
          }
          if (!isInt(a) && !isInt(b)) {
            return 0;
          }
          if (!isInt(a) && isInt(b)) {
            return -1;
          }
          if (isInt(a) && !isInt(b)) {
            return 1;
          }
        });
        var _loop3 = function _loop3(_i3) {
          delete leftovers[_i3];
          if (finalViews[_i3].firstNode && finalViews[_i3] === _this2.views[_i3]) {
            return "continue";
          }
          finalViews[_i3].render(_this2.tag, null, _this2.parent);
          renders.push(finalViews[_i3].rendered.then(() => finalViews[_i3]));
        };
        for (var _i3 of keys) {
          var _ret = _loop3(_i3);
          if (_ret === "continue") continue;
        }
        for (var _i4 in leftovers) {
          delete this.args.views[_i4];
          leftovers.remove(true);
        }
        this.rendered = Promise.all(renders);
      }
      for (var _i5 in finalViews) {
        if (isNaN(_i5)) {
          finalViews[_i5].args[this.keyProperty] = _i5.substr(1);
          continue;
        }
        finalViews[_i5].args[this.keyProperty] = _i5;
      }
      this.views = Array.isArray(this.args.value) ? [...finalViews] : finalViews;
      this.viewCount = finalViews.length;
      finalViewSet.clear();
      this.willReRender = false;
      this.rendered.then(() => {
        this.parent.dispatchEvent(new CustomEvent('listRendered', {
          detail: {
            detail: {
              key: this.subProperty,
              value: this.args.value,
              tag: this.tag
            }
          }
        }));
        this.tag.dispatchEvent(new CustomEvent('listRendered', {
          detail: {
            detail: {
              key: this.subProperty,
              value: this.args.value,
              tag: this.tag
            }
          }
        }));
      });
      return this.rendered;
    }
  }, {
    key: "pause",
    value: function pause(_pause = true) {
      for (var i in this.views) {
        this.views[i].pause(_pause);
      }
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      this._onRemove.add(callback);
    }
  }, {
    key: "remove",
    value: function remove() {
      for (var i in this.views) {
        this.views[i] && this.views[i].remove(true);
      }
      var onRemove = this._onRemove.items();
      for (var _i6 in onRemove) {
        this._onRemove.remove(onRemove[_i6]);
        onRemove[_i6]();
      }
      var cleanup;
      while (this.cleanup.length) {
        cleanup = this.cleanup.pop();
        cleanup();
      }
      this.views = [];
      while (this.tag && this.tag.firstChild) {
        this.tag.removeChild(this.tag.firstChild);
      }
      if (this.subArgs) {
        _Bindable.Bindable.clearBindings(this.subArgs);
      }
      _Bindable.Bindable.clearBindings(this.args);

      // if(this.args.value && !this.args.value.isBound())
      // {
      // 	Bindable.clearBindings(this.args.value);
      // }

      this.removed = true;
    }
  }]);
  return ViewList;
}();
exports.ViewList = ViewList;
  })();
});

require.register("curvature/input/Axis.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Axis = void 0;
var _Bindable = require("../base/Bindable");
var _Bindable$NoGetters;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Axis = /*#__PURE__*/function () {
  function Axis({
    deadZone = 0,
    proportional = true
  }) {
    _classCallCheck(this, Axis);
    _defineProperty(this, _Bindable$NoGetters, true);
    _defineProperty(this, "magnitude", 0);
    _defineProperty(this, "delta", 0);
    this.proportional = proportional;
    this.deadZone = deadZone;
  }
  _createClass(Axis, [{
    key: "tilt",
    value: function tilt(magnitude) {
      if (this.deadZone && Math.abs(magnitude) >= this.deadZone) {
        magnitude = (Math.abs(magnitude) - this.deadZone) / (1 - this.deadZone) * Math.sign(magnitude);
      } else if (this.deadZone && Math.abs(magnitude) < this.deadZone) {
        magnitude = 0;
      }
      this.delta = Number(magnitude - this.magnitude).toFixed(3) - 0;
      this.magnitude = Number(magnitude).toFixed(3) - 0;
    }
  }, {
    key: "zero",
    value: function zero() {
      this.magnitude = this.delta = 0;
    }
  }]);
  return Axis;
}();
exports.Axis = Axis;
  })();
});

require.register("curvature/input/Button.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;
var _Bindable = require("../base/Bindable");
var _Bindable$NoGetters;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Button = /*#__PURE__*/function () {
  function Button() {
    _classCallCheck(this, Button);
    _defineProperty(this, _Bindable$NoGetters, true);
    _defineProperty(this, "active", false);
    _defineProperty(this, "pressure", 0);
    _defineProperty(this, "delta", 0);
    _defineProperty(this, "time", 0);
  }
  _createClass(Button, [{
    key: "update",
    value: function update(options = {}) {
      if (this.pressure) {
        this.time++;
      } else if (!this.pressure && this.time > 0) {
        this.time = -1;
      } else if (!this.pressure && this.time < 0) {
        this.time--;
      }
      if (this.time < -1 && this.delta === -1) {
        this.delta = 0;
      }
    }
  }, {
    key: "press",
    value: function press(pressure) {
      this.delta = Number(pressure - this.pressure).toFixed(3) - 0;
      this.pressure = Number(pressure).toFixed(3) - 0;
      this.active = true;
      this.time = this.time > 0 ? this.time : 0;
    }
  }, {
    key: "release",
    value: function release() {
      if (!this.active) {
        return;
      }
      this.delta = Number(-this.pressure).toFixed(3) - 0;
      this.pressure = 0;
      this.active = false;
    }
  }, {
    key: "zero",
    value: function zero() {
      this.pressure = this.delta = 0;
      this.active = false;
    }
  }]);
  return Button;
}();
exports.Button = Button;
  })();
});

require.register("curvature/input/Gamepad.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gamepad = void 0;
var _Bindable = require("../base/Bindable");
var _Mixin = require("../base/Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
var _Axis = require("./Axis");
var _Button = require("./Button");
var _Bindable$NoGetters;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var keys = {
  'Space': 0,
  'Enter': 0,
  'NumpadEnter': 0,
  'ControlLeft': 1,
  'ControlRight': 1,
  'ShiftLeft': 2,
  'ShiftRight': 2,
  'KeyZ': 3,
  'KeyQ': 4,
  'KeyE': 5,
  'Digit1': 6,
  'Digit3': 7,
  'KeyW': 12,
  'KeyA': 14,
  'KeyS': 13,
  'KeyD': 15,
  'KeyH': 112,
  'KeyJ': 113,
  'KeyK': 114,
  'KeyL': 115,
  'KeyP': 9,
  'Pause': 9,
  'Tab': 11,
  'ArrowUp': 12,
  'ArrowDown': 13,
  'ArrowLeft': 14,
  'ArrowRight': 15,
  'Numpad4': 112,
  'Numpad2': 113,
  'Numpad8': 114,
  'Numpad6': 115,
  'Backquote': 1010,
  'NumpadAdd': 1011,
  'NumpadSubtract': 1012,
  'NumpadMultiply': 1013,
  'NumpadDivide': 1014,
  'Escape': 1020
};
[...Array(12)].map((x, fn) => keys["F".concat(fn)] = 2000 + fn);
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Gamepad = /*#__PURE__*/function (_Mixin$with) {
  _inherits(Gamepad, _Mixin$with);
  var _super = _createSuper(Gamepad);
  function Gamepad({
    keys = {},
    deadZone = 0,
    gamepad = null,
    keyboard = null,
    axisMap = null
  } = {}) {
    var _this;
    _classCallCheck(this, Gamepad);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), _Bindable$NoGetters, true);
    _defineProperty(_assertThisInitialized(_this), "axisMap", {
      12: -1,
      13: +1,
      14: -0,
      15: +0,
      112: -2,
      113: +3,
      114: -3,
      115: +2
    });
    _this.deadZone = deadZone;
    _this.gamepad = gamepad;
    _this.index = gamepad.index;
    _this.id = gamepad.id;
    _this.axisMap = axisMap || _this.axisMap;
    Object.defineProperties(_assertThisInitialized(_this), {
      buttons: {
        value: {}
      },
      pressure: {
        value: {}
      },
      axes: {
        value: {}
      },
      keys: {
        value: {}
      }
    });
    return _this;
  }
  _createClass(Gamepad, [{
    key: "update",
    value: function update() {
      for (var i in this.buttons) {
        var button = this.buttons[i];
        button.update();
      }
    }
  }, {
    key: "rumbleEffect",
    value: function rumbleEffect(options) {
      return this.gamepad.vibrationActuator.playEffect("dual-rumble", options);
    }
  }, {
    key: "rumble",
    value: function rumble(...options) {
      if (this.gamepad.vibrationActuator.pulse) {
        return this.gamepad.vibrationActuator.pulse(...options);
      } else {
        this.rumbleEffect({
          duration: 1000,
          strongMagnitude: 1.0,
          weakMagnitude: 1.0
        });
      }
    }
  }, {
    key: "readInput",
    value: function readInput() {
      if (!this.gamepad) {
        return;
      }
      var index = String(this.gamepad.index);
      var stat = this.constructor;
      if (!stat.padsRead.has(index)) {
        stat.padsRead = new Map(Object.entries(navigator.getGamepads()));
      }
      var gamepad = this.gamepad = stat.padsRead.get(index);
      stat.padsRead.delete(index);
      var pressed = {};
      var released = {};
      if (gamepad) {
        for (var i in gamepad.buttons) {
          var button = gamepad.buttons[i];
          if (button.pressed) {
            this.press(i, button.value);
            pressed[i] = true;
          }
        }
      }
      if (this.keyboard) {
        for (var _i in [...Array(10)]) {
          if (pressed[_i]) {
            continue;
          }
          if (this.keyboard.getKeyCode(_i) > 0) {
            this.press(_i, 1);
            pressed[_i] = true;
          }
        }
        for (var keycode in keys) {
          if (pressed[keycode]) {
            continue;
          }
          var buttonId = keys[keycode];
          if (this.keyboard.getKeyCode(keycode) > 0) {
            this.press(buttonId, 1);
            pressed[buttonId] = true;
          }
        }
      }
      if (gamepad) {
        for (var _i2 in gamepad.buttons) {
          if (pressed[_i2]) {
            continue;
          }
          var _button = gamepad.buttons[_i2];
          if (!_button.pressed) {
            this.release(_i2);
            released[_i2] = true;
          }
        }
      }
      if (this.keyboard) {
        for (var _i3 in [...Array(10)]) {
          if (released[_i3]) {
            continue;
          }
          if (pressed[_i3]) {
            continue;
          }
          if (this.keyboard.getKeyCode(_i3) < 0) {
            this.release(_i3);
            released[_i3] = true;
          }
        }
        for (var _keycode in keys) {
          var _buttonId = keys[_keycode];
          if (released[_buttonId]) {
            continue;
          }
          if (pressed[_buttonId]) {
            continue;
          }
          if (this.keyboard.getKeyCode(_keycode) < 0) {
            this.release(_buttonId);
            released[_keycode] = true;
          }
        }
      }
      var tilted = {};
      if (gamepad) {
        for (var _i4 in gamepad.axes) {
          var axis = gamepad.axes[_i4];
          tilted[_i4] = true;
          this.tilt(_i4, axis);
        }
      }
      for (var inputId in this.axisMap) {
        if (!this.buttons[inputId]) {
          this.buttons[inputId] = new _Button.Button();
        }
        var _axis = this.axisMap[inputId];
        var value = Math.sign(1 / _axis);
        var axisId = Math.abs(_axis);
        if (this.buttons[inputId].active) {
          tilted[axisId] = true;
          this.tilt(axisId, value);
        } else if (!tilted[axisId]) {
          this.tilt(axisId, 0);
        }
      }
    }
  }, {
    key: "tilt",
    value: function tilt(axisId, magnitude) {
      if (!this.axes[axisId]) {
        this.axes[axisId] = new _Axis.Axis({
          deadZone: this.deadZone
        });
      }
      this.axes[axisId].tilt(magnitude);
    }
  }, {
    key: "press",
    value: function press(buttonId, pressure = 1) {
      if (!this.buttons[buttonId]) {
        this.buttons[buttonId] = new _Button.Button();
      }
      this.buttons[buttonId].press(pressure);
    }
  }, {
    key: "release",
    value: function release(buttonId) {
      if (!this.buttons[buttonId]) {
        this.buttons[buttonId] = new _Button.Button();
      }
      this.buttons[buttonId].release();
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var buttons = {};
      for (var i in this.buttons) {
        buttons[i] = this.buttons[i].pressure;
      }
      var axes = {};
      for (var _i5 in this.axes) {
        axes[_i5] = this.axes[_i5].magnitude;
      }
      return {
        axes: axes,
        buttons: buttons
      };
    }
  }, {
    key: "replay",
    value: function replay(input) {
      if (input.buttons) {
        for (var i in input.buttons) {
          if (input.buttons[i] > 0) {
            this.press(i, input.buttons[i]);
          } else {
            this.release(i);
          }
        }
      }
      if (input.axes) {
        for (var _i6 in input.axes) {
          if (input.axes[_i6].magnitude !== input.axes[_i6]) {
            this.tilt(_i6, input.axes[_i6]);
          }
        }
      }
    }
  }, {
    key: "zero",
    value: function zero() {
      for (var i in this.axes) {
        this.axes[i].zero();
      }
      for (var _i7 in this.buttons) {
        this.buttons[_i7].zero();
      }
    }
  }], [{
    key: "getPad",
    value: function getPad({
      index = undefined,
      deadZone = 0,
      keys = {},
      keyboard = null,
      axisMap = null
    }) {
      if (this.padsConnected.has(index)) {
        return this.padsConnected.get(index);
      }
      var waitForPad = new Promise(accept => {
        var registerPad = event => {
          event.stopImmediatePropagation();
          var pad = new this({
            gamepad: event.gamepad,
            deadZone: deadZone,
            keys: keys,
            keyboard: keyboard,
            axisMap: axisMap
          });
          this.padsConnected.set(event.gamepad.index, waitForPad);
          accept(pad);
        };
        addEventListener('gamepadconnected', registerPad, {
          once: true
        });
      });
      return waitForPad;
    }
  }]);
  return Gamepad;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.Gamepad = Gamepad;
_defineProperty(Gamepad, "padsConnected", new Map());
_defineProperty(Gamepad, "padsRead", new Map());
  })();
});

require.register("curvature/mixin/EventTargetMixin.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTargetMixin = void 0;
var _Mixin = require("../base/Mixin");
var _EventTargetMixin;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var EventTargetParent = Symbol('EventTargetParent');
var CallHandler = Symbol('CallHandler');
var Capture = Symbol('Capture');
var Bubble = Symbol('Bubble');
var Target = Symbol('Target');
var HandlersBubble = Symbol('HandlersBubble');
var HandlersCapture = Symbol('HandlersCapture');
var EventTargetMixin = (_EventTargetMixin = {}, _defineProperty(_EventTargetMixin, _Mixin.Mixin.Constructor, function () {
  this[HandlersCapture] = new Map();
  this[HandlersBubble] = new Map();
}), _defineProperty(_EventTargetMixin, "dispatchEvent", function dispatchEvent(...args) {
  var event = args[0];
  if (typeof event === 'string') {
    event = new CustomEvent(event);
    args[0] = event;
  }
  event.cvPath = event.cvPath || [];
  event.cvTarget = event.cvCurrentTarget = this;
  var result = this[Capture](...args);
  if (event.cancelable && (result === false || event.cancelBubble)) {
    return result;
  }
  var handlers = [];
  if (this[HandlersCapture].has(event.type)) {
    var handlerMap = this[HandlersCapture].get(event.type);
    var newHandlers = [...handlerMap];
    newHandlers.forEach(h => h.push(handlerMap));
    handlers.push(...newHandlers);
  }
  if (this[HandlersBubble].has(event.type)) {
    var _handlerMap = this[HandlersBubble].get(event.type);
    var _newHandlers = [..._handlerMap];
    _newHandlers.forEach(h => h.push(_handlerMap));
    handlers.push(..._newHandlers);
  }
  handlers.push([() => this[CallHandler](...args), {}, null]);
  for (var _ref3 of handlers) {
    var _ref2 = _slicedToArray(_ref3, 3);
    var handler = _ref2[0];
    var options = _ref2[1];
    var map = _ref2[2];
    if (options.once) {
      map.delete(handler);
    }
    result = handler(event);
    if (event.cancelable && result === false) {
      break;
    }
  }
  if (!event.cancelable || !event.cancelBubble && result !== false) {
    this[Bubble](...args);
  }
  if (!this[EventTargetParent]) {
    Object.freeze(event.cvPath);
  }
  return event.returnValue;
}), _defineProperty(_EventTargetMixin, "addEventListener", function addEventListener(type, callback, options = {}) {
  if (options === true) {
    options = {
      useCapture: true
    };
  }
  var handlers = HandlersBubble;
  if (options.useCapture) {
    handlers = HandlersCapture;
  }
  if (!this[handlers].has(type)) {
    this[handlers].set(type, new Map());
  }
  this[handlers].get(type).set(callback, options);
  if (options.signal) {
    options.signal.addEventListener('abort', event => this.removeEventListener(type, callback, options), {
      once: true
    });
  }
}), _defineProperty(_EventTargetMixin, "removeEventListener", function removeEventListener(type, callback, options = {}) {
  if (options === true) {
    options = {
      useCapture: true
    };
  }
  var handlers = HandlersBubble;
  if (options.useCapture) {
    handlers = HandlersCapture;
  }
  if (!this[handlers].has(type)) {
    return;
  }
  this[handlers].get(type).delete(callback);
}), _defineProperty(_EventTargetMixin, Capture, function (...args) {
  var event = args[0];
  event.cvPath.push(this);
  if (!this[EventTargetParent]) {
    return;
  }
  var result = this[EventTargetParent][Capture](...args);
  if (event.cancelable && (result === false || event.cancelBubble)) {
    return;
  }
  if (!this[EventTargetParent][HandlersCapture].has(event.type)) {
    return;
  }
  event.cvCurrentTarget = this[EventTargetParent];
  var type = event.type;
  var handlers = this[EventTargetParent][HandlersCapture].get(type);
  for (var _ref6 of handlers) {
    var _ref5 = _slicedToArray(_ref6, 2);
    var handler = _ref5[0];
    var options = _ref5[1];
    if (options.once) {
      handlers.delete(handler);
    }
    result = handler(event);
    if (event.cancelable && (result === false || event.cancelBubble)) {
      break;
    }
  }
  return result;
}), _defineProperty(_EventTargetMixin, Bubble, function (...args) {
  var event = args[0];
  if (!event.bubbles || !this[EventTargetParent] || event.cancelBubble) {
    return;
  }
  if (!this[EventTargetParent][HandlersBubble].has(event.type)) {
    return this[EventTargetParent][Bubble](...args);
  }
  var result;
  event.cvCurrentTarget = this[EventTargetParent];
  var type = event.type;
  var handlers = this[EventTargetParent][HandlersBubble].get(event.type);
  for (var _ref9 of handlers) {
    var _ref8 = _slicedToArray(_ref9, 2);
    var handler = _ref8[0];
    var options = _ref8[1];
    if (options.once) {
      handlers.delete(handler);
    }
    result = handler(event);
    if (event.cancelable && result === false) {
      return result;
    }
  }
  result = this[EventTargetParent][CallHandler](...args);
  if (event.cancelable && (result === false || event.cancelBubble)) {
    return result;
  }
  return this[EventTargetParent][Bubble](...args);
}), _defineProperty(_EventTargetMixin, CallHandler, function (...args) {
  var event = args[0];
  if (event.defaultPrevented) {
    return;
  }
  var defaultHandler = "on".concat(event.type[0].toUpperCase() + event.type.slice(1));
  if (typeof this[defaultHandler] === 'function') {
    return this[defaultHandler](event);
  }
}), _EventTargetMixin);
exports.EventTargetMixin = EventTargetMixin;
Object.defineProperty(EventTargetMixin, 'Parent', {
  value: EventTargetParent
});
  })();
});
require.register("arctype/ArcType.js", function(exports, require, module) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArcType = void 0;

var _View2 = require("curvature/base/View");

var _Gamepad = require("curvature/input/Gamepad");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ArcType = /*#__PURE__*/function (_View) {
  _inherits(ArcType, _View);

  var _super = _createSuper(ArcType);

  function ArcType(args, parent) {
    var _this;

    _classCallCheck(this, ArcType);

    _this = _super.call(this, args, parent);

    _defineProperty(_assertThisInitialized(_this), "template", require('./arctype.html'));

    var lower = _toConsumableArray(Array(26)).map(function (v, k) {
      return String.fromCharCode('a'.charCodeAt(0) + k);
    });

    var upper = _toConsumableArray(Array(26)).map(function (v, k) {
      return String.fromCharCode('A'.charCodeAt(0) + k);
    });

    var number = _toConsumableArray(Array(10)).map(function (v, k) {
      return String.fromCharCode('0'.charCodeAt(0) + k);
    });

    var extraA = '.,"@:/'.split('');
    var extraB = '!?-&;\\'.split('');
    var extraC = '`*\'"-=[]()~:{}<>^|%$#+'.split('');
    var banks = [[].concat(_toConsumableArray(lower), _toConsumableArray(extraA)), [].concat(_toConsumableArray(upper), _toConsumableArray(extraB)), [].concat(_toConsumableArray(number), _toConsumableArray(extraC))];
    _this.letters = banks[0];
    _this.args.angle = 'x';
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        _this.deactivate();
      }

      if (event.key === 'Escape') {
        _this.deactivate(false);
      }
    });

    _Gamepad.Gamepad.getPad({
      deadZone: 0.2,
      axisMap: {}
    }).then(function (pad) {
      var eachFrame = function eachFrame() {
        pad.readInput();

        if (pad.buttons[4].active && pad.buttons[4].delta) {
          _this.tags.buffer.focus();

          document.execCommand('delete', false);
        }

        if (pad.buttons[5].active && pad.buttons[5].delta) {
          _this.tags.buffer.focus();

          document.execCommand('insertText', false, ' ');
        }

        if (pad.buttons[10].active && pad.buttons[10].delta) {
          _this.tags.buffer.focus();

          _this.tags.buffer.selectionStart--;
        }

        if (pad.buttons[11].active && pad.buttons[11].delta) {
          _this.tags.buffer.focus();

          _this.tags.buffer.selectionEnd++;
        }

        if (pad.buttons[14].active && pad.buttons[14].delta) {
          _this.tags.buffer.focus();

          _this.tags.buffer.selectionEnd = _this.tags.buffer.selectionStart;
          _this.tags.buffer.selectionStart--;
          _this.tags.buffer.selectionEnd--;
        }

        if (pad.buttons[15].active && pad.buttons[15].delta) {
          _this.tags.buffer.focus();

          _this.tags.buffer.selectionStart = _this.tags.buffer.selectionEnd;
          _this.tags.buffer.selectionStart++;
        }

        if (pad.buttons[6].active) {
          _this.letters = banks[1];
        } else if (pad.buttons[7].active) {
          _this.letters = banks[2];
        } else {
          _this.letters = banks[0];
        }

        if (pad.buttons[8].active || pad.buttons[9].active) {
          _this.deactivate();
        }

        _this.setButtons();

        var angle = Math.atan2(pad.axes[1].magnitude, pad.axes[0].magnitude) / Math.PI;
        var selected = (6 + (Math.round(angle * 4) + 4)) % 8;
        _this.args.angle = selected;

        if (!pad.axes[0].magnitude && !pad.axes[1].magnitude) {
          _this.args.angle = 'x';
          selected = undefined;
        }

        var sectors = _this.findTags('.arctype-wing');

        for (var i in sectors) {
          var sector = sectors[i];

          if (i !== undefined && Number(i) === selected) {
            sector.classList.add('arctype-selected');

            var _iterator = _createForOfIteratorHelper(_toConsumableArray(Array(4)).keys()),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _i = _step.value;

                if (pad.buttons[_i].active && pad.buttons[_i].delta) {
                  sector.querySelector(".arctype-button:nth-child(".concat(_i + 1, ")")).click();
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          } else {
            sector.classList.remove('arctype-selected');
          }
        }

        requestAnimationFrame(eachFrame);
      };

      requestAnimationFrame(eachFrame);
    });

    return _this;
  }

  _createClass(ArcType, [{
    key: "onAttach",
    value: function onAttach() {
      this.setButtons();
    }
  }, {
    key: "setButtons",
    value: function setButtons() {
      this.buttons = this.buttons || this.findTags('.arctype-button');

      for (var i in this.buttons) {
        var button = this.buttons[i];
        button.dataset.buttonId = i;

        if (i in this.letters) {
          button.querySelector('span').innerText = this.letters[i];
        }
      }
    }
  }, {
    key: "click",
    value: function click(event) {
      event && event.preventDefault();

      if (!('buttonId' in event.currentTarget.dataset)) {
        return;
      }

      var buttonId = Number(event.currentTarget.dataset.buttonId);
      this.tags.buffer.focus();

      if (buttonId in this.letters) {
        var letter = this.letters[buttonId];
        document.execCommand('insertText', false, letter);
      }
    }
  }, {
    key: "activate",
    value: function activate(target) {
      if (this.args.active || this.tags.buffer.isSameNode(target)) {
        return;
      }

      this.tags.buffer.focus();
      this.tags.buffer.node.value = target.value;
      this.args.active = true;
      this.target = target;
      this.tags.buffer.value = '';
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      var setValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (setValue) {
        this.target.value = this.tags.buffer.value;
      }

      this.args.active = false;
    }
  }, {
    key: "focus",
    value: function focus(event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }]);

  return ArcType;
}(_View2.View);

exports.ArcType = ArcType;
});

;require.register("arctype/Config.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
var Config = {};
exports.Config = Config;
});

require.register("arctype/arctype.html", function(exports, require, module) {
module.exports = "<div class = \"arctype-host\" data-active = \"[[active]]\">\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>1</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>5</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>6</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>7</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<div class = \"arctype-wing\">\n\t\t<div class = \"arctype-sector\">\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>8</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>2</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>3</span></div>\n\t\t\t<div class = \"arctype-button\" cv-on = \"click(event)\"><span>4</span></div>\n\t\t</div>\n\t</div>\n\t<button cv-on = \"click:deactivate\" class = \"close\">✕</button>\n\t<input cv-ref = \"buffer\" cv-on = \"focus\" />\n\t<div class = \"help-text\">\n\t\t<b>Left stick</b> - Select a group.<br />\n\t\t<b>Face buttons</b> Select a character.<br />\n\t\t<b>D-Pad L/R</b> - Move text cursor left/right.<br />\n\t\t<b>START/Enter</b> - Return to the page.<br />\n\t\t<b>Left Bumper / L1</b> - Backspace<br />\n\t\t<b>Right Bumper / R1</b> - Insert a space<br />\n\t\t<b>Left Trigger / L2</b> - Capitals and symbols.<br />\n\t\t<b>Right Trigger / R2</b> - Numbers and symbols.<br />\n\t</div>\n</div>\n"
});

;require.register("arctype/initialize.js", function(exports, require, module) {
"use strict";

var _View = require("curvature/base/View");

var _ArcType = require("./ArcType");

var root = _View.View.from("\n\t<div class = \"page-wrapper\">\n\t\t<h1>ArcType Demo</h1>\n\t\t<p>Quicker typing for gamepads.</p>\n\t\t<section class = \"form\">\n\t\t\t<label>Test input: <input /></label>\n\t\t</section>\n\t\t<section class = \"footer\">&copy; 2021 - 2024 Sean Morris</section>\n\t</div>\n");

document.addEventListener('DOMContentLoaded', function () {
  return root.render(document.body);
});
var arc = new _ArcType.ArcType(); // Render arctype to the document body when the DOM is ready

document.addEventListener('DOMContentLoaded', function () {
  return arc.render(document.body);
}); // Trigger ArcType on element focus

document.addEventListener('focus', function (event) {
  // Ignore everything except typeable inputs and textareas
  if (!event.target.matches('input[type="text"],textarea,input:not([type])')) {
    return;
  } // Actvate arctype for the focused element


  arc.activate(event.target);
}, {
  capture: true
});
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

"use strict";

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;
  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },
    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      }); // Hack to force page repaint after 25ms.

      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },
    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });
      var loaded = 0;
      var all = srcScripts.length;

      var onLoad = function onLoad() {
        loaded = loaded + 1;

        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);

    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };

    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };

    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };

  connect();
})();
/* jshint ignore:end */
;
//# sourceMappingURL=app.js.map