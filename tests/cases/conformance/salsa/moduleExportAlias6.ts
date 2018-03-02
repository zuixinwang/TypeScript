// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: ugly.js
// from uglify-js
var FILES = exports.FILES = [
    "./a.js",
    "./b.js"
]
var ugly = exports
ugly.ast.warn = function (txt) {
    return "WARN: " + txt
}
exports.other = function(files) {
}

// @Filename: use.js
var ugly = require('./ugly')
ugly.ast.warn('oh no')
ugly.other(ugly.FILES)
