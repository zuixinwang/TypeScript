Input::
//// [/user/username/projects/myproject/file1.ts]
export const c = 30;

//// [/user/username/projects/myproject/src/file2.ts]
import {c} from "file1"; export const d = 30;

//// [/a/lib/lib.d.ts]
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

//// [/user/username/projects/myproject/tsconfig.json]
{"compilerOptions":{"module":"amd","declaration":true,"declarationDir":"decls"}}


/a/lib/tsc.js -w -p /user/username/projects/myproject/tsconfig.json
Output::
>> Screen clear
[[90m12:00:25 AM[0m] Starting compilation in watch mode...

[[90m12:00:40 AM[0m] Found 0 errors. Watching for file changes.



Program root files: ["/user/username/projects/myproject/file1.ts","/user/username/projects/myproject/src/file2.ts"]
Program options: {"module":2,"declaration":true,"declarationDir":"/user/username/projects/myproject/decls","watch":true,"project":"/user/username/projects/myproject/tsconfig.json","configFilePath":"/user/username/projects/myproject/tsconfig.json"}
Program structureReused: Not
Program files::
/a/lib/lib.d.ts
/user/username/projects/myproject/file1.ts
/user/username/projects/myproject/src/file2.ts

Semantic diagnostics in builder refreshed for::
/a/lib/lib.d.ts
/user/username/projects/myproject/file1.ts
/user/username/projects/myproject/src/file2.ts

Shape signatures in builder refreshed for::
/a/lib/lib.d.ts (used version)
/user/username/projects/myproject/file1.ts (computed .d.ts during emit)
/user/username/projects/myproject/src/file2.ts (computed .d.ts during emit)

PolledWatches::
/user/username/projects/myproject/node_modules/@types:
  {"pollingInterval":500}

FsWatches::
/user/username/projects/myproject/tsconfig.json:
  {}
/user/username/projects/myproject/file1.ts:
  {}
/user/username/projects/myproject/src/file2.ts:
  {}
/a/lib/lib.d.ts:
  {}

FsWatchesRecursive::
/user/username/projects/myproject/src:
  {}
/user/username/projects/myproject:
  {}

exitCode:: ExitStatus.undefined

//// [/user/username/projects/myproject/file1.js]
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.c = void 0;
    exports.c = 30;
});


//// [/user/username/projects/myproject/decls/file1.d.ts]
export declare const c = 30;


//// [/user/username/projects/myproject/src/file2.js]
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.d = void 0;
    exports.d = 30;
});


//// [/user/username/projects/myproject/decls/src/file2.d.ts]
export declare const d = 30;



Change:: No change

Input::

Output::

PolledWatches::
/user/username/projects/myproject/node_modules/@types:
  {"pollingInterval":500}

FsWatches::
/user/username/projects/myproject/tsconfig.json:
  {}
/user/username/projects/myproject/file1.ts:
  {}
/user/username/projects/myproject/src/file2.ts:
  {}
/a/lib/lib.d.ts:
  {}

FsWatchesRecursive::
/user/username/projects/myproject/src:
  {}
/user/username/projects/myproject:
  {}

exitCode:: ExitStatus.undefined


Change:: Add new file

Input::
//// [/user/username/projects/myproject/src/file3.ts]
export const y = 10;


Output::
>> Screen clear
[[90m12:00:43 AM[0m] File change detected. Starting incremental compilation...

[[90m12:00:48 AM[0m] Found 0 errors. Watching for file changes.



Program root files: ["/user/username/projects/myproject/file1.ts","/user/username/projects/myproject/src/file2.ts","/user/username/projects/myproject/src/file3.ts"]
Program options: {"module":2,"declaration":true,"declarationDir":"/user/username/projects/myproject/decls","watch":true,"project":"/user/username/projects/myproject/tsconfig.json","configFilePath":"/user/username/projects/myproject/tsconfig.json"}
Program structureReused: Not
Program files::
/a/lib/lib.d.ts
/user/username/projects/myproject/file1.ts
/user/username/projects/myproject/src/file2.ts
/user/username/projects/myproject/src/file3.ts

Semantic diagnostics in builder refreshed for::
/user/username/projects/myproject/src/file3.ts

Shape signatures in builder refreshed for::
/user/username/projects/myproject/src/file3.ts (computed .d.ts)

PolledWatches::
/user/username/projects/myproject/node_modules/@types:
  {"pollingInterval":500}

FsWatches::
/user/username/projects/myproject/tsconfig.json:
  {}
/user/username/projects/myproject/file1.ts:
  {}
/user/username/projects/myproject/src/file2.ts:
  {}
/a/lib/lib.d.ts:
  {}
/user/username/projects/myproject/src/file3.ts:
  {}

FsWatchesRecursive::
/user/username/projects/myproject/src:
  {}
/user/username/projects/myproject:
  {}

exitCode:: ExitStatus.undefined

//// [/user/username/projects/myproject/src/file3.js]
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.y = void 0;
    exports.y = 10;
});


//// [/user/username/projects/myproject/decls/src/file3.d.ts]
export declare const y = 10;



Change:: No change

Input::

Output::

PolledWatches::
/user/username/projects/myproject/node_modules/@types:
  {"pollingInterval":500}

FsWatches::
/user/username/projects/myproject/tsconfig.json:
  {}
/user/username/projects/myproject/file1.ts:
  {}
/user/username/projects/myproject/src/file2.ts:
  {}
/a/lib/lib.d.ts:
  {}
/user/username/projects/myproject/src/file3.ts:
  {}

FsWatchesRecursive::
/user/username/projects/myproject/src:
  {}
/user/username/projects/myproject:
  {}

exitCode:: ExitStatus.undefined

