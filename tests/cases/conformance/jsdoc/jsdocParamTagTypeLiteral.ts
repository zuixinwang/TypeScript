// @allowJS: true
// @checkJs: true
// @noEmit: true
// @suppressOutputPathCheck: true

// @Filename: 0.js
/**
 * @param {Object} opts
 * @param {string} x
 * @param {string=} y
 * @param {string} [z]
 * @param {string} [w="hi"]
 */
function foo(opts) {
    opts.x;
}

foo({x: 'abc'});

/**
 * @param {Object} opts
 * @param anotherX {string}
 * @param anotherY {string=}
 */
function foo1(opts) {
    opts.anotherX;
}

foo1({anotherX: "world"});

/**
 * @param {object} opts
 * @param {string} x
 * @param {string=} y
 * @param {string} [z]
 * @param {string} [w="hi"]
 */
function foo2(opts) {
    opts.x;
}
foo2({x: 'abc'});
