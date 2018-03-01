// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

// from assert
var assert = module.exports = ok;
function fail() {
}
assert.fail = fail;
function ok() {

}
assert.ok = ok;

assert.AssertionError = function (actual, expect) {
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
}
