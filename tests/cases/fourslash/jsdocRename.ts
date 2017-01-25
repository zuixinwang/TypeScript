///<reference path="fourslash.ts" />

/////**
//// * @param [|foo|] Oof!
//// */
////function f([|foo|]: string) {}

const [r0, r1] = test.ranges();
verify.referencesOf(r0, [r0, r1]);


//todo: document highlights, rename
