(function(global) {

    var util = global.util;

    util.merger(util, {
        eqObject: function(obj1, obj2) {
            var result = true;
            util.it(obj1, function(key, value) {
                if (util.isObject(value)) {
                    result = util.eqObject(obj1[key], obj2[key]);
                } else if (value != obj2[key]) {
                    result = false;
                }
                if (result == false) {
                    return false;
                }
            });
            return result;
        },
        eqArray: function(array1, array2) {
            var defaultArray = [];
            array1 = array1 || defaultArray;
            array2 = array2 || defaultArray;
            if (array1 == array2) {
                return true;
            } else if (array1.length != array2.length) {
                return false;
            }
            var result = true;
            util.each(array1, function(i, item) {
                if (util.isObject(item)) {
                    if (!util.eqObject(array1[i], array2[i])) {
                        result = false;
                    }
                } else if (array1[i] != array2[i]) {
                    result = false;
                }

                if (result == false) {
                    return false;
                }
            });
            return result;
        }

    });

    return util;


})(this);
