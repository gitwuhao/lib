(function(global, undefined) {
    var tagArray = 'img|object|html|body|head|meta|link|style|iframe|frame|embed|audio|video',
        tagPrefix = 'xxx';

    util.html = function(config) {
        this.init.apply(this, arguments);
    };

    function getTagName(tag) {
        if (tag == 'script') {
            return 'script';
        }
        return tagPrefix + tag + tagPrefix;
    };

    util.merger(util.html, {
        encodeReg: new RegExp('(<|<\\\/)(' + tagArray + ')', 'gi'),
        decodeReg: new RegExp('(<|<\\\/)' + tagPrefix + '(' + tagArray + ')' + tagPrefix, 'gi'),
        encodeHTML: function(html) {
            return html.replace(this.encodeReg, '$1' + getTagName('$2'))
                .replace(/\s+(src\s?=|background\s?=)/ig, ' data-$1');
        },
        decodeHTML: function(html) {
            return html.replace(this.decodeReg, '$1$2');
        },
        getDataByKey: function(key, array) {
            for (var n = 0, len = array.length; n < len; n++) {
                if (new RegExp(key, 'gi').test(array[n])) {
                    try {
                        var fn = new Function(array[n] + '; return ' + key + ';');
                        return fn();
                    } catch (err) {
                        console.error(err);
                        return null;
                    }
                }
            }
        }
    });

    util.merger(util.html.prototype, {
        init: function(html) {
            this.doc = document.createElement('div');
            if (html) {
                this.doc.innerHTML = util.html.encodeHTML(html);
            }
        },
        getDataByKey: util.html.getDataByKey,
        getTagName: getTagName,
        getTagContext: function(tag) {
            var list = this.doc.getElementsByTagName(this.getTagName(tag));
            var array = [];
            for (var n = 0, len = list.length; n < len; n++) {
                var html = list[n].innerHTML;
                if (html.length > 0 && !/^\s+$/.test(html)) {
                    array.push(html);
                }
            }
            return array;
        },
        getById: function(id) {
            return this.query('[id="' + id + '"]');
        },
        query: function(seleter) {
            return this.doc.querySelector(seleter);
        },
        queryAll: function(seleter) {
            return this.doc.querySelectorAll(seleter);
        }
    });
})(window);
