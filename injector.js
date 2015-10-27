var Injector = function() {
  this.bindings = {};
  this.cache = {};
};

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}

Injector.prototype = {
  constructor: Injector,

  bind: function(type, arg, cache) {
    cache = cache || false;
    var deps = [];
    var func;
    if (Array.isArray(arg)) {
      func = arg.pop();
      deps = arg;
    } else if (typeof arg === 'function') {
      func = arg;
      deps = getParamNames(func);
    } else {
      this.bindings[type] = {
        value: arg
      };
      return;
    }

    this.bindings[type] = {
      func: func,
      deps: deps,
      cache: cache
    };
  },

  get: function(type) {
    var binding = this.bindings[type];

    if (binding.hasOwnProperty('value')) {
      return binding.value;
    }

    if (binding.cache && this.cache.hasOwnProperty(type)) {
      return this.cache[type];
    }

    var deps = [];
    for (var i = 0; i < binding.deps.length; i++) {
      var dep = this.get(binding.deps[i]);
      deps.push(dep);
    }

    var obj = this._construct(binding.func, deps);

    if (binding.cache) {
      this.cache[type] = obj;
    }

    return obj;
  },

  _construct: function(func, args) {
    var argArray = [null].concat(args);
    var factoryFunc = func.bind.apply(func, argArray);
    return new factoryFunc();
  }
};

module.exports = Injector;