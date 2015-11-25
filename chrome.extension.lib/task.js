(function(global, undefined) {
    /*
	*多任务队列处理
    *{
        array:[],
        timeout:300,
        autoRun : true,
        handle:function(callback){
        
        }
    }
    */
    classjs({
        className: 'util.task',
        extendEvent: true,
        index: 0,
        timeout: 0,
        autoRun: true,
        ready: function() {
            classjs.log();
            if (this.autoRun) {
                this.next();
            }
        },
        next: function() {
            classjs.log();
            var task = this.get();
            if (task) {
                this.execute(task);
            }
        },
        get: function() {
            classjs.log();
            var task = this.array[this.index++];
            if (!task) {
                this.finish();
            }
            return task;
        },
        execute: function(task) {
            classjs.log();
            var me = this;
            this.handle(task);
            this.complete(task);
        },
        complete: function(task) {
            classjs.log();
            setTimeout(this.next.bind(this), this.timeout);
        },
        finish: function() {
            classjs.log();

        }
    });


/*
*
*/

    classjs({
        className: 'util.asyncTask',
        extend: 'util.task',
        index: 0,
        autoRun: true,
        next: function() {
            classjs.log();
            var task = this.get();
            if (task) {
                this.execute(task);
            }
        },
        get: function() {
            classjs.log();
            var task = this.array[this.index++];
            if (!task) {
                this.finish();
            }
            return task;
        },
        getAjaxcfg: function(task) {
            classjs.log();
            return task;
        },
        execute: function(task) {
            classjs.log();
            var me = this,
                config = this.getAjaxcfg(task);
            $.ajax(util.merger({
                success: function(data) {
                    me.handle(task, data);
                    me.complete(task);
                },
                error: function() {}
            }, config));
        },
        complete: function(task) {
            classjs.log();
            if (this.timeout) {
                setTimeout(this.next.bind(this), this.timeout);
            } else {
                this.next();
            }
        },
        finish: function() {
            classjs.log();

        }
    });

})(window);
