/// <reference path="fourslash.ts" />

//// enum E {
////     A,
////     B,
//// }
//// declare const e: E
//// switch (e) {
////     case E.A:
////     case E./*1*/
//// }
//// declare const f: "A" | "B" | 2
//// switch (f) {
////     case "A":
////     case /*2*/
//// }

verify.completions(
    {
        marker: "1",
        isNewIdentifierLocation: false,
        includes: [
            {
                name: "B",
                sortText: completion.SortText.LocationPriority,
            }
        ],
        excludes: [
            "A",
        ],
    },
    {
        marker: "2",
        isNewIdentifierLocation: false,
        includes: [
            {
                name: "B",
                sortText: completion.SortText.LocationPriority,
            },
            {
                name: "2",
                sortText: completion.SortText.LocationPriority,
            }
        ],
        excludes: [
            "A"
        ],
    }
);