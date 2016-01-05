(function(global) {


    Array.prototype.insert = function(index, item) {
        if (this.length < index) {
            index = this.length;
        } else if (index < 0) {
            index = 0;
        }
        var args = [index, 0];

        for (var i = 1, len = arguments.length; i < len; i++) {
            args.push(arguments[i]);
        }
        this.splice.apply(this, args);
    };

    Array.prototype.getLast = function() {
        return this[this.length - 1];
    };



})(this);
