var global = window || this;
(function webpackUniversalModuleDefinition(name, root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory({}, {}, {});
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(name, factory);
    } else if (typeof exports === 'object') {
        exports[name] = factory({}, {}, {});
    } else {
        root[name] = factory({}, {}, {});
    }
})('util', global, function(require, exports, module) {

    var util = global.util || {};

	global.util=util;


    util.merger(util, {
        param2Object: function(str) {
            var _param = {},
                ps = str.split("&");
            for (var i = 0; i < ps.length; i++) {
                var s = ps[i].split("="),
                    key,
                    oValue,
                    value;
                if (s.lenght == 1) {
                    value = "";
                } else {
                    value = decodeURIComponent(s[1]);
                }
                key = s[0];
                oValue = _param[key];
                if (oValue) {
                    if (!util.isArray(oValue)) {
                        oValue = [];
                        oValue.push(_param[key]);
                        _param[key] = oValue;
                    }
                    oValue.push(value);
                } else {
                    _param[key] = value;
                }
            }
            return _param;
        },
        getParam: function() {
            var search = global.location.search;
            var _param = null;
            if (/^\?/.test(search)) {
                _param = util.param2Object(search.substring(1));
            }
            if (_param == null) {
                return {};
            }
            return _param;
        },
        getHashParam: function() {
            var hash = global.location.hash;
            var _param = null;
            if (hash) {
                _param = util.param2Object(hash.substring(1));
            }
            if (_param == null) {
                return {};
            }
            return _param;
        },
        getAnchor: function() {
            var hash = global.location.hash;
            if (hash) {
                return hash.replace(/^#/, '');
            }
            return '';
        }
    });

    return util;

});
