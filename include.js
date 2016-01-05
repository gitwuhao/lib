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

    include.queue = function(type, src1, src2, src3, callback) {
        if (!/^css$/i.test(type)) {
            type = 'js';
        } else {
            type = 'css';
        }

        var list = arguments;
        var len = list.length - 1;
        var i = 1;

        function get() {
            if (i == len) {
                var fn = list[len];
                if (typeof fn == "function") {
                    fn();
                } else if (typeof fn == "string") {
                    __include__(type, fn);
                }
                return;
            }
            var url = list[i++];
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


    if (exports.onIncludeReady) {
        exports.onIncludeReady();
    }

    return include;

})(this);
