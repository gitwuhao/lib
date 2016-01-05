(function(global) {

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


})(this);
