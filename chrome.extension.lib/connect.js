(function(global, undefined) {

	/*
	*基于chrome.extension的连接器
	*/
    classjs({
        className: 'connect.port',
        extendEvent: true,
        statics: {
            INIT_CLIENT: '###init_client###',
            connects: {},
            register: function(connect) {
                this.connects[connect.id] = connect;
                console.info('server #' + connect.id + ' register success', connect);
            },
            /*
             *{
             *   id:
             *   tabId:
             *
             *}
             */
            init: function(config) {
                var connect = this.connects[config.id];
                if (!connect) {
                    console.error('no find server:', config);
                } else {
                    connect.create(config);
                }
            }
        },
        id: 'port',
        ready: function() {},
        create: function(config) {},
        initEvent: function() {},
        send: function(topic, data) {

        },
        onMessage: function(request, sender) {

        },
        createMessage: function(topic, data) {
            var message = data || {};
            message.__topic__ = topic;
            return message;
        },
        is: function(request, topic) {
            if (request.__topic__ == topic) {
                return true;
            }
            return false;
        }
    });

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        var tab = sender.tab;
        if (request.__topic__ == connect.port.INIT_CLIENT) {
            connect.port.init({
                id: request.id,
                tabId: tab.id
            });
        }
        // chrome.tabs.executeScript(tab.id, {
        //     file: "js/lib/s.js",
        //     runAt: "document_start"
        // }, function() {

        // });
    });



    classjs({
        className: 'connect.client',
        extend: 'connect.port',
        id: 'client',
        queueIndex: Date.now(),
        msgQueue: {},
        ready: function() {
            this.create();
        },
        create: function() {
            var me = this;

            chrome.extension.onConnect.addListener(function(port) {
                me.port = port;
                me.initEvent();
                me.onConnect();
            });

            chrome.extension.sendMessage(this.createMessage(connect.port.INIT_CLIENT, {
                id: this.id
            }), function(portId) {

            });

            this.create = util.emptyFn;
        },
        initEvent: function() {
            var me = this;
            this.port.onMessage.addListener(function(request, sender) {
                me.onMessage(request, sender);
            });
        },
        send: function(topic, data, callback) {
            var message = this.createMessage(topic, data);
            message.__request_id__ = 'queue::' + (this.queueIndex++);
            if (callback) {
                this.msgQueue[message.__request_id__] = callback;
            }
            this.port.postMessage(message);
        },
        onMessage: function(request, sender) {
            var callback = this.msgQueue[request.__request_id__];
            if (callback) {
                callback(request);
            }
        },
        onConnect: function() {

        }
    });


    classjs({
        className: 'connect.server',
        extend: 'connect.port',
        id: 'server',
        queueIndex: Date.now(),
        msgQueue: {},
        ready: function() {
            connect.port.register(this);
        },
        initEvent: function() {
            var me = this;
            this.port.onMessage.addListener(function(request, sender) {
                me.onMessage(request, sender, function(data) {
                    me.response(request, data);
                });
                var callback = me.msgQueue[request.__request_id__];
                if (callback) {
                    callback(request);
                }
            });
        },
        response: function(request, data) {
            var message = this.createMessage(request.__topic__, data);
            message.__request_id__ = request.__request_id__;
            this.port.postMessage(message);
        },
        request: function(topic, data, callback) {
            var message = this.createMessage(topic, data);
            message.__request_id__ = 'queue::' + (this.queueIndex++);
            if (callback) {
                this.msgQueue[message.__request_id__] = callback;
            }
            this.port.postMessage(message);
        },
        send: function(topic, data) {
            var message = this.createMessage(topic, data);
            this.port.postMessage(message);
        },
        create: function(config) {
            var me = this;
            this.port = chrome.tabs.connect(config.tabId);
            this.initEvent();
            // this.create = util.emptyFn;
        }
    });


})(window);