// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js

// from graceful-fs
var fs = require('fs')
module.exports = patch(require('./fs.js'))
module.exports.close = fs.close = function (fs$close) {
}
function patch(fs) {
    fs.gracefulify = patch
}
