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
    return function() {
        var length = arguments.length,
        args = 1 <= length ? [].slice.call(arguments, 0) : [];
        if (!index) index = length - 1;
        args.splice(index, 1, getInjector({
            msg: msg,
            noLog: noLog,
            watch: new HRStopwatch()
        }, args[index]));
        fn.apply(this, args);
    }
}

/*
* The function to inject as the callback to the timee.
*/
function getInjector(options, cb) {
    return function() {
        var elapsed = Math.round(timeunit.nanoseconds.toMillis(options.watch.getTime()));
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
