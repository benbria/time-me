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
