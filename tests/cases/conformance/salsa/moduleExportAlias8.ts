// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: npm-log.js
// from npm
var EE = require('events').EventEmitter
var log = exports = module.exports = new EE()
log.useColor = function () {
    this.eventNames()
}
log.enableColors = function () {
    this.useColor()
}

// @Filename: npm-cli.js

var log = require('./npm-log')
log.enableColors()
log.useColor()
log.eventNames()
