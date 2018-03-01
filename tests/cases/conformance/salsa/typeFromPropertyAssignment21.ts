// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js
// from minimatch
module.exports = minimatch
// should be fine to assign too early
minimatch.M = M

function minimatch() {
}
// should be fine to assign too early
M.defaults = function (def) {
    return def
}
function M() {
}
M.prototype.m = function () {
}
