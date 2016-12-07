//// [tests/cases/compiler/exportDefaultConstEnum.ts] ////

//// [boolean.ts]
export default const enum Boolean { TRUE, FALSE, FILE_NOT_FOUND }

//// [user.ts]
import Boolean from "./boolean";
const b: Boolean = Boolean.FILE_NOT_FOUND;


//// [boolean.js]
"use strict";
//// [user.js]
"use strict";
var b = 2 /* FILE_NOT_FOUND */;
