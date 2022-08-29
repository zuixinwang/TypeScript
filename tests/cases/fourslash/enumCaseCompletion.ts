/// <reference path="fourslash.ts" />

//// enum E {
////     A,
////     B,
//// }
//// declare const e: E
//// switch (e) {
////     case /*1*/
//// }


verify.completions(
    {
        marker: "1",
        isNewIdentifierLocation: false,
        includes: [
            {
                name: "E",
                isRecommended: true,
                sortText: completion.SortText.LocationPriority,
            }
        ],
    }
);