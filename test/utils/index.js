var expect = require('chai').expect
, timeMe = require('../../')
, ld = require('lodash');

/*
* Give a random time under 100
*/
Math.lOOms = function() {
    return parseInt(Math.random() * 100);
}

/*
* The `attach()` method of the returned object
* configures the time-me module to use a stub
* logging function that validates the arguments
* it is called on.
*
* Aside from checking the types and structures
* of its arguments, the stub logger also ensures
* that the correct prefix is being logged.
* For this to work, it must know what prefix is expected.
* The client must set this using the `setMsg()` method.
*/
exports.stubLogger = function() {
    var msg = null;

    return {
        setMsg: function(newMsg) {
            msg = newMsg;
        },

        attach: function(options) {
            timeMe.configure(ld.assign({}, options, {
                log: function(str, obj) {
                    var prefix = [], elapsed = [];
                    expect(arguments).to.have.length(2);

                    expect(obj).to.be.a('object');
                    prefix.push(obj.prefix);
                    elapsed.push(obj.elapsed);

                    expect(str).to.be.a('string');
                    var msgParts = str.split(' ');
                    var timeStr = msgParts[msgParts.length - 1];
                    elapsed.push(parseInt(timeStr.slice(0, -2)));
                    prefix.push(msgParts.slice(0, -1).join(' '));

                    for(var i = 0; i < arguments.length; ++i) {
                        expect(prefix[i]).to.eql(msg);
                        expect(elapsed[i]).to.be.a('number');
                        expect(elapsed[i]).to.be.at.least(0);
                    }
                }
            }
            ));
        }
    };
}();
