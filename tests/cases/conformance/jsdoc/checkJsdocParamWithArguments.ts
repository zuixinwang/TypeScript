// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
/**
 * @param {string} first
 */
function concat(/*first, ..., last*/) {
    var s = ''
    for (var i = 0, l = arguments.length; i < l; i++) {
        s += arguments[i]
    }
    return s
}
