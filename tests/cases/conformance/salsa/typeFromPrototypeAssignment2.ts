// @strict: true
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js

// from acorn
function Parser() {
    /** @type {number} */
    this.x = 1
}
var pp = Parser.prototype
pp.m = function () {
    return this.x
}
