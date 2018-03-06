// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: npm.js
// from npm -- wrapped in an IIFE
;(function () {
    var EE = require('events').EventEmitter
    var npm = module.exports = new EE()
    npm.config = function () {
        this.eventNames()
    }
    npm.commands = {}
})()

// @Filename: npm-cli.js

var npm = require('./npm')
npm.config()
npm.commands
