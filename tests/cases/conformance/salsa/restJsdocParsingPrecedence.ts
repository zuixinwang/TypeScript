// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

/** @param {...string|Array} rest */
function f(...rest) {
    rest // should be (string | any[])[]
}

// from bcryptjs
/** @param {function(...[*])} callback */
function g(callback) {
}

/**
 * @type {!function(...number):string}
 * @inner
 */
var stringFromCharCode = String.fromCharCode;
