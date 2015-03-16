# timeMe!

Time a block of code with minimal effort.

Sometimes you want to time a certain execution path to see its performance. So, you
add a bunch of time captures and log statements. Cleaning them up isn't so much fun.
It would also be nice to leave them in your code so they can be enabled at will. `timeMe`
is meant to help in that situation.

`timeMe` Will take some options and a function to wrap. It will return the wrapped function. Everytime that function is executed, its time will be recorded. You can choose
to print it out, or query the function for its `lastTime`.

# Usage

```javascript
var foo = timeMe.async('foo()', function(cb) {
    setTimeout(function() {
        cb(null, '25');
    }, 2000);
});
foo(function(err, result) {
    console.log(result);
});

// outputs: 25
// and
// foo() 2000ms
```
# Methods

## `timeMe.configure`

Globally configure the module on what log function to use. Defaults to
`console.log`

```javascript
timeMe.configure({
    log: function(msg) { // do logging here }
});
```

## `timeMe.async`

## `timeMe.sync`

Both methods can be called like so

```javascript
timeMe.async('a prefex', fn);
timeMe.async(fn); // default prefix of `timeMe`
timeMe.async({msg: 'foo()', index: 1}, fn); // options hash for more fine grained control
```

# Options

## `options.msg`

The prefix of the logged time

## `options.index`

(only for `timeMe.async`) You can specify the index of the callback in the wrapped
function. Defaults to the last argument.

## `options.noLog`

Turn logs on or off. Defaults to `false` (meaning logging on).

# `wrappedFn.lastTime`

Whenever a wrapped function is called, additionally to logging the time, a property will
be set on the function: `lastTime`. You can query the function for the property.


