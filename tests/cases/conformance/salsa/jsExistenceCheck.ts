// @noEmit: true
// @allowJs: true
// @checkJs: true
// @strict: true
// @Filename: a.js
if (typeof define !== 'undefined' && define.amd) {
    define([], function() {
    })
}

exports.storage = 'undefined' != typeof chrome &&
    'undefined' != typeof chrome.storage ?
    chrome.storage.local :
    undefined;
