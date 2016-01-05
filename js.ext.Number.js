(function(global) {


    Number.isNumber = function(val) {
        return val - parseFloat(val) >= 0;
    };

    Number.toNumber = function(val) {
        if (isNaN(val)) {
            return null;
        }
        var value;
        if (/\./.test(val)) {
            value = parseFloat(val);
        } else {
            value = parseInt(val);
        }
        return value;
    };

    Number.toFixed = function(val, precision) {
        if (!this.isNumber(val)) {
            return 0;
        }
        var power = Math.pow(10, precision || 0);
        return parseFloat(String(Math.round(val * power) / power));
    };

    Number.toPrecision = function(val, precision) {
        if (!this.isNumber(val)) {
            return 0;
        }
        val = val.toString();
        var s = val.indexOf(".");
        if (s >= 0) {
            val = val.substr(0, precision + s + 1);
        }
        return parseFloat(val);
    };

    /*
     *1,121,032.00
     */
    Number.stringify = function(val) {
        if (!this.isNumber(val)) {
            return '0';
        }
        val = val.toString();

        var array = [],
            list = val.split('.');

        val = list[0];
        for (var i = 0, len = val.length - 1; len >= 0; len--) {
            array.push(val.charAt(len));
            ++i;
            if (i == 3 && len > 0) {
                array.push(',');
                i = 0;
            }
        }

        val = array.reverse().join('');
        if (list[1]) {
            val = val + '.' + list[1];
        }
        return val;
    };
 


})(this);
