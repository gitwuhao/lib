(function(global) {

    var ui = global.ui || {};
    var util = ui.util || {};
    ui.util = util;
    global.ui = ui;


    function mousewheelHandle(event) {
        this.scrollTop += event.wheelDelta > 0 ? -60 : 60;
        return false;
    }

    util.scrolloverflow = function(element) {
        var event_type = 'mousewheel';
        ui.event.off(element, event_type, mousewheelHandle);
        ui.event.on(element, event_type, mousewheelHandle);
    };

    
})(this);
