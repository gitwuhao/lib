(function(global, undefined) {

    if (global.classjs) {
        return
    }

    var ObjectPrototype = Object.prototype,
        FunctionPrototype = Function.prototype,
        ObjectHasOwnProperty = ObjectPrototype.hasOwnProperty,
        each = util.each,
        it = util.it,
        merger = util.merger,
        apply = util.apply,
        emptyFn = util.emptyFn,
        isObject = util.isObject,
        isString = util.isString,
        isFunction = util.isFunction;

    var removeOwnProperty = function() {
        it(this, function(key, value) {
            if (value && isFunction(value)) {
                removeOwnProperty.call(value);
            }
            this[key] = null;
            delete this[key];
        }, this);
        return this;
    };

    //默认构造函数
    function getClassConstructor() {
        return function(config) {
            if (config != classjs.__IS_CREATE_CLASS__ && this.init) {
                var result = this.init.apply(this, arguments);
                this.ready();
                return result;
            }
        };
    };

    var ClassConstructorString = getClassConstructor().toString();

    function getNameSpace(className, isClass) {
        var parent = global,
            ref,
            pack = [],
            refNS;
        each(className.split('\.'), function(i, NS, size) {
            refNS = NS;
            parent[NS] = parent[NS] || {};
            ref = parent[NS];

            if (isClass && i == size - 2) {
                //创建类的构造函数，为了提高debug对象的可识别度
                var fn = new Function(className + '=' + ClassConstructorString);
                fn();
            }
            if (i < size - 1) {
                parent = parent[NS];
                pack.push(NS);
            }
        });




        return {
            parent: parent,
            ref: ref,
            pack: pack.join('.'),
            refNS: refNS
        };
    };


    //给function设置所有者关系，用于logger信息和this.callPrototype()、this.callSuper()
    function setOwner(clazz, name, fn, config) {
        if (fn && isFunction(fn) && !fn.__owner__) {
            fn.__owner__ = clazz;
            fn.__name__ = name;
            merger(fn, config);
            return true;
        }
        return false;
    };

    function setThisOwner(config) {
        it(this, function(key, value) {
            setOwner(this, key, value, config);
        }, this);
    };


    function addClass(clazz) {
        classMap[clazz.__className__] = clazz;
    };

    function getClass(className) {
        var clazz = classMap[className];
        if (clazz && !clazz.__isSingleton__) {
            return clazz;
        } else if (className && !clazz) {
            console.error('no find class:' + className);
        }
    };

    function initClass(clazz) {
        var NS = getNameSpace(clazz.className, true),
            superClass = getClass(clazz.extend),
            prototype = clazz;


        $fn.emit('initClassBefore', {
            clazz: clazz
        });

        clazz = NS.ref;

        apply(clazz, prototype.statics);

        merger(clazz, {
            __isClass__: true,
            __package__: NS.pack,
            __name__: NS.refNS,
            __className__: prototype.className,
            __prototype__: prototype
        });


        delete prototype.extend;

        if (superClass) {
            clazz.__super__ = superClass;

            //使用原型链继承，而不是copy、merger原型
            clazz.prototype = superClass.prototype;

            //用原型链实现继承，并模拟类似DOM的继承关系
            var fn = new Function('return new ' + prototype.className + '(classjs.__IS_CREATE_CLASS__);');
            clazz.prototype = fn();
        }

        NS.parent[NS.refNS] = clazz;

        setThisOwner.call(clazz);
        $fn.emit('initClassAfter', {
            clazz: clazz
        });
        return clazz;
    };

    function callSuper() {
        var caller = arguments.callee.caller,
            method,
            arg,
            superClass,
            result,
            superPrototype;

        method = caller.__name__;
        arg = caller.arguments;
        superClass = caller.__owner__.getSuperClass();
        superPrototype = superClass.prototype;

        if (superPrototype && superPrototype[method]) {
            result = superPrototype[method].apply(this, arg);
        } else if (superClass[method]) {
            result = superClass[method].apply(this, arg);
        }
        return result;
    };

    function initPrototype(clazz) {
        var prototype = clazz.__prototype__;

        $fn.emit('initPrototypeBefore', {
            clazz: clazz
        });

        delete prototype.statics;

        delete clazz.__prototype__;

        if (clazz.__super__) {
            prototype.callSuper = function() {
                var caller = arguments.callee.caller,
                    method,
                    arg,
                    superClass,
                    result,
                    superPrototype;

                method = caller.__name__;
                arg = caller.arguments;
                superClass = caller.__owner__.getSuperClass();
                superPrototype = superClass.prototype;

                if (superPrototype && superPrototype[method]) {
                    result = superPrototype[method].apply(this, arg);
                } else if (superClass[method]) {
                    result = superClass[method].apply(this, arg);
                }
                return result;
            };

            prototype.getSuper = function() {
                return this.getSuperClass().prototype;
            };
        }


        merger(clazz.prototype, {
            constructor: clazz,
            __isPrototype__: true,
            __class__: clazz,
            package: clazz.__package__,
            name: clazz.__name__,
            callPrototype: function() {
                var caller = arguments.callee.caller,
                    method,
                    arg;
                method = caller.__name__;
                arg = caller.arguments;
                return this.getPrototype()[method].apply(this, arg);
            }
        }, prototype);

        apply(clazz.prototype, {
            init: function(config) {
                classjs.log();
                //重写对象属性和方法
                this.override(config);
            },
            ready: emptyFn,
            destroy: function() {
                classjs.log();
                removeOwnProperty.call(this);
            },
            override: function(config) {
                if (config) {
                    merger(this, config);
                    setThisOwner.call(this, {
                        __isOverride__: true
                    });
                }
            },
            getClass: function() {
                return this.__class__;
            },
            getSuperClass: function() {
                return this.__class__.__super__;
            },
            getPrototype: function() {
                return this.__class__.prototype;
            }
        });

        $fn.emit('initPrototypeAfter', {
            prototype: clazz.prototype
        });

        setThisOwner.call(clazz.prototype);

        return clazz.prototype;
    };



    var Singleton = function() {};

    merger(Singleton.prototype, {
        __isSingleton__: true
    });


    function initSingleton(clazz) {
        var instance = new Singleton();

        merger(instance, clazz, {
            destroy: function() {
                classjs.log();
                removeOwnProperty.call(this);
            }
        });

        delete instance.singleton;


        $fn.emit('initPrototypeAfter', {
            prototype: instance
        });


        setThisOwner.call(instance);

        var NS = getNameSpace(instance.className);

        NS.parent[NS.refNS] = instance;


        return instance;
    };



    var classMap = {},
        $fn = {
            //事件触发，用于插件注入
            emit: emptyFn
        },
        classjs = global.classjs = function(clazz) {

            $fn.emit('createClassBefore', {
                clazz: clazz
            });


            if (clazz.singleton) {

                initSingleton(clazz);

            } else {

                clazz = initClass(clazz);

                initPrototype(clazz);

            }

            addClass(clazz);

            $fn.emit('createClassAfter', {
                clazz: clazz
            });

        };

    merger(classjs, {
        __IS_CREATE_CLASS__: '__IS_CREATE_CLASS__',
        version: "1.0",
        //暴露classjs.log接口
        log: emptyFn,
        $fn: $fn,
        setOwner: setOwner,
        getClass: getClass,
        merger: merger,
        apply: apply,
        each: each,
        it: it,
        isObject: isObject,
        isString: isString,
        isFunction: isFunction
    });

})(this);
