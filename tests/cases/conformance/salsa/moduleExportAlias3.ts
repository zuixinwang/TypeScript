// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

// from debug
var assert = module.exports = create.debug = create['default'] = create;
function create() {
    function d() {
        var curr = +new Date()
        d.curr = curr
    }
    return d
}
