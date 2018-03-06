// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: core.js
exports.load = load
exports.loaded = false
function load(conf) {
    if (conf) {
        exports.loaded = conf
    }
}
