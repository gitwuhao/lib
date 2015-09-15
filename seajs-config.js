(function(seajs) {
    'use strict';
    var ROOT_PATH = window.ROOT_PATH || '/wuhao/',
        LIB_PATH = ROOT_PATH + 'lib';
    seajs.config({
        base: ROOT_PATH,
        debug: true,
        alias: {
            'seajs.css': LIB_PATH + '/seajs-css/dist/seajs-css-debug.js',
            'seajs.queue': LIB_PATH + '/MyJS/seajs.queue.js',
            'jquery': LIB_PATH + '/jquery/jquery-2.1.1.js',
            "qunit": LIB_PATH + "/qunit/qunit-1.18.0.js",
            'handlebars': LIB_PATH + '/handlebars/handlebars-v3.0.3.js',
            'class': LIB_PATH + '/MyJS/class/src/class.js',
            'class.event': LIB_PATH + '/MyJS/class/src/class.event.js',
            'class.log': LIB_PATH + '/MyJS/class/src/class.log.js',
            'color': LIB_PATH + '/MyJS/color.js',
            'util': LIB_PATH + '/MyJS/util.js',
            'js.ext': LIB_PATH + '/MyJS/js.ext.js',
            'jquery.ext': LIB_PATH + '/MyJS/jquery.ext.js',
            'f7': LIB_PATH + '/Framework7-1.0.6/dist/js/framework7.js',
            'f7.css': LIB_PATH + '/Framework7-1.0.6/dist/css/framework7.css',
            'f7.css': LIB_PATH + '/Framework7-1.0.6/dist/css/framework7.css',
            'backbone': LIB_PATH + '/backbone/backbone.1.2.2.js',
            'underscore': LIB_PATH + '/underscore/underscore.1.8.3.js'
        },
        paths: {
            '%root%': ROOT_PATH,
            '%lib%': LIB_PATH,
            '%myjs%': LIB_PATH + '/MyJS',
            '%.%': '.'
        }
    });


    seajs.on('save', function(data) {
        var alias = seajs.data.alias;

        //console.info('on save:',data);
    });

    var manifest = {
        'js/test/touch.js': '5815951a'
    };
    seajs.on('request', function(data) {
        var uri = data.requestUri;
        for (var key in manifest) {
            if (uri.indexOf(key) > -1) {
                if (/[?]/g.test(uri)) {
                    uri += '&';
                } else {
                    uri += '?';
                }
                uri += '_v=' + manifest[key];
                delete manifest[key];
            }
        }
        data.requestUri = uri;
    });

    seajs.on('fetch', function(data) {
        //console.info('on fetch:',data);
    });

    seajs.on('exec', function(data) {
        //console.info('on exec:',data);
    });

})(seajs);
