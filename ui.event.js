(function(global) {

    var ui = global.ui || {};
    var event = ui.event || {};
    ui.event = event;
    global.ui = ui;

    event.on = (function() {
        return document.addEventListener ?
            (function(elem, type, eventHandle) {
                elem.addEventListener(type, eventHandle, false);
            }) :
            (function(elem, type, eventHandle) {
                elem.attachEvent("on" + type, eventHandle);
            });
    })();

    event.off = (function() {
        return document.removeEventListener ?
            (function(elem, type, eventHandle) {
                elem.removeEventListener(type, eventHandle, false);
            }) :
            (function(elem, type, eventHandle) {
                elem.detachEvent("on" + type, eventHandle);
            })
    })();

    return ui;

})(this);
