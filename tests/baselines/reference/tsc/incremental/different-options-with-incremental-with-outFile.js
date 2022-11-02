Input::
//// [/lib/lib.d.ts]
/// <reference no-default-lib="true"/>
interface Boolean {}
interface Function {}
interface CallableFunction {}
interface NewableFunction {}
interface IArguments {}
interface Number { toExponential: any; }
interface Object {}
interface RegExp {}
interface String { charAt: any; }
interface Array<T> { length: number; [n: number]: T; }
interface ReadonlyArray<T> {}
declare const console: { log(msg: any): void; };

//// [/src/project/a.ts]
export const a = 10;const aLocal = 10;

//// [/src/project/b.ts]
export const b = 10;const bLocal = 10;

//// [/src/project/c.ts]
import { a } from "./a";export const c = a;

//// [/src/project/d.ts]
import { b } from "./b";export const d = b;

//// [/src/project/tsconfig.json]
{"compilerOptions":{"incremental":true,"outFile":"../outFile.js","module":"amd"}}



Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});


//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":746,"kind":"text"}],"hash":"73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-746)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 746,
          "kind": "text"
        }
      ],
      "hash": "73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1065
}



Change:: with sourceMap
Input::


Output::
/lib/tsc --p /src/project --sourceMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","sourceMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});
//# sourceMappingURL=outFile.js.map

//// [/src/outFile.js.map]
{"version":3,"file":"outFile.js","sourceRoot":"","sources":["project/a.ts","project/b.ts","project/c.ts","project/d.ts"],"names":[],"mappings":";;;;IAAa,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAzB,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAD,QAAA,CAAC,GAAG,KAAC,CAAC;;;;;;ICAN,QAAA,CAAC,GAAG,KAAC,CAAC"}

//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":746,"kind":"text"}],"mapHash":"-9121204548-{\"version\":3,\"file\":\"outFile.js\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";;;;IAAa,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAzB,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAD,QAAA,CAAC,GAAG,KAAC,CAAC;;;;;;ICAN,QAAA,CAAC,GAAG,KAAC,CAAC\"}","hash":"-1376850883-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n//# sourceMappingURL=outFile.js.map"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 746,
          "kind": "text"
        }
      ],
      "hash": "-1376850883-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n//# sourceMappingURL=outFile.js.map",
      "mapHash": "-9121204548-{\"version\":3,\"file\":\"outFile.js\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";;;;IAAa,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAzB,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAD,QAAA,CAAC,GAAG,KAAC,CAAC;;;;;;ICAN,QAAA,CAAC,GAAG,KAAC,CAAC\"}"
    }
  },
  "version": "FakeTSVersion",
  "size": 1499
}



Change:: should re-emit only js so they dont contain sourcemap
Input::


Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});


//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":746,"kind":"text"}],"hash":"73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 746,
          "kind": "text"
        }
      ],
      "hash": "73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1065
}



Change:: with declaration, emit Dts and should not emit js (but can it update buildInfo)
Input::


Output::
/lib/tsc --p /src/project --declaration
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","declaration":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.d.ts]
declare module "a" {
    export const a = 10;
}
declare module "b" {
    export const b = 10;
}
declare module "c" {
    export const c = 10;
}
declare module "d" {
    export const d = 10;
}


//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":746,"kind":"text"}],"hash":"73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"},"dts":{"sections":[{"pos":0,"end":204,"kind":"text"}],"hash":"-10569306755-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-746)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================
======================================================================
File:: /src/outFile.d.ts
----------------------------------------------------------------------
text: (0-204)
declare module "a" {
    export const a = 10;
}
declare module "b" {
    export const b = 10;
}
declare module "c" {
    export const c = 10;
}
declare module "d" {
    export const d = 10;
}

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 746,
          "kind": "text"
        }
      ],
      "hash": "73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 204,
          "kind": "text"
        }
      ],
      "hash": "-10569306755-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1379
}



Change:: with declaration and declarationMap
Input::


Output::
/lib/tsc --p /src/project --declaration --declarationMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","declaration":true,"declarationMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.d.ts]
declare module "a" {
    export const a = 10;
}
declare module "b" {
    export const b = 10;
}
declare module "c" {
    export const c = 10;
}
declare module "d" {
    export const d = 10;
}
//# sourceMappingURL=outFile.d.ts.map

//// [/src/outFile.d.ts.map]
{"version":3,"file":"outFile.d.ts","sourceRoot":"","sources":["project/a.ts","project/b.ts","project/c.ts","project/d.ts"],"names":[],"mappings":";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC"}

