// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
/**
 * @param {string} first
 * @param {string} second
 * @param {...any} [options]
 */
function lazy(...args) {
    return args
}
