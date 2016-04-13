var expect = require('chai').expect
, timeMe = require('../')
, sinon  = require('sinon')
, stubLogger = require('./utils').stubLogger;

// add Promise to our environment if it isn't available.
global.Promise || require('es6-promise');

describe('promise', function() {

    beforeEach(function() {
        stubLogger.attach();
    });

    it('should time a promise function', function(done) {
        var msg = 'baz()';
        stubLogger.setMsg(msg);
        var t = Math.lOOms();
        var baz = timeMe.promise(msg, function(x) {
            expect(typeof(x)).to.eq('number');
            return new Promise(function(res, rej) {
                setTimeout(function() {
                    res(x);
                }, t);
            });
        });
        var p = baz.call(null, 1);
        p.then(function(result) {
            expect(result).to.eq(1);
            expect(baz.lastTime + 1).to.be.at.least(t);
            done();
        });
    });
});