//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":746,"kind":"text"}],"hash":"73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"},"dts":{"sections":[{"pos":0,"end":204,"kind":"text"}],"mapHash":"-4599397025-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC\"}","hash":"-9598548394-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n//# sourceMappingURL=outFile.d.ts.map"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 746,
          "kind": "text"
        }
      ],
      "hash": "73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 204,
          "kind": "text"
        }
      ],
      "hash": "-9598548394-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n//# sourceMappingURL=outFile.d.ts.map",
      "mapHash": "-4599397025-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC\"}"
    }
  },
  "version": "FakeTSVersion",
  "size": 1762
}



Change:: no-change-run
Input::


Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":746,"kind":"text"}],"hash":"73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-746)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 746,
          "kind": "text"
        }
      ],
      "hash": "73318240-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1065
}



Change:: local change
Input::
//// [/src/project/a.ts]
export const a = 10;const aLocal = 100;



Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});


//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"hash":"15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-747)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1069
}



Change:: with declaration and declarationMap
Input::


Output::
/lib/tsc --p /src/project --declaration --declarationMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","declaration":true,"declarationMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.d.ts] file written with same contents
//// [/src/outFile.d.ts.map] file written with same contents
//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"hash":"15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"},"dts":{"sections":[{"pos":0,"end":204,"kind":"text"}],"mapHash":"-4599397025-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC\"}","hash":"-9598548394-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n//# sourceMappingURL=outFile.d.ts.map"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-747)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================
======================================================================
File:: /src/outFile.d.ts
----------------------------------------------------------------------
text: (0-204)
declare module "a" {
    export const a = 10;
}
declare module "b" {
    export const b = 10;
}
declare module "c" {
    export const c = 10;
}
declare module "d" {
    export const d = 10;
}

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 204,
          "kind": "text"
        }
      ],
      "hash": "-9598548394-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n//# sourceMappingURL=outFile.d.ts.map",
      "mapHash": "-4599397025-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC\"}"
    }
  },
  "version": "FakeTSVersion",
  "size": 1766
}



Change:: no-change-run
Input::


Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"hash":"15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-747)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1069
}



Change:: with inlineSourceMap
Input::


Output::
/lib/tsc --p /src/project --inlineSourceMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","inlineSourceMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0RmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2plY3QvYS50cyIsInByb2plY3QvYi50cyIsInByb2plY3QvYy50cyIsInByb2plY3QvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQWEsUUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQUEsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDOzs7Ozs7SUNBMUIsUUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQUEsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7SUNBRCxRQUFBLENBQUMsR0FBRyxLQUFDLENBQUM7Ozs7OztJQ0FOLFFBQUEsQ0FBQyxHQUFHLEtBQUMsQ0FBQyJ9

//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"hash":"8055194958-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0RmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2plY3QvYS50cyIsInByb2plY3QvYi50cyIsInByb2plY3QvYy50cyIsInByb2plY3QvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQWEsUUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQUEsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDOzs7Ozs7SUNBMUIsUUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQUEsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7SUNBRCxRQUFBLENBQUMsR0FBRyxLQUFDLENBQUM7Ozs7OztJQ0FOLFFBQUEsQ0FBQyxHQUFHLEtBQUMsQ0FBQyJ9"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "8055194958-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0RmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2plY3QvYS50cyIsInByb2plY3QvYi50cyIsInByb2plY3QvYy50cyIsInByb2plY3QvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQWEsUUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQUEsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDOzs7Ozs7SUNBMUIsUUFBQSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQUEsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7SUNBRCxRQUFBLENBQUMsR0FBRyxLQUFDLENBQUM7Ozs7OztJQ0FOLFFBQUEsQ0FBQyxHQUFHLEtBQUMsQ0FBQyJ9"
    }
  },
  "version": "FakeTSVersion",
  "size": 1578
}



Change:: with sourceMap
Input::


Output::
/lib/tsc --p /src/project --sourceMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","sourceMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});
//# sourceMappingURL=outFile.js.map

//// [/src/outFile.js.map]
{"version":3,"file":"outFile.js","sourceRoot":"","sources":["project/a.ts","project/b.ts","project/c.ts","project/d.ts"],"names":[],"mappings":";;;;IAAa,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,GAAG,CAAC;;;;;;ICA1B,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAD,QAAA,CAAC,GAAG,KAAC,CAAC;;;;;;ICAN,QAAA,CAAC,GAAG,KAAC,CAAC"}

