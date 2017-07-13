//// [jsdocInTypescript2.ts]
// parse error (blocks grammar errors from checker)
function parse1(n: number=) { }
function parse2(n: number!) { }
function parse3(n: number?) { }


//// [jsdocInTypescript2.js]
// parse error (blocks grammar errors from checker)
function parse1(n) {
    if (n === void 0) { n = ; }
}
function parse2(n) {
    if (n === void 0) { n = !; }
}
function parse3(n) { }
