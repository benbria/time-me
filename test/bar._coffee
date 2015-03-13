{expect} = require 'chai'
timeMe   = require '../'

describe 'async - coffee and streamline', ->
    describe 'coffee', ->
        it 'should work with coffee', (done) ->
            t = Math.lOOms()
            foo = timeMe.async (cb) ->
                setTimeout ->
                    cb null, 2
                , t
            foo (err, result) ->
                expect(result).to.equal(2)
                done()

    describe 'streamline', ->
        it 'should work with streamline', (_) ->
            t = Math.lOOms()
            foo = timeMe.async (a, b, c, _) ->
                setTimeout _, t
                return a + b + c

            res = foo 1, 2, 3, _
            expect(res).to.equal(6)
