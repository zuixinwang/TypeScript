// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// From Chrome dev tools (but simpler)

/** @typedef {Array | { length: number}} */
var ArrayLikeLike;
ArrayLikeLike; // should be undefined

var Ns = {};
/** @typedef {string & boolean & number & undefined} */
Ns.Prim;

/** @type {ArrayLikeLike} */
var a;
/** @type {Ns.Prim} */
var impossible;

Ns.Prim; // should be undefined;



/** @typedef {string & number} Apocalypt.io.us */

/** @type {Apocalypt.io.us} */
var four;

