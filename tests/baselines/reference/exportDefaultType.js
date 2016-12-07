//// [tests/cases/compiler/exportDefaultType.ts] ////

//// [a.ts]
export default type T = number;

//// [b.ts]
import T from "./a";
const x: T = 0;


//// [a.js]
"use strict";
//// [b.js]
"use strict";
var x = 0;
