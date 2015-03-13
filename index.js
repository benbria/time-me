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

/*
* Wrap an async function so that its total execution time
* can be recorded.
*
* `options.msg` {String}    - Prefix to the timing message
* `options.index` {Integer} - (optional) the index of the callback argument
*  in the wrapped func based at 0. Defaults to the last argument.
* `fn` {Function}   - the function to wrap and time
*/
exports.async = function(options, fn) {
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
    var index = options.index,
    noLog = !!options.noLog;
    msg = options.msg || msg;
    var __timee__ = function() {
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
    return __timee__;
}

/*
* The function to inject as the callback to the timee.
*/
function getInjector(options, cb) {
    return function() {
        var elapsed = Math.round(timeunit.nanoseconds.toMillis(options.watch.getTime()));
        options.__timee__.lastTime = elapsed;
        if (!options.noLog) log(options.msg + " " + elapsed + "ms");
        cb.apply(this, arguments);
    }
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
