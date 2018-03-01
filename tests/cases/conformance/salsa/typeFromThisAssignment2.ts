// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

// TODO: Turn this into a fourslash test
function A() {
    this.x = [1,2,3]
}
A.prototype.m = function (cleanup = true) {
    this.x = [] // these assignments should have the same symbol as the rest
    this.x.push(1)
    if (cleanup) {
        this.x = [] // but currently are separated from the non-assignments, which have
        // the constructor's this-assignment as their declaration
    }
}
