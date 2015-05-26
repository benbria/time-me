{expect} = require 'chai'
timeMe   = require '../'
stubLogger = require('./utils').stubLogger

logObjectValues = [true, false]

logObjectValues.forEach (logObject) ->

    describe "async - coffee and streamline, logObject = #{logObject}", ->

        beforeEach ->
            stubLogger.attach {logObject}
            stubLogger.setMsg 'timeMe'

        describe 'coffee', ->
            it 'should work with coffee', (done) ->
                t = Math.lOOms()
                foo = timeMe.async (cb) ->
                    setTimeout ->
                        cb null, 2
                    , t
                foo (err, result) ->
                    expect(result).to.equal(2)
                    expect(foo.lastTime).to.be.at.least(t)
                    done()

        describe 'streamline', ->
            it 'should work with streamline', (_) ->
                t = Math.lOOms()
                foo = timeMe.async (a, b, c, _) ->
                    setTimeout _, t
                    return a + b + c

                res = foo 1, 2, 3, _
                expect(res).to.equal(6)
                expect(foo.lastTime).to.be.at.least(t)

            it 'should work with streamline cb in a different position than last', (_) ->
                t = Math.lOOms()
                foo = timeMe.async {index: 1}, (a, _, b, c) ->
                    setTimeout _, t
                    return a + b + c

                res = foo 1, _, 2, 3
                expect(res).to.equal(6)
                expect(foo.lastTime).to.be.at.least(t)
