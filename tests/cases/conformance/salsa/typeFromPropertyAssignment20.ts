// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// from axios
function A(x) {
    this.x = x
}
function createInstance(defaultConfig) {
    return new A(defaultConfig.x);
}
var a = createInstance({ x: 1 })
a.all = function () { }
