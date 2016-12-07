//// [tests/cases/compiler/exportDefaultEnum.ts] ////

//// [boolean.ts]
export default enum Boolean { TRUE, FALSE, FILE_NOT_FOUND }

//// [user.ts]
import Boolean from "./boolean";
const b: Boolean = Boolean.FILE_NOT_FOUND;


//// [boolean.js]
"use strict";
var Boolean;
(function (Boolean) {
    Boolean[Boolean["TRUE"] = 0] = "TRUE";
    Boolean[Boolean["FALSE"] = 1] = "FALSE";
    Boolean[Boolean["FILE_NOT_FOUND"] = 2] = "FILE_NOT_FOUND";
})(Boolean = exports.Boolean || (exports.Boolean = {}));
//// [user.js]
"use strict";
var boolean_1 = require("./boolean");
var b = boolean_1["default"].FILE_NOT_FOUND;
