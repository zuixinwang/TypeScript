// @lib: dom,es5,es6
// @target: es6
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// only for node -- not sure how to signal this
global.x = 1
window.y = 2
this.z = 3

var n = x + y + z
