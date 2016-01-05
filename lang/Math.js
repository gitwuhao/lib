(function(global) {

    Math.randomInt = function(size) {
        return parseInt(size * Math.random());
    };

    var CHAR_ARRAY = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    Math.randomChar = function(len) {
        if (len > 8) {
            len = 8;
        }
        var length = CHAR_ARRAY.length - 1;
        var list = [];
        for (var i = 0; i < len; i++) {
            var index = Math.randomInt(length);
            list.push(CHAR_ARRAY[index]);
        }
        return list.join('');
    };


})(this);
