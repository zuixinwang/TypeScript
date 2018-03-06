// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: bluebird.js
var bluebird = require('./promise')()
module.exports = bluebird
// @Filename: promise.js
module.exports = function() {
    function Promise() {
    }
    require('./promisify')(Promise)
}
// @Filename: promisify.js
module.exports = function (Promise) {
    Promise.promisify = function () {
    }
}
