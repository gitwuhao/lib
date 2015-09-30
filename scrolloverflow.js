
    $(document.body/*overflow element*/).off('mousewheel').on('mousewheel', function(event) {
        this.scrollTop += event.originalEvent.wheelDelta > 0 ? -60 : 60;
        return false;
    });