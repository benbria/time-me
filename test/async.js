var expect = require('chai').expect
, timeMe = require('../')
, sinon  = require('sinon')
, stubLogger = require('./utils').stubLogger;

describe('async', function() {

    beforeEach(function() {
        stubLogger.attach();
    });

    describe('argument acception', function() {

        it('(msg, cb)', function(done) {
            var msg = 'foo()';
            stubLogger.setMsg(msg);
            var t = Math.lOOms(),
            foo = timeMe.async(msg, function(cb) {
                setTimeout(function() {
                    cb(null, '25');
                }, t);
            });
            foo.call(null, function() {
                expect(foo.lastTime).to.be.at.least(t);
                done();
            });
        });

        it('({msg, index}, cb)', function(done) {
            var msg = 'bar()';
            stubLogger.setMsg(msg);
            var t = Math.lOOms(),
            bar = timeMe.async({msg: msg, index: 1}, function(x, cb, y) {
                setTimeout(function() {
                    cb(null, x + y);
                }, t);
            });
            bar.call(null, 1, function(err, result) {
                expect(result).to.eq(3);
                expect(bar.lastTime).to.be.at.least(t);
                done();
            }, 2);
        });

        it('({msg, index, noLog:1}, cb) - log not called', function(done) {
            var t = Math.lOOms(),
            spy = sinon.spy(),
            dontLogMe = timeMe.async({
                msg: 'dontLogMe()',
                noLog: 1,
            }, function(cb) {
                setTimeout(function() {
                    cb(null, 1);
                }, t);
            });
            timeMe.configure({log: spy});
            dontLogMe.call(null, function(err, result) {
                expect(spy.called).to.not.be.ok;
                expect(dontLogMe.lastTime).to.be.at.least(t);
                done();
            });
        });

        it('(cb)', function(done) {
            var msg = 'timeMe';
            stubLogger.setMsg(msg);
            var t = Math.lOOms(),
            baz = timeMe.async(function(cb) {
                setTimeout(function() {
                    cb(null, 1);
                }, t);
            });
            baz.call(null, function(err, result) {
                expect(baz.lastTime).to.be.at.least(t);
                done();
            });
        });

        it('({}, cb) - default log message', function(done) {
            var t = Math.lOOms();
            timeMe.configure({log: function(msg) {
                expect(/timeMe/.test(msg)).to.be.ok;
            }});
            var baz = timeMe.async({}, function(cb) {
                setTimeout(function() {
                    cb(null, 1);
                }, t);
            });
            baz.call(null, function(err, result) {
                expect(baz.lastTime).to.be.at.least(t);
                done();
            });
        });
    });

    describe('keep the calling context', function() {
        it('should keep the context of this', function(done) {
            var msg = 'foo()';
            stubLogger.setMsg(msg);
            var t = Math.lOOms(),
            foo = timeMe.async(msg, function(cb) {
                var self = this;
                expect(this.x).to.eq(1);
                setTimeout(function() {
                    cb.call(self, null, '25');
                }, t);
            });
            foo.call({x: 1}, function(err, result) {
                expect(this.x).to.eq(1);
                expect(foo.lastTime).to.be.at.least(t);
                done();
            });
        });
    });
})
