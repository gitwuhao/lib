(function(global) {

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


})(this);
