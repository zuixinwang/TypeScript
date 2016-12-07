//// [tests/cases/compiler/exportDefaultInterface.ts] ////

//// [interface.ts]
export default interface I {
    x: number;
}

//// [user.ts]
import I from "./interface";
const x: I = { x: 0 };


//// [interface.js]
"use strict";
//// [user.js]
"use strict";
var x = { x: 0 };
