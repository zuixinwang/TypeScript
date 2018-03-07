// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: defaults.js
exports.Umask = Umask
function Umask() {}
Object.defineProperty(exports, 'defaults', {
    get: function() {
        return 1
    }
})

// @Filename: use.js
var def = require('./defaults').defaults
var one = def
