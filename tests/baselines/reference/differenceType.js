//// [differenceType.ts]
type A = { a };
type Ab = { a; b };
let nothing: A - 'a';
let none: Ab - 'a' | 'b';
let over: A - 'a' | 'b';
let under: Ab - 'a';
let partial: Ab - 'b' | 'd';
let empty: Ab - 'a' | 'b';
let nope: {} - string;
let nope2: Ab - string;
let nope3: {} - 'a' | 'b';

type Abcd = { a; b; c; d }

function f<T,U extends keyof Abcd, V>(t: T, u: U, v: V): T - U {
    let vsubtkey: V - keyof T;
    vsubtkey = vsubtkey;

    let tsubu: T - U;
    return tsubu;
}

const x = f<Ab, 'b' | 'd', A>({ a: 1, b: 2 }, 'b', { a: 3 })
const y = f({ a: 1, b: 2 }, 'b', { a: 3 })


//// [differenceType.js]
var nothing;
var none;
var over;
var under;
var partial;
var empty;
var nope;
var nope2;
var nope3;
function f(t, u, v) {
    var vsubtkey;
    vsubtkey = vsubtkey;
    var tsubu;
    return tsubu;
}
var x = f({ a: 1, b: 2 }, 'b', { a: 3 });
var y = f({ a: 1, b: 2 }, 'b', { a: 3 });
