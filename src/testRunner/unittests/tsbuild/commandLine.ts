namespace ts {
    describe("unittests:: tsbuild:: commandLine::", () => {
        describe("different options::", () => {
            function withOptionChange(subScenario: string, ...options: readonly string[]): TestTscEdit {
                return {
                    subScenario,
                    modifyFs: noop,
                    commandLineArgs: ["--b", "/src/project", "--verbose", ...options]
                };
            }
            function noChangeWithSubscenario(subScenario: string): TestTscEdit {
                return { ...noChangeRun, subScenario };
            }
            function withOptionChangeAndDiscrepancyExplanation(subScenario: string, option: string): TestTscEdit {
                return {
                    ...withOptionChange(subScenario, option),
                    discrepancyExplanation: () => [
                        `Clean build tsbuildinfo will have compilerOptions with composite and ${option.replace(/\-/g, "")}`,
                        `Incremental build will detect that it doesnt need to rebuild so tsbuild info is from before which has option composite only`,
                    ]
                };
            }
            function withOptionChangeAndExportExplanation(subScenario: string, ...options: readonly string[]): TestTscEdit {
                return {
                    ...withOptionChange(subScenario, ...options),
                    discrepancyExplanation: noChangeWithExportsDiscrepancyRun.discrepancyExplanation,
                };
            }
            function localChange(): TestTscEdit {
                return {
                    subScenario: "local change",
                    modifyFs: fs => replaceText(fs, "/src/project/a.ts", "Local = 1", "Local = 10"),
                };
            }
            function fs(options: CompilerOptions) {
                return loadProjectFromFiles({
                    "/src/project/tsconfig.json": JSON.stringify({
                        compilerOptions: compilerOptionsToConfigJson(options),
                    }),
                    "/src/project/a.ts": `export const a = 10;const aLocal = 10;`,
                    "/src/project/b.ts": `export const b = 10;const bLocal = 10;`,
                    "/src/project/c.ts": `import { a } from "./a";export const c = a;`,
                    "/src/project/d.ts": `import { b } from "./b";export const d = b;`,
                });
            }
            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "different options",
                fs: () => fs({ composite: true }),
                commandLineArgs: ["--b", "/src/project", "--verbose"],
                edits: [
                    withOptionChange("with sourceMap", "--sourceMap"),
                    noChangeWithSubscenario("should re-emit only js so they dont contain sourcemap"),
                    withOptionChangeAndDiscrepancyExplanation("with declaration should not emit anything", "--declaration"),
                    noChangeRun,
                    withOptionChange("with declaration and declarationMap", "--declaration", "--declarationMap"),
                    noChangeWithSubscenario("should re-emit only dts so they dont contain sourcemap"),
                    withOptionChangeAndDiscrepancyExplanation("with emitDeclarationOnly should not emit anything", "--emitDeclarationOnly"),
                    noChangeRun,
                    localChange(),
                    withOptionChangeAndDiscrepancyExplanation("with declaration should not emit anything", "--declaration"),
                    withOptionChange("with inlineSourceMap", "--inlineSourceMap"),
                    withOptionChange("with sourceMap", "--sourceMap"),
                ],
                baselinePrograms: true,
            });
            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "different options with outFile",
                fs: () => fs({ composite: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project", "--verbose"],
                edits: [
                    withOptionChange("with sourceMap", "--sourceMap"),
                    noChangeWithSubscenario("should re-emit only js (but is it possible to update buildinfo?) so they dont contain sourcemap"),
                    withOptionChange("with declaration should not emit anything", "--declaration"),
                    noChangeRun,
                    withOptionChange("with declaration and declarationMap", "--declaration", "--declarationMap"),
                    noChangeWithSubscenario("should re-emit only dts (but is it possible to update buildinfo?) so they dont contain sourcemap"),
                    withOptionChange("with emitDeclarationOnly should not emit anything", "--emitDeclarationOnly"),
                    noChangeRun,
                    localChange(),
                    withOptionChange("with declaration should not emit anything", "--declaration"),
                    withOptionChange("with inlineSourceMap", "--inlineSourceMap"),
                    withOptionChange("with sourceMap", "--sourceMap"),
                ],
                baselinePrograms: true,
            });
            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "different options with incremental",
                fs: () => fs({ incremental: true }),
                commandLineArgs: ["--b", "/src/project", "--verbose"],
                edits: [
                    withOptionChangeAndExportExplanation("with sourceMap", "--sourceMap"),
                    withOptionChangeAndExportExplanation("should re-emit only js so they dont contain sourcemap"),
                    withOptionChange("with declaration, emit Dts and should not emit js", "--declaration"),
                    withOptionChange("with declaration and declarationMap", "--declaration", "--declarationMap"),
                    {
                        ...noChangeRun,
                        discrepancyExplanation: () => [
                            `Clean build tsbuildinfo will have compilerOptions {}`,
                            `Incremental build will detect that it doesnt need to rebuild so tsbuild info is from before which has option declaration and declarationMap`,
                        ],
                    },
                    localChange(),
                    withOptionChange("with declaration and declarationMap", "--declaration", "--declarationMap"),
                    {
                        ...noChangeRun,
                        discrepancyExplanation: () => [
                            `Clean build tsbuildinfo will have compilerOptions {}`,
                            `Incremental build will detect that it doesnt need to rebuild so tsbuild info is from before which has option declaration and declarationMap`,
                        ],
                    },
                    withOptionChange("with inlineSourceMap", "--inlineSourceMap"),
                    withOptionChange("with sourceMap", "--sourceMap"),
                    noChangeWithSubscenario("emit js files"),
                    withOptionChange("with declaration and declarationMap (should this reemit or not?)", "--declaration", "--declarationMap"),
                    withOptionChange("with declaration and declarationMap, should not re-emit", "--declaration", "--declarationMap"),
                ],
                baselinePrograms: true,
            });
            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "different options with incremental with outFile",
                fs: () => fs({ incremental: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project", "--verbose"],
                edits: [
                    withOptionChange("with sourceMap", "--sourceMap"),
                    noChangeWithSubscenario("should re-emit only js so they dont contain sourcemap"),
                    withOptionChange("with declaration, emit Dts and should not emit js (but can it update buildInfo)", "--declaration"),
                    withOptionChange("with declaration and declarationMap", "--declaration", "--declarationMap"),
                    noChangeRun,
                    localChange(),
                    withOptionChange("with declaration and declarationMap", "--declaration", "--declarationMap"),
                    noChangeRun,
                    withOptionChange("with inlineSourceMap", "--inlineSourceMap"),
                    withOptionChange("with sourceMap", "--sourceMap"),
                    noChangeWithSubscenario("emit js files"),
                    withOptionChange("with declaration and declarationMap (should this reemit or not?)", "--declaration", "--declarationMap"),
                    withOptionChange("with declaration and declarationMap, should not re-emit", "--declaration", "--declarationMap"),
                ],
                baselinePrograms: true,
            });
        });
        describe("emitDeclarationOnly::", () => {
            function fs(options: CompilerOptions) {
                return loadProjectFromFiles({
                    "/src/project1/src/tsconfig.json": JSON.stringify({
                        compilerOptions: compilerOptionsToConfigJson(options),
                    }),
                    "/src/project1/src/a.ts": `export const a = 10;const aLocal = 10;`,
                    "/src/project1/src/b.ts": `export const b = 10;const bLocal = 10;`,
                    "/src/project1/src/c.ts": `import { a } from "./a";export const c = a;`,
                    "/src/project1/src/d.ts": `import { b } from "./b";export const d = b;`,
                    "/src/project2/src/tsconfig.json": JSON.stringify({
                        compilerOptions: compilerOptionsToConfigJson(options),
                        references: [{ path: "../../project1/src" }],
                    }),
                    "/src/project2/src/e.ts": `export const e = 10;`,
                    "/src/project2/src/f.ts": `import { a } from "${options.outFile ? "a" : "../../project1/src/a"}"; export const f = a;`,
                    "/src/project2/src/g.ts": `import { b } from "${options.outFile ? "b" : "../../project1/src/b"}"; export const g = b;`,
                });
            }
            function verifyWithIncremental(options: CompilerOptions) {
                verifyTscWithEdits({
                    scenario: "commandLine",
                    subScenario: subScenario("emitDeclarationOnly on commandline"),
                    fs: () => fs(options),
                    commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly"],
                    edits: [
                        noChangeRun,
                        {
                            subScenario: "local change",
                            modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                        },
                        {
                            subScenario: "non local change",
                            modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "export const aaa = 10;"),
                        },
                        {
                            subScenario: "emit js files",
                            modifyFs: noop,
                            commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                        },
                        {
                            ...noChangeRun,
                            discrepancyExplanation: () => [
                                `Clean build tsbuildinfo for both projects will have compilerOptions with composite and emitDeclarationOnly`,
                                `Incremental build will detect that it doesnt need to rebuild so tsbuild info for projects is from before which has option composite only`,
                            ]
                        },
                        {
                            subScenario: "js emit with change without emitDeclarationOnly",
                            modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const alocal = 10;"),
                            commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                        },
                        {
                            subScenario: "local change",
                            modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const aaaa = 10;"),
                            discrepancyExplanation: () => [
                                `Clean build tsbuildinfo for project2 will have compilerOptions with composite and emitDeclarationOnly`,
                                `Incremental build will detect that it doesnt need to rebuild project2 so tsbuildinfo for it is from before which has option composite only`,
                            ]
                        },
                        {
                            subScenario: "non local change",
                            modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const aaaaa = 10;"),
                        },
                        {
                            subScenario: "js emit with change without emitDeclarationOnly",
                            modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const a2 = 10;"),
                            commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                        },
                    ],
                    baselinePrograms: true,
                });
                verifyTscWithEdits({
                    scenario: "commandLine",
                    subScenario: subScenario("emitDeclarationOnly false on commandline"),
                    fs: () => fs({ ...options, emitDeclarationOnly: true }),
                    commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    edits: [
                        noChangeRun,
                        {
                            subScenario: "change",
                            modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                        },
                        {
                            subScenario: "emit js files",
                            modifyFs: noop,
                            commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                        },
                        {
                            ...noChangeRun,
                            discrepancyExplanation: () => [
                                `Clean build tsbuildinfo for both projects will have compilerOptions with composite and emitDeclarationOnly`,
                                `Incremental build will detect that it doesnt need to rebuild so tsbuild info for projects is from before which has option composite as true but emitDeclrationOnly as false`,
                            ]
                        },
                        {
                            subScenario: "no change run with js emit",
                            modifyFs: noop,
                            commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                        },
                        {
                            subScenario: "js emit with change",
                            modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const blocal = 10;"),
                            commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                        },
                    ],
                    baselinePrograms: true,
                });
                function subScenario(text: string) {
                    return `${text}${options.composite ? "" : " with declaration and incremental"}`;
                }
            }
            verifyWithIncremental({ composite: true });
            verifyWithIncremental({ incremental: true, declaration: true });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly on commandline with declaration",
                fs: () => fs({ declaration: true }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "export const aaa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    noChangeRun,
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const alocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const aaaa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const aaaaa = 10;"),
                    },
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const a2 = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly false on commandline with declaration",
                fs: () => fs({ declaration: true, emitDeclarationOnly: true }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    noChangeRun,
                    {
                        subScenario: "no change run with js emit",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    {
                        subScenario: "js emit with change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const blocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly on commandline with outFile",
                fs: () => fs({ composite: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "export const aaa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    noChangeRun,
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const alocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const aaaa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const aaaaa = 10;"),
                    },
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const a2 = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly false on commandline with outFile",
                fs: () => fs({ composite: true, emitDeclarationOnly: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    noChangeRun,
                    {
                        subScenario: "no change run with js emit",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    {
                        subScenario: "js emit with change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const blocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly on commandline with declaration and incremental with outFile",
                fs: () => fs({ incremental: true, declaration: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "export const aaa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    noChangeRun,
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const alocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const aaaa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const aaaaa = 10;"),
                    },
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const a2 = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly false on commandline with declaration and incremental with outFile",
                fs: () => fs({ incremental: true, declaration: true, emitDeclarationOnly: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    noChangeRun,
                    {
                        subScenario: "no change run with js emit",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    {
                        subScenario: "js emit with change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const blocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly on commandline with declaration with outFile",
                fs: () => fs({ declaration: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "export const aaa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    noChangeRun,
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const alocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                    {
                        subScenario: "local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const aaaa = 10;"),
                    },
                    {
                        subScenario: "non local change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const aaaaa = 10;"),
                    },
                    {
                        subScenario: "js emit with change without emitDeclarationOnly",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "export const a2 = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                    },
                ],
                baselinePrograms: true,
            });

            verifyTscWithEdits({
                scenario: "commandLine",
                subScenario: "emitDeclarationOnly false on commandline with declaration with outFile",
                fs: () => fs({ declaration: true, emitDeclarationOnly: true, outFile: "../outFile.js", module: ModuleKind.AMD }),
                commandLineArgs: ["--b", "/src/project2/src", "--verbose"],
                edits: [
                    noChangeRun,
                    {
                        subScenario: "change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/a.ts", "const aa = 10;"),
                    },
                    {
                        subScenario: "emit js files",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    noChangeRun,
                    {
                        subScenario: "no change run with js emit",
                        modifyFs: noop,
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                    {
                        subScenario: "js emit with change",
                        modifyFs: fs => appendText(fs, "/src/project1/src/b.ts", "const blocal = 10;"),
                        commandLineArgs: ["--b", "/src/project2/src", "--verbose", "--emitDeclarationOnly", "false"],
                    },
                ],
                baselinePrograms: true,
            });
        });
    });
}