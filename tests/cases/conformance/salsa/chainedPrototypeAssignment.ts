// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

function A () {
    this.x = 1
}
/** @param {number} n */
A.prototype.y = A.prototype.z = function (n) {
    return n + 1
}
