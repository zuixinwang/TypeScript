2:: emit js files
*** Needs explanation
File: /src/project1/outfile.js
CleanBuild:
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
    var aa = 10;
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

IncrementalBuild:

TsBuild info text without affectedFilesPendingEmit:: /src/project1/outfile.tsbuildinfo.readable.baseline.txt::
CleanBuild:
{
  "bundle": {
    "commonSourceDirectory": "./src",
    "sourceFiles": [
      "./src/a.ts",
      "./src/b.ts",
      "./src/c.ts",
      "./src/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 764,
          "kind": "text"
        }
      ],
      "hash": "15340862075-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n    var aa = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
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
  "version": "FakeTSVersion"
}
IncrementalBuild:
{
  "bundle": {
    "commonSourceDirectory": "./src",
    "sourceFiles": [
      "./src/a.ts",
      "./src/b.ts",
      "./src/c.ts",
      "./src/d.ts"
    ],
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
  "version": "FakeTSVersion"
}
File: /src/project1/outfile.tsbuildinfo.baseline.txt
CleanBuild:
======================================================================
File:: /src/project1/outFile.js
----------------------------------------------------------------------
text: (0-764)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
    var aa = 10;
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
File:: /src/project1/outFile.d.ts
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
IncrementalBuild:
======================================================================
File:: /src/project1/outFile.d.ts
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
4:: no change run with js emit
*** Needs explanation
File: /src/project1/outfile.js
CleanBuild:
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
    var aa = 10;
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

IncrementalBuild:

TsBuild info text without affectedFilesPendingEmit:: /src/project1/outfile.tsbuildinfo.readable.baseline.txt::
CleanBuild:
{
  "bundle": {
    "commonSourceDirectory": "./src",
    "sourceFiles": [
      "./src/a.ts",
      "./src/b.ts",
      "./src/c.ts",
      "./src/d.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 764,
          "kind": "text"
        }
      ],
      "hash": "15340862075-define(\"a\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.a = void 0;\r\n    exports.a = 10;\r\n    var aLocal = 10;\r\n    var aa = 10;\r\n});\r\ndefine(\"b\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.b = void 0;\r\n    exports.b = 10;\r\n    var bLocal = 10;\r\n});\r\ndefine(\"c\", [\"require\", \"exports\", \"a\"], function (require, exports, a_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.c = void 0;\r\n    exports.c = a_1.a;\r\n});\r\ndefine(\"d\", [\"require\", \"exports\", \"b\"], function (require, exports, b_1) {\r\n    \"use strict\";\r\n    exports.__esModule = true;\r\n    exports.d = void 0;\r\n    exports.d = b_1.b;\r\n});\r\n"
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
  "version": "FakeTSVersion"
}
IncrementalBuild:
{
  "bundle": {
    "commonSourceDirectory": "./src",
    "sourceFiles": [
      "./src/a.ts",
      "./src/b.ts",
      "./src/c.ts",
      "./src/d.ts"
    ],
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
  "version": "FakeTSVersion"
}
File: /src/project1/outfile.tsbuildinfo.baseline.txt
CleanBuild:
======================================================================
File:: /src/project1/outFile.js
----------------------------------------------------------------------
text: (0-764)
define("a", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    exports.a = 10;
    var aLocal = 10;
    var aa = 10;
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
File:: /src/project1/outFile.d.ts
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
IncrementalBuild:
======================================================================
File:: /src/project1/outFile.d.ts
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