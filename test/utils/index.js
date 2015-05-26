var expect = require('chai').expect
, timeMe = require('../../')
, ld = require('lodash');

/*
* Give a random time under 100
*/
Math.lOOms = function() {
    return parseInt(Math.random() * 100);
}

exports.stubLogger = function() {
	var msg = null;

	return {
		setMsg: function(newMsg) {
			msg = newMsg;
		},

		attach: function(options) {
			var logObject = options.logObject || false;
            timeMe.configure(ld.assign({}, options, {
                log: function(arg) {
                    var prefix, elapsed;
                    expect(arguments).to.have.length(1);
                    if (logObject === true) {
                        expect(arg).to.be.a('object');
                        prefix = arg.msg;
                        elapsed = arg.elapsed;
                    } else {
                        expect(arg).to.be.a('string');
                        var msgParts = arg.split(' ');
                        var timeStr = msgParts[msgParts.length - 1];
                        elapsed = parseInt(timeStr.slice(0, -2));
                        prefix = msgParts.slice(0, -1).join(' ');
                    }
                    expect(prefix).to.eql(msg);
                    expect(elapsed).to.be.a('number');
                    expect(elapsed).to.be.at.least(0);
                }
            }
            ));
		}
	};
}();