//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"mapHash":"-5541118281-{\"version\":3,\"file\":\"outFile.js\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";;;;IAAa,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,GAAG,CAAC;;;;;;ICA1B,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAD,QAAA,CAAC,GAAG,KAAC,CAAC;;;;;;ICAN,QAAA,CAAC,GAAG,KAAC,CAAC\"}","hash":"13909529709-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n//# sourceMappingURL=outFile.js.map"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "13909529709-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n//# sourceMappingURL=outFile.js.map",
      "mapHash": "-5541118281-{\"version\":3,\"file\":\"outFile.js\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";;;;IAAa,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,GAAG,CAAC;;;;;;ICA1B,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,IAAM,MAAM,GAAG,EAAE,CAAC;;;;;;ICAD,QAAA,CAAC,GAAG,KAAC,CAAC;;;;;;ICAN,QAAA,CAAC,GAAG,KAAC,CAAC\"}"
    }
  },
  "version": "FakeTSVersion",
  "size": 1500
}



Change:: emit js files
Input::


Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.js]
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});


//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"hash":"15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    }
  },
  "version": "FakeTSVersion",
  "size": 1069
}



Change:: with declaration and declarationMap (should this reemit or not?)
Input::


Output::
/lib/tsc --p /src/project --declaration --declarationMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","declaration":true,"declarationMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.d.ts] file written with same contents
//// [/src/outFile.d.ts.map] file written with same contents
//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts","./project/c.ts","./project/d.ts"],"js":{"sections":[{"pos":0,"end":747,"kind":"text"}],"hash":"15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"},"dts":{"sections":[{"pos":0,"end":204,"kind":"text"}],"mapHash":"-4599397025-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC\"}","hash":"-9598548394-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n//# sourceMappingURL=outFile.d.ts.map"}},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-747)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 100;
});
define("b", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.b = void 0;
    exports.b = 10;
    var bLocal = 10;
});
define("c", ["require", "exports", "a"], function (require, exports, a_1) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = a_1.a;
});
define("d", ["require", "exports", "b"], function (require, exports, b_1) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = b_1.b;
});

======================================================================
======================================================================
File:: /src/outFile.d.ts
----------------------------------------------------------------------
text: (0-204)
declare module "a" {
    export const a = 10;
}
declare module "b" {
    export const b = 10;
}
declare module "c" {
    export const c = 10;
}
declare module "d" {
    export const d = 10;
}

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts",
      "./project/c.ts",
      "./project/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 747,
          "kind": "text"
        }
      ],
      "hash": "15496582544-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 100;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 204,
          "kind": "text"
        }
      ],
      "hash": "-9598548394-declare module \"a\" {\r\n    export const a = 10;\r\n}\r\ndeclare module \"b\" {\r\n    export const b = 10;\r\n}\r\ndeclare module \"c\" {\r\n    export const c = 10;\r\n}\r\ndeclare module \"d\" {\r\n    export const d = 10;\r\n}\r\n//# sourceMappingURL=outFile.d.ts.map",
      "mapHash": "-4599397025-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\",\"project/c.ts\",\"project/d.ts\"],\"names\":[],\"mappings\":\";IAAA,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICApB,MAAM,CAAC,MAAM,CAAC,KAAK,CAAC;;;ICAI,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC;;;ICAnB,MAAM,CAAC,MAAM,CAAC,KAAI,CAAC\"}"
    }
  },
  "version": "FakeTSVersion",
  "size": 1766
}



Change:: with declaration and declarationMap, should not re-emit
Input::


Output::
/lib/tsc --p /src/project --declaration --declarationMap
exitCode:: ExitStatus.Success
Program root files: ["/src/project/a.ts","/src/project/b.ts","/src/project/c.ts","/src/project/d.ts"]
Program options: {"incremental":true,"outFile":"/src/outFile.js","module":2,"project":"/src/project","declaration":true,"declarationMap":true,"configFilePath":"/src/project/tsconfig.json"}
Program structureReused: Not
Program files::
/lib/lib.d.ts
/src/project/a.ts
/src/project/b.ts
/src/project/c.ts
/src/project/d.ts

No cached semantic diagnostics in the builder::

No shapes updated in the builder::


//// [/src/outFile.d.ts] file written with same contents
//// [/src/outFile.d.ts.map] file written with same contents
//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo] file written with same contents
//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt] file written with same contents
