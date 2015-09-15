(function webpackUniversalModuleDefinition(name, root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(function() {
            return factory.apply(this,arguments);
        });
    } else if (typeof exports === 'object') {
        exports[name] = factory();
    } else {
        root[name] = factory();
    }
})('module', this, function(require, exports, module) {




});
