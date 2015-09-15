var global=window||this;
(function webpackUniversalModuleDefinition(name, root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(name, factory);
    } else if (typeof exports === 'object') {
        exports[name] = factory();
    } else {
        root[name] = factory();
    }
})('color', global, function(require, exports, module) {

    var color = global.Color || {};
	global.Color=color;

    function isString(value) {
        return typeof value === 'string';
    };

    /*
     *color.getHexColor('#Fa00af')
     *color.getHexColor('#Fa0')
     */
    color.getHexColor = function(str) {
        if (!str) {
            return null;
        }
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        str = str.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
        return result ? ['#', result[1], result[2], result[3]].join('') : null;
    };


    /*
     *color.getHexColor('#Fa00af')
     *color.getHexColor('#Fa0')
     */
    color.hexToRGB = function(hex) {
        hex = color.getHexColor(hex);
        if (!hex) {
            return null;
        }
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    };

    /*
     *color.rgbToHex(1,245,5)
     *color.rgbToHex('rgb(1,245,5)')
     *color.rgbToHex('rgba(1,245,5,1)')
     */
    color.rgbToHex = function(r, g, b) {
        if (isString(r)) {
            if (/rgb|rgba/i.test(r)) {
                r = r.match(/(rgb|rgba).+\)/)[0];
            }
            var color = r.match(/(\d+)/g);
            if (!color) {
                return;
            }
            r = color[0];
            g = color[1];
            b = color[2];
        }
        var hex = ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1)
        return '#' + hex.toUpperCase();
    };

    /*
     *color.toMiniHex('rgba(255,255,250,1)');
     *color.toMiniHex('#FFFFFF');
     */
    color.toMiniHex = function(hex) {
        if (/^#/.test(hex) && hex.length == 7) {

        } else if (isString(hex)) {
            hex = color.rgbToHex(hex);
        } else {
            return;
        }
        hex = hex.replace('#', '');
        var array = hex.split('');
        if (array[0] == array[1] && array[2] == array[3] && array[4] == array[5]) {
            hex = array[0] + array[2] + array[4];
        };
        return '#' + hex;
    };


    return color;

});

