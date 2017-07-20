// @allowJS: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @suppressOutputPathCheck: true

// @Filename: 0.js
/**
 * @param {Object} notSpecial
 * @param {string} unrelated - not actually related because it's not notSpecial.unrelated
 */
function normal(notSpecial) {
    notSpecial; // should just be 'any'
}
//normal(12);

/**
 * @param {Object} opts doc1
 * @param {string} opts.x doc2
 * @param {string=} opts.y doc3
 * @param {string} [opts.z] doc4
 * @param {string} [opts.w="hi"] doc5
 */
function foo(opts) {
    opts.x;
}

foo({x: 'abc'});

/**
 * @param {Object[]} opts
 * @param {string} opts[].anotherX
 * @param {string=} opts[].anotherY
 */
function foo1(/** @param opts bad idea theatre! */opts) {
    opts[0].anotherX;
}

foo1([{anotherX: "world"}]);

/**
 * @param {object} opts
 * @param {string} opts.x
 */
function foo2(opts) {
    opts.x;
}
foo2({x: 'abc'});

/**
 * @param {object[]} opts
 * @param {string} opts[].x
 * @param {string=} opts[].y
 * @param {string} [opts[].z]
 * @param {string} [opts[].w="hi"]
 */
function foo3(opts) {
    opts[0].x;
}

// TODO: Support multiple nesting levels?
// PROBABLY SO
