// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js

/** @param {boolean} b
 *  @return {number[]}
 */
function decide(b) {
    var p = b ? new Int32Array([1,2,3]) : [1,2,3]
    return p
}
