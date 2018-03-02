// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: webpack.js
// from webpack
function webpack(options, callback) {
    callback(options)
}
function exportPlugins(namespace,plugins) {
    // [metaprogramming elided]
}
exports = module.exports = webpack
exportPlugins(exports.optimize = {}, ["plugin1"])
