// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

/** @param {number} x */
function A(x) {
    if (!(this instanceof A)) {
        return new A(x)
    }
    this.x = x
}
var a = A(1)
var b = new A(2)
a.x === b.x
