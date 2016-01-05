(function(exports) {

    var util = exports.util,
        event = function() {};

    util.event = event;

    util.merger(event.prototype, {
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
            util.each(types.split(" "), function(i, type) {
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
        once: function(types, handle) {
            handle.__is_once__ = 1;
            this.on.apply(this, arguments);
        },
        off: function(types, handle) {
            var typeArray = types.split(" "),
                l = 0,
                m = 0,
                array,
                e,
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
                        e = array[m];
                        while (e) {
                            if (e == handle) {
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
                var result = util.each(events[type], function(i, fn) {
                    if (fn == handle) {
                        return false;
                    }
                });
                return result == false;
            }
            return false;
        },
        __createEvent__: function(type, data) {
            return util.merger(data, {
                __isEvent__: true,
                __type__: type
            });
        },
        emit: function(type, data) {
            var _events = this.__events__,
                e, array, i = 0;

            if (!_events) {
                return;
            }
            e = this.__createEvent__(type, data);

            array = _events[type];

            while (array[i]) {
                var handle = array[i];
                if (util.isFunction(handle)) {
                    if (handle.__is_once__) {
                        array.splice(i, 1);
                    } else {
                        i++;
                    }
                    if (handle.call(this, e) == false) {
                        break;
                    }
                }
            }
        }
    });


    event.extend = function(obj) {
        if (util.isFunction(obj)) {
            obj.prototype = new event();
        } else if (util.isObject(obj)) {
            util.merger(obj, event.prototype);
        }
        return obj;
    };

    util.merger(event, event.prototype);

    return event;


})(this);
