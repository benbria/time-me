var HRStopwatch = require('hrstopwatch')
, timeunit = require ('timeunit')
, intercept = require('intercept')
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
    return timeMe('async', options, fn);
}

exports.sync = function(options, fn) {
    return timeMe('sync', options, fn);
}

exports.promise = function(options, fn) {
    return timeMe('promise', options, fn);
}

function logMsg(options, msg, elapsed) {
    if (!options.noLog) {
        log(msg + " " + elapsed + "ms", {prefix: msg, elapsed: elapsed});
    }
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
function timeMe(mode, options, fn) {
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
    if ('async' === mode) {
        var watch;
        __timee__ = intercept.async(fn, {index: index}, function() {
            var args = sliceArgs(arguments);
            watch = new HRStopwatch();
            return args[0].apply(this, sliceArgs(args, 1));
        }, function() {
            var args = sliceArgs(arguments);
            var elapsed = getTime(watch);
            __timee__.lastTime = elapsed;
            logMsg({noLog: noLog}, msg, elapsed);
            args[0].apply(this, sliceArgs(args, 1));
        });
    } else if ('sync' === mode) {
        __timee__ = intercept.sync(fn, function() {
            var watch = new HRStopwatch();
            var result = fn.apply(this, arguments);
            elapsed = getTime(watch);
            __timee__.lastTime = elapsed;
            logMsg(options, msg, elapsed);
            return result;
        });
    } else if ('promise' === mode) {
        __timee__ = intercept.sync(fn, function() {
            var watch = new HRStopwatch();
            var p = fn.apply(this, arguments);
            p.then(function(result) {
                elapsed = getTime(watch);
                __timee__.lastTime = elapsed;
                logMsg(options, msg, elapsed);
                return result;
            });
            return p;
        });
    } else {
        throw new Error('Unknown mode: ' + mode);
    }
    return __timee__;
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
function sliceArgs(args, start) {
    var array = [];
    for (prop in args) {
        if (!start || +prop >= start) array.push(args[prop]);
    }
    return array;
}
