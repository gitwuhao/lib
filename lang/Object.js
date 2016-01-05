(function(global) {

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    if (typeof Object.create != 'function') {
        Object.create = (function() {
            var Temp = function() {};
            return function(prototype) {
                if (arguments.length > 1) {
                    throw Error('Second argument not supported');
                }
                if (typeof prototype != 'object') {
                    throw TypeError('Argument must be an object');
                }
                Temp.prototype = prototype;
                var result = new Temp();
                Temp.prototype = null;
                return result;
            };
        })();
    }

    if (!Object.defineProperties) {
        (function() {
            function hasProperty(obj, prop) {
                return hasOwnProperty.call(obj, prop);
            }

            function isCallable(v) {
                // NB: modify as necessary if other values than functions are callable.
                return typeof v === "function";
            }

            function convertToDescriptor(desc) {

                if (typeof desc !== "object" || desc === null) {
                    throw new TypeError("bad desc");
                }

                var d = {};

                if (hasProperty(desc, "enumerable")) {
                    d.enumerable = !!desc.enumerable;
                }
                if (hasProperty(desc, "configurable")) {
                    d.configurable = !!desc.configurable;
                }
                if (hasProperty(desc, "value")) {
                    d.value = desc.value;
                }
                if (hasProperty(desc, "writable")) {
                    d.writable = !!desc.writable;
                }
                if (hasProperty(desc, "get")) {
                    var g = desc.get;

                    if (!isCallable(g) && typeof g !== "undefined") {
                        throw new TypeError("bad get");
                    }
                    d.get = g;
                }
                if (hasProperty(desc, "set")) {
                    var s = desc.set;
                    if (!isCallable(s) && typeof s !== "undefined") {
                        throw new TypeError("bad set");
                    }
                    d.set = s;
                }

                if (("get" in d || "set" in d) && ("value" in d || "writable" in d)) {
                    throw new TypeError("identity-confused descriptor");
                }

                return d;
            }

            Object.defineProperties = function(obj, properties) {

                if (typeof obj !== "object" || obj === null) {
                    throw new TypeError("bad obj");
                }

                properties = Object(properties);

                var keys = Object.keys(properties);
                var descs = [];

                for (var i = 0; i < keys.length; i++) {
                    descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);
                }

                for (var i = 0; i < descs.length; i++) {
                    Object.defineProperty(obj, descs[i][0], descs[i][1]);
                }
                return obj;
            };
        })();
    }

    if (!Object.keys) {
        Object.keys = (function() {
            'use strict';
            var hasDontEnumBug = !({
                    toString: null
                }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [],
                    prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    Object.prototype.empty = function() {
        for (var key in this) {
            if (hasOwnProperty.call(this, key)) {
                delete this[key];
            }
        }
        return this;
    };
})(this);
