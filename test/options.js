var expect = require('chai').expect
, timeMe = require('../')
, sinon  = require('sinon');

describe('options', function() {

    it('should not profile when in production mode', function () {
        // simulate production mode
        var NODE_ENV = 'production';
        timeMe.configure({enabled: 'production' !== NODE_ENV});
        var msg = 'baz()';
        var realBaz = function(x) {
            return x * 2;
        }
        var baz = timeMe.sync(msg, realBaz);
        expect(baz).to.equal(realBaz);
        expect(baz(2)).to.eq(4);
    });
});
