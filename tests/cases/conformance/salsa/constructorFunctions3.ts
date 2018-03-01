// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: semver.js
exports = module.exports = C
exports.f = n => n + 1
// exports.C = C // not necessary to make my point I think
function C() {
    this.p = 1
}
// @filename: index.js
const C = require("./semver")
var two = C.f(1)
var c = new C
