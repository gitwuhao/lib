(function(global, undefined) {

    var classjs = global.classjs,
        $fn = classjs.$fn,
        each = util.each,
        merger = util.merger,
        apply = util.apply,
        setOwner = classjs.setOwner,
        __NO_FUNCTION__ = '__NO_FUNCTION__';

    function extendEvent(obj) {
        merger(obj, {
            /**
             *this.emit('createClassAfter',{});
             *this.on('createClassAfter', function(event) {
             *});
             */
            on: function(types, handle) {
                var events = this.__events__;
                if (!events) {
                    events = this.__events__ = {};
                }
                each(types.split(" "), function(i, type) {
                    if (type) {
                        var array = events[type];
                        if (!array) {
                            events[type] = array = [];
                        }
                        array.push(handle);
                    }
                }, this);
                return this;
            },
            off: function(types, handle) {
                var typeArray = types.split(" "),
                    l = 0,
                    m = 0,
                    array,
                    event,
                    events = this.__events__;
                if (!events) {
                    return;
                }

                while (typeArray[l]) {
                    type = typeArray[l];
                    array = events[type];
                    m = 0;
                    if (array) {
                        if (handle) {
                            while (array[m]) {
                                if (array[m] == handle) {
                                    array.splice(m, 1);
                                } else {
                                    m++;
                                }
                            }
                        }
                        if (!handle || array.length == 0) {
                            delete this.__events__[type];
                            array = null;
                        }
                    }
                    l++;
                }
            },
            hasListener: function(type, handle) {
                var events = this.__events__;
                if (events && events[type]) {
                    var result = each(events[type], function(i, fn) {
                        if (fn == handle) {
                            return false;
                        }
                    });
                    return result == false;
                }
                return false;
            },
            __createEvent__: function(type, data) {
                return merger(data, {
                    __isEvent__: true,
                    __type__: type
                });
            },
            emit: function(type, data) {
                var events = this.__events__,
                    event;

                if (!events) {
                    return;
                }
                event = this.__createEvent__(type, data);

                each(events[type], function(i, handle) {

                    setOwner(this, type, handle, {
                        __isEventHandle__: true
                    });

                    if (handle.call(this, event) == false) {
                        return false;
                    }
                }, this);

            }
        });
    };
    //重写并实现$fn的on和trigger
    extendEvent($fn);
    //注入initPrototype并让prototype实现event
    $fn.on('initPrototypeAfter', function(event) {
        var prototype = event.prototype;
        if (prototype.extendEvent == true) {
            extendEvent(prototype);
            delete prototype.extendEvent;
        }
    });

})(this);
