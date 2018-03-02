// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// from webpack
function Exp() {
}
Exp.prototype.is = function() {
    return !!this.x
}
Exp.prototype.set = function() {
    this.x = 1 // Isn't this supposed to add a property x to Exp?
}
