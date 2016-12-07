/// <reference path='fourslash.ts'/>

////type Options = "Option 1" | "Option 2" | "Option 3" | string;
////var x: Options = "/*1*/Option 3";
////
////function f(a: Options) { };
////f("/*2*/

goTo.marker('1');
verify.completionList(["Option 1", "Option 2", "Option 3"]);

goTo.marker('2');
verify.completionList(["Option 1", "Option 2", "Option 3"]);
