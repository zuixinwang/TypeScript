// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js

// from enhanced-resolve
function T() {
    this.plugins = {}
}
T.prototype.plugin = function (name, f) {
    this.plugins[name] = f
}
function R(fs) {
    T.call(this)
    this.fs = fs
}
R.prototype = Object.create(T.prototype) // should create an extends: R extends T
R.prototype.resolve = function resolve(name) {
    this.plugin(name, p => p)
}
