(function webpackUniversalModuleDefinition(name, root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(name, factory);
    } else if (typeof exports === 'object') {
        exports[name] = factory();
    } else {
        root[name] = factory();
    }
})('jquery.ext', this, function(require, exports, module) {
    var $ = require('jquery') || jQuery;


    (function() {
        var $doc;
        $.getDoc = function() {
            if (!$doc) {
                $doc = $(document);
            }
            return $doc;
        };


        var $win;
        $.getWin = function() {
            if (!$win) {
                $win = $(window);
            }
            return $win;
        };

        var $body;
        $.getBody = function() {
            if (!$body) {
                $body = $(document.body || document.getElementsByTagName("body")[0] || document.documentElement);
            }
            return $body;
        };

        var head;
        $.getHead = function() {
            if (!head) {
                head = $(document.head || document.getElementsByTagName("head")[0] || document.documentElement);
            }
            return head;
        };


    })();

    $.getClipboardTextData = function(event) {
        return event.originalEvent.clipboardData.getData("text/plain");
    };
    $.getClipboardHTMLData = function(event) {
        return event.originalEvent.clipboardData.getData("text/html");
    };


    (function() {

        var _core_rnotwhite_ = /\S+/g;

        $.addClass = function(elem, className) {
            if (!elem) {
                return;
            }
            var _curClassName_ = elem.className;
            if (_curClassName_) {
                _curClassName_ = " " + _curClassName_ + " ";
                var _cArray = className.match(_core_rnotwhite_);
                for (var i = 0, len = _cArray.length; i < len; i++) {
                    var clazz = _cArray[i];
                    if (_curClassName_.indexOf(" " + clazz + " ") < 0) {
                        _curClassName_ += clazz + " ";
                    }
                }
            } else {
                _curClassName_ = className;
            }

            elem.className = $.trim(_curClassName_);
        };

        $.removeClass = function(elem, className) {
            if (!elem) {
                return;
            }
            var _curClassName_ = elem.className;
            if (_curClassName_) {
                _curClassName_ = " " + _curClassName_ + " ";
                var _cArray = className.match(_core_rnotwhite_);
                for (var i = 0, len = _cArray.length; i < len; i++) {
                    var clazz = _cArray[i];
                    if (_curClassName_.indexOf(" " + clazz + " ") >= 0) {
                        _curClassName_ = _curClassName_.replace(" " + clazz + " ", " ");
                    }
                }
                elem.className = $.trim(_curClassName_);
            }
        };

        $.toggleClass = function(elem, className) {
            if (!elem) {
                return;
            }
            var _curClassName_ = elem.className;
            if (_curClassName_) {
                _curClassName_ = " " + _curClassName_ + " ";
                var _cArray = className.match(_core_rnotwhite_);
                for (var i = 0, len = _cArray.length; i < len; i++) {
                    var clazz = _cArray[i];
                    if (_curClassName_.indexOf(" " + clazz + " ") < 0) {
                        _curClassName_ += clazz + " ";
                    } else {
                        _curClassName_ = _curClassName_.replace(" " + clazz + " ", " ");
                    }
                }
            } else {
                _curClassName_ = className;
            }

            elem.className = $.trim(_curClassName_);
        };

        $.hasClass = function(element, className) {
            if (className.length > 0) {
                var css = element.className.split(" ");
                var len = css.length || 0;
                for (var i = 0; i < len; i++) {
                    if (css[i] == className) {
                        return true;
                    }
                }
            }
            return false;
        };

    })();


});
