/*
 *seajs.queue(['jquery', 'jquery.ext','util','color'], function(require, exports, module) {
        //define module
        //do something
 *});
 */
(function(seajs) {
    'use strict';
    seajs.queue = function(deps, callback) {
        var args = null;

        if (callback) {
            define(function(require, exports, module) {
                args = Array.prototype.slice.call(arguments, 0);
                args.scope = this;
            });
        }
        var len = deps.length,
            i = 0;

        function get() {
            if (i == len && args) {
                callback.apply(args.scope, args);
                return;
            }
            var url = deps[i++];
            if (url) {
                seajs.use(url, get);
            }
        }
        get();
    };

    define("seajs/seajs-queue", [], {});
})(seajs);
