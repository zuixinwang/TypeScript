// TODO: This isn't the right test name at all -- it's an improvement to typedef
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// From Chrome dev tools
var Outer = {};

// @Filename: b.js
Outer.Inner = class {
}
/** @typedef {{name: string, value: string }} */
Outer.Inner.T;

/** @type {Outer.Inner.T} */
var local
inner.x
inner.m()

// @Filename:c.js
/** @type {Outer.Inner.T} */
var inner
inner.x
inner.m()
