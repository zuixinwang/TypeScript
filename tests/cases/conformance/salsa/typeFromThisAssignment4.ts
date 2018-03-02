// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// from webpack
function X() {}
X.prototype.apply = function() { }
var x = new X('unexpected')
x.apply()
