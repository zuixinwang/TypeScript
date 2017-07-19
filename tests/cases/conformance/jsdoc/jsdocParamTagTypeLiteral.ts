// @allowJS: true
// @checkJs: true
// @noEmit: true
// @strict: true
// @suppressOutputPathCheck: true

// @Filename: 0.js
/**
 * @param {Object} notSpecial
 */
function normal(notSpecial) {
    normal; // should just be 'any'
}
normal(12);

/**
 * @param {Object} opts
 * @param {string} opts.x
 * @param {string=} opts.y
 * @param {string} [opts.z]
 * @param {string} [opts.w="hi"]
 */
function foo(opts) {
    opts.x;
}

foo({x: 'abc'});

/*
 * @param {Object[]} opts
 * @param {string} opts[].anotherX
 * @param {string=} opts[].anotherY
 */
//function foo1(/** @param opts bad idea theatre! */opts) {
    //opts[0].anotherX;
//}

//foo1([{anotherX: "world"}]);

/*
 * @param {object} opts
 * @param {string} x
 */
//function foo2(opts) {
    //opts.x;
//}
//foo2({x: 'abc'});

/*
 * @param {object[]} opts
 * @param {string} opts[].x
 * @param {string=} opts[].y
 * @param {string} [opts[].z]
 * @param {string} [opts[].w="hi"]
 */
//function foo3(opts) {
    //opts.x;
//}

// TODO: Support multiple nesting levels?
// PROBABLY SO
