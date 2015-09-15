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
})('js.ext', global, function(require, exports, module) {

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

    String.prototype.replaceAll = function(s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };

    String.prototype.toFirstUpperCase = function() {
        return this.replace(/^./g, function(match) {
            return match.toUpperCase();
        });
    };

    String.prototype.toCamelCase = function() {
        var list = this.split('_') || [];
        for (var i = 1, len = list.length; i < len; i++) {
            list[i] = list[i].toFirstUpperCase();
        }
        return list.join('');
    };

    String.prototype.formatHTML = function() {
        return this.replaceAll('`', '&nbsp;')
            .replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;')
            .replaceAll('\n', '<br/>');
    };


    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+/, "").replace(/\s+$/, "");
        };
    }

    Date.parseStr = function(dateString) {
        var array = (dateString || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:(\s+(\d{1,2}):(\d{1,2}):(\d{1,2})))?/);
        if (!array.length || array.length < 5) {
            return NaN;
        }
        var date = new Date(array[1], 0, 1);
        if (array[2]) {
            date.setMonth(array[2] - 1);
        }
        if (array[3]) {
            date.setDate(array[3]);
        }
        if (array[5]) {
            date.setHours(array[5]);
        }
        if (array[6]) {
            date.setMinutes(array[6]);
        }
        if (array[7]) {
            date.setSeconds(array[7]);
        }
        date.setMilliseconds(0);
        return date.getTime();
    };

    Date.prototype.format = function(f) {
        var format = f || 'yyyy-MM-dd hh:mm:ss';
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    Date.prototype.formatDate = function() {
        return this.format('yyyy-MM-dd');
    };

    Date.prototype.formatDateTime = function() {
        return this.format('yyyy-MM-dd hh:mm:ss');
    };

    Date.getDateTime = function() {
        return new Date().formatDateTime();
    };

    Date.getDate = function() {
        return new Date().formatDate();
    };


    Date.ONE_DAY_OF_MILLISECONDS = 86400000;

    Date.SUNDAY = 0;
    Date.MONDAY = 1;
    Date.TUESDAY = 2;
    Date.WEDNESDAY = 3;
    Date.THURSDAY = 4;
    Date.FRIDAY = 5;
    Date.SATURDAY = 6;

    Date.prototype.stringify = function() {
        var today = new Date(),
            curdate = new Date(this.getTime()),
            hours = this.getHours(),
            minutes = this.getMinutes(),
            time,
            day;

        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        curdate.setHours(0);
        curdate.setMinutes(0);
        curdate.setSeconds(0);
        curdate.setMilliseconds(0);

        today = ((today.getTime() / Date.ONE_DAY_OF_MILLISECONDS) + "").split('.');

        day = ((curdate.getTime() / Date.ONE_DAY_OF_MILLISECONDS) + "").split('.');

        today = parseInt(today[0]);

        day = parseInt(day[0]);

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        time = hours + ':' + minutes;

        //今天、昨天、前天
        if (today == day) {
            return time;
        } else if (today == day + 1) {
            return '昨天 ' + time;
        } else if (today == day + 2) {
            return '前天 ' + time;
        } else {
            return this.formatDate();
        }
    };

    Date.prototype.addMilliseconds = function(value) {
        this.setMilliseconds(this.getMilliseconds() + value * 1);
        return this;
    };

    Date.prototype.addHours = function(value) {
        return this.addMilliseconds(value * 3600000); /* 60*60*1000 */
    };

    Date.prototype.addDays = function(value) {
        this.setDate(this.getDate() + value * 1);
        return this;
    };


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



});
