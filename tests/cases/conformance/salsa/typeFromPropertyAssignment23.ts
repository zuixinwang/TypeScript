// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: bugs.js
// from npm

// shouldn't get duplicate identifier here
bugs.completion = function (opts, cb) {
    cb()
}
function bugs (args, cb) {
}
