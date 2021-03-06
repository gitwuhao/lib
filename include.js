/*
注册一个IncludeReady回调函数
window.onIncludeReady = function() {
    console.info('onIncludeReady');
};
*/
(function(exports) {

    var include = exports.include ? exports.include : function(src, callback) {
        return __include__('js', src, callback);
    };


    function __include__(type, src, callback) {
        var pack = null;
        if (!src) {
            return;
        }
        var head = include.head;
        if (type == "css") {
            pack = document.createElement("link");
            pack.rel = "stylesheet";
            pack.type = "text/css";
            pack.href = src;

        } else if (type == "javascript" || type == "js") {
            pack = document.createElement("script");
            /*
            if(pack.async){
                pack.async = "async";
            }
            */
            pack.type = "text/javascript";
            pack.src = src;
        }
        if (pack) {
            head.insertBefore(pack, head.lastChild);
            if (callback) {
                pack.onload = pack.onreadystatechange = function(_, isAbort) {
                    if (isAbort || !pack.readyState || /loaded|complete/.test(pack.readyState)) {
                        pack.onload = pack.onreadystatechange = null;
                        pack = undefined;
                        if (!isAbort && callback) {
                            callback(200, "success");
                        }
                    }
                };
                pack.onerror = callback;
            }
            return 1;
        }
        return 0;
    };

    include.head = (function() {
        return document.head || document.body || document.documentElement;
    })();

    /**
     *'js/js.js'
     */
    include.queue = function(type, src1, src2, src3, callback) {
        var array = [];
        array.push.apply(array, arguments);
        var len = array.length - 1;
        var index = 1;

        if (!/^css$/i.test(type)) {
            //默认type=js
            if (!/^js|javascript$/i.test(type)) {
                index = 0;
            }
            type = 'js';
        } else {
            type = 'css';
        }

        function get() {
            if (index == len) {
                var fn = array[len];
                if (typeof fn == "function") {
                    fn();
                } else if (typeof fn == "string") {
                    __include__(type, fn);
                }
                return;
            }
            var url = array[index++];
            if (url) {
                __include__(type, url, get);
            }
        }
        get();
    };


    include.css = function(src1, src2, src3, callback) {
        var args = ['css'];
        args.push.apply(args, arguments);
        this.queue.apply(this, args);
    };

    include.js = function(src1, src2, src3, callback) {
        this.queue.apply(this, arguments);
    };


    exports.include = include;

    (function() {
        var readyMethod = 'onIncludeReady';
        if (exports[readyMethod]) {
            exports[readyMethod]();
            // try {
                // delete exports[readyMethod];
            //  fix ie bug
            // } catch (e) {
                exports[readyMethod] = undefined;
            // }
        }
    })();

    return include;

})(this);
