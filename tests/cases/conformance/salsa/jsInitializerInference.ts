// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

function f(a = null) {
    a // should still be any; null | undefined is a nonsensical type
}
f('hi') // should be ok

// from async
var q = {
    drain: null,
    process() {
        if (q.drain) {
            q.drain()
        }
    }
}

// from axios
function A() {
    this.handlers = []
}

A.prototype.add = function (h) {
    this.handlers.push(h)
}
