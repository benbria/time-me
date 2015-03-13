var HRStopwatch = require('hrstopwatch')
, timeunit = require ('timeunit')
, log = console.log
, DEFAULT_PREFIX = "timeMe";

/*
* Globally configure the module
*
* `options.log` - the function that will log out the time msg.
*/
exports.configure = function(options) {
    options = options || {};
    log = options.log;
}

exports.async = function(options, fn) {
    return timeMe(true, options, fn);
}

exports.sync = function(options, fn) {
    return timeMe(false, options, fn);
}

/*
* Wrap an async/sync function so that its total execution time
* can be recorded.
*
* `async` - whether or not the wrapped function is async
* `options.msg` {String}    - Prefix to the timing message
* `options.index` {Integer} - (optional) the index of the callback argument
*  in the wrapped func based at 0. Defaults to the last argument.
* `options.noLog` {Boolean} - (optional) whether to log out the message or not. Default is false.
* `fn` {Function}   - the function to wrap and time
*/
function timeMe(async, options, fn) {
    var msg = DEFAULT_PREFIX;
    if ("string" === typeof options) {
        if ("function" !== typeof fn) {
            return invalid("first arg string. 2nd should be func.");
        }
        msg = options;
        options = {};
    } else if ("function" === typeof options) {
        fn = options;
        options = {};
    }
    msg = options.msg || msg;
    var index = options.index,
    noLog = !!options.noLog,
    __timee__;
    if (async) {
        __timee__ = function() {
            var length = arguments.length,
            args = 1 <= length ? sliceArgs(arguments) : [];
            if (!index) index = length - 1;
            args.splice(index, 1, getInjector({
                msg: msg,
                noLog: noLog,
                watch: new HRStopwatch(),
                __timee__: __timee__
            }, args[index]));
            fn.apply(this, args);
        }
    } else {
        __timee__ = function() {
            var watch = new HRStopwatch(),
            result = fn.apply(this, arguments);
            elapsed = getTime(watch);
            __timee__.lastTime = elapsed;
            if (!options.noLog) log(msg + " " + elapsed + "ms");
            return result;
        }
    }
    return __timee__;
}

/*
* The function to inject as the callback to the async timee.
*/
function getInjector(options, cb) {
    return function() {
        var elapsed = getTime(options.watch);
        options.__timee__.lastTime = elapsed;
        if (!options.noLog) log(options.msg + " " + elapsed + "ms");
        cb.apply(this, arguments);
    }
}

/*
* Helper to convert a watcher into ms
*/
function getTime(watch) {
    return Math.floor(timeunit.nanoseconds.toMillis(watch.getTime()));
}

/*
* Warn the user nothing will happen because invalid args were passed
*/
function invalid(msg) {
    console.warn("timeMe: function won't be timed: " + msg);
    return function(){};
}

/*
* convert an arguments object into an array. We do it this way because
* mdn warns us not to use Array.prototype.slice.
*/
function sliceArgs(args) {
    var array = [];
    for (prop in args) {
        array.push(args[prop]);
    }
    return array;
}
