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
const x = 10;

//// [/src/project/b.ts]
const y = 10;

//// [/src/project/tsconfig.json]
{"compilerOptions":{"noEmitOnError":true,"declaration":true,"composite":true,"outFile":"../outFile.js"}}



Output::
/lib/tsc --p /src/project
exitCode:: ExitStatus.Success


//// [/src/outFile.d.ts]
declare const x = 10;
declare const y = 10;


//// [/src/outFile.js]
var x = 10;
var y = 10;


//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts"],"js":{"sections":[{"pos":0,"end":26,"kind":"text"}],"hash":"-4980187384-var x = 10;\r\nvar y = 10;\r\n"},"dts":{"sections":[{"pos":0,"end":46,"kind":"text"}],"hash":"-7944035420-declare const x = 10;\r\ndeclare const y = 10;\r\n"}},"program":{"fileNames":["./project/a.ts","./project/b.ts"],"fileInfos":["5029505981-const x = 10;","2026006654-const y = 10;"],"options":{"composite":true,"declaration":true,"outFile":"./outFile.js"},"outSignature":"-7944035420-declare const x = 10;\r\ndeclare const y = 10;\r\n","latestChangedDtsFile":"./outFile.d.ts"},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/outFile.js
----------------------------------------------------------------------
text: (0-26)
var x = 10;
var y = 10;

======================================================================
======================================================================
File:: /src/outFile.d.ts
----------------------------------------------------------------------
text: (0-46)
declare const x = 10;
declare const y = 10;

======================================================================

//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 26,
          "kind": "text"
        }
      ],
      "hash": "-4980187384-var x = 10;\r\nvar y = 10;\r\n"
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 46,
          "kind": "text"
        }
      ],
      "hash": "-7944035420-declare const x = 10;\r\ndeclare const y = 10;\r\n"
    }
  },
  "program": {
    "fileNames": [
      "./project/a.ts",
      "./project/b.ts"
    ],
    "fileInfos": {
      "./project/a.ts": "5029505981-const x = 10;",
      "./project/b.ts": "2026006654-const y = 10;"
    },
    "options": {
      "composite": true,
      "declaration": true,
      "outFile": "./outFile.js"
    },
    "outSignature": "-7944035420-declare const x = 10;\r\ndeclare const y = 10;\r\n",
    "latestChangedDtsFile": "./outFile.d.ts"
  },
  "version": "FakeTSVersion",
  "size": 676
}



Change:: error and enable declarationMap
Input::
//// [/src/project/a.ts]
const x: 20 = 10;



Output::
/lib/tsc --p /src/project --declarationMap
[96msrc/project/a.ts[0m:[93m1[0m:[93m7[0m - [91merror[0m[90m TS2322: [0mType '10' is not assignable to type '20'.

[7m1[0m const x: 20 = 10;
[7m [0m [91m      ~[0m


Found 1 error in src/project/a.ts[90m:1[0m

exitCode:: ExitStatus.DiagnosticsPresent_OutputsSkipped




Change:: fix error declarationMap
Input::
//// [/src/project/a.ts]
const x = 10;



Output::
/lib/tsc --p /src/project --declarationMap
exitCode:: ExitStatus.Success


//// [/src/outFile.d.ts.map]
{"version":3,"file":"outFile.d.ts","sourceRoot":"","sources":["project/a.ts","project/b.ts"],"names":[],"mappings":"AAAA,QAAA,MAAM,CAAC,KAAK,CAAC;ACAb,QAAA,MAAM,CAAC,KAAK,CAAC"}

//// [/src/outFile.js] file written with same contents
//// [/src/outFile.tsbuildinfo]
{"bundle":{"commonSourceDirectory":"./project","sourceFiles":["./project/a.ts","./project/b.ts"],"js":{"sections":[{"pos":0,"end":26,"kind":"text"}],"hash":"-4980187384-var x = 10;\r\nvar y = 10;\r\n"},"dts":{"sections":[{"pos":0,"end":46,"kind":"text"}],"mapHash":"12253058536-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\"],\"names\":[],\"mappings\":\"AAAA,QAAA,MAAM,CAAC,KAAK,CAAC;ACAb,QAAA,MAAM,CAAC,KAAK,CAAC\"}","hash":"-10321164067-declare const x = 10;\r\ndeclare const y = 10;\r\n//# sourceMappingURL=outFile.d.ts.map"}},"program":{"fileNames":["./project/a.ts","./project/b.ts"],"fileInfos":["5029505981-const x = 10;","2026006654-const y = 10;"],"options":{"composite":true,"declaration":true,"declarationMap":true,"outFile":"./outFile.js"},"outSignature":"-7944035420-declare const x = 10;\r\ndeclare const y = 10;\r\n","latestChangedDtsFile":"./outFile.d.ts"},"version":"FakeTSVersion"}

//// [/src/outFile.tsbuildinfo.baseline.txt] file written with same contents
//// [/src/outFile.tsbuildinfo.readable.baseline.txt]
{
  "bundle": {
    "commonSourceDirectory": "./project",
    "sourceFiles": [
      "./project/a.ts",
      "./project/b.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 26,
          "kind": "text"
        }
      ],
      "hash": "-4980187384-var x = 10;\r\nvar y = 10;\r\n"
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 46,
          "kind": "text"
        }
      ],
      "hash": "-10321164067-declare const x = 10;\r\ndeclare const y = 10;\r\n//# sourceMappingURL=outFile.d.ts.map",
      "mapHash": "12253058536-{\"version\":3,\"file\":\"outFile.d.ts\",\"sourceRoot\":\"\",\"sources\":[\"project/a.ts\",\"project/b.ts\"],\"names\":[],\"mappings\":\"AAAA,QAAA,MAAM,CAAC,KAAK,CAAC;ACAb,QAAA,MAAM,CAAC,KAAK,CAAC\"}"
    }
  },
  "program": {
    "fileNames": [
      "./project/a.ts",
      "./project/b.ts"
    ],
    "fileInfos": {
      "./project/a.ts": "5029505981-const x = 10;",
      "./project/b.ts": "2026006654-const y = 10;"
    },
    "options": {
      "composite": true,
      "declaration": true,
      "declarationMap": true,
      "outFile": "./outFile.js"
    },
    "outSignature": "-7944035420-declare const x = 10;\r\ndeclare const y = 10;\r\n",
    "latestChangedDtsFile": "./outFile.d.ts"
  },
  "version": "FakeTSVersion",
  "size": 960
}

