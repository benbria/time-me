var expect = require('chai').expect
, timeMe = require('../')
, sinon  = require('sinon')
, stubLogger = require('./utils').stubLogger;

describe('sync', function() {

    beforeEach(function() {
        stubLogger.attach();
    });

    it('should time a sync function', function() {
        var msg = 'baz()';
        stubLogger.setMsg(msg);
        baz = timeMe.sync(msg, function(x) {
            expect(typeof(x)).to.eq('number');
            var a = [];
            for(var i=0; i < 100000; i++) {
                a.push(i);
            }
            a.map(function(elem) {
                return "The number is " + elem;
            });
            return [a.join(","), x];
        });
        var result = baz.call(null, 1);
        expect(baz.lastTime).to.be.ok;
        expect(result[1]).to.eq(1);
    });
});
