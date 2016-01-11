( function(global, undefined) {
"use strict";

var hash = (function() {
	
	var location=global.location;

    var fromHash = function() {
        var params = location.hash ? location.hash.substr(1).split("&") : [],
            paramsObject = {};

        for(var i = 0; i < params.length; i++) {
            var a = params[i].split("=");
            paramsObject[a[0]] =  decodeURIComponent(a[1]);
        }
        return paramsObject;
    };

    var toHash = function(params) {
        var str = [];
        for(var p in params) {
            str.push(p + "=" + encodeURIComponent(params[p]));
        }
        location.hash = str.join("&");
    };

    return {
        get: function(param) {
            var params = fromHash();
            if (param) {
                return params[param];
            } else {
                return params;
            }
        },
        add: function(newParams) {
            var params = fromHash();
            for (var p in newParams) {
                params[p] = newParams[p];
            }
            toHash(params);
        },
        remove: function(removeParams) {
            removeParams = (typeof(removeParams)=='string') ? [removeParams] : removeParams;
            var params = fromHash();
            for (var i = 0; i < removeParams.length; i++) {
                delete params[removeParams[i]];
            }
            toHash(params);
        },
        clear: function() {
            toHash({});
        }
    };
})();

global.hash = hash;
})(window);