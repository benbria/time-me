var expect = require('chai').expect
, timeMe = require('../')
, sinon  = require('sinon')
, stubLogger = require('./utils').stubLogger;

// add Promise to our environment if it isn't available.
global.Promise || require('es6-promise');

describe.only('sync', function() {

    beforeEach(function() {
        stubLogger.attach();
    });

    it('should time a promise function', function(done) {
        var msg = 'baz()';
        stubLogger.setMsg(msg);
        var baz = timeMe.promise(msg, function(x) {
            return new Promise(function(res, rej) {
                setTimeout(function() {
                    res(25);
                }, 70);
            });
        });
        var p = baz.call(null, 1);
        p.then(function(result) {
            expect(result).to.eq(25);
            expect(baz.lastTime).to.be.at.least(70);
            done();
        });
    });
});
