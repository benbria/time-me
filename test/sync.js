var expect = require('chai').expect
, timeMe = require('../')
, sinon  = require('sinon');

describe('sync', function() {
    it('should time a sync function', function() {
        baz = timeMe.sync('baz()', function(x) {
            var a = [];
            for(var i=0; i < 100000; i++) {
                a.push(i);
            }
            a.map(function(elem) {
                return "The number is " + elem;
            });
            return a.join(",");
        });
        var result = baz.call(null, 1);
        expect(baz.lastTime).to.be.ok;
    });
});
