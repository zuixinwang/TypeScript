/*@internal*/
namespace ts {
    export interface ReusableDiagnostic extends ReusableDiagnosticRelatedInformation {
        /** May store more in future. For now, this will simply be `true` to indicate when a diagnostic is an unused-identifier diagnostic. */
        reportsUnnecessary?: {};
        reportDeprecated?: {}
        source?: string;
        relatedInformation?: ReusableDiagnosticRelatedInformation[];
        skippedOn?: keyof CompilerOptions;
    }

    export interface ReusableDiagnosticRelatedInformation {
        category: DiagnosticCategory;
        code: number;
        file: string | undefined;
        start: number | undefined;
        length: number | undefined;
        messageText: string | ReusableDiagnosticMessageChain;
    }

    export type ReusableDiagnosticMessageChain = DiagnosticMessageChain;

    export interface ReusableBuilderProgramState extends BuilderState {
        /**
         * Cache of bind and check diagnostics for files with their Path being the key
         */
        semanticDiagnosticsPerFile?: ESMap<Path, readonly ReusableDiagnostic[] | readonly Diagnostic[]> | undefined;
        /**
         * The map has key by source file's path that has been changed
         */
        changedFilesSet?: Set<Path>;
        /**
         * program corresponding to this state
         */
        program?: Program | undefined;
        /**
         * compilerOptions for the program
         */
        compilerOptions: CompilerOptions;
        /**
         * Files pending to be emitted
         */
        affectedFilesPendingEmit?: ReadonlyESMap<Path, BuilderFileEmit>;
        /**
         * emitKind pending for a program with --out
         */
        programEmitPending?: BuilderFileEmit;
        /*
         * true if semantic diagnostics are ReusableDiagnostic instead of Diagnostic
         */
        hasReusableDiagnostic?: true;
        /**
         * Hash of d.ts emitted for the file, use to track when emit of d.ts changes
         */
        emitSignatures?: ESMap<Path, string>;
        /**
         * Path is in this set if emitSignature was emitted with different declarationMap than compilerOptions.declarationMap
         */
        emitSignatureDtsMapDiffers?: Set<Path>;
        /**
         * Hash of d.ts emit with --out
         */
        outSignature?: string;
        /**
         * true if outSignature was emitted with different declarationMap than compilerOptions.declarationMap
         */
        outSignatureDtsMapDiffers?: true;
        /**
         * Name of the file whose dts was the latest to change
         */
        latestChangedDtsFile: string | undefined;
    }

    export const enum BuilderFileEmit {
        None                = 0,
        Js                  = 1 << 0,
        JsMap               = 1 << 1,
        JsInlineMap         = 1 << 2,
        Dts                 = 1 << 3,
        DtsMap              = 1 << 4,

        AllJs               = Js | JsMap | JsInlineMap,
        AllDts              = Dts | DtsMap,
        All                 = AllJs | AllDts,
    }

    /**
     * State to store the changed files, affected files and cache semantic diagnostics
     */
    // TODO: GH#18217 Properties of this interface are frequently asserted to be defined.
    export interface BuilderProgramState extends BuilderState, ReusableBuilderProgramState {
        /**
         * Cache of bind and check diagnostics for files with their Path being the key
         */
        semanticDiagnosticsPerFile: ESMap<Path, readonly Diagnostic[]> | undefined;
        /**
         * The map has key by source file's path that has been changed
         */
        changedFilesSet: Set<Path>;
        /**
         * Set of affected files being iterated
         */
        affectedFiles?: readonly SourceFile[] | undefined;
        /**
         * Current index to retrieve affected file from
         */
        affectedFilesIndex: number | undefined;
        /**
         * Current changed file for iterating over affected files
         */
        currentChangedFilePath?: Path | undefined;
        /**
         * Already seen affected files
         */
        seenAffectedFiles: Set<Path> | undefined;
        /**
         * whether this program has cleaned semantic diagnostics cache for lib files
         */
        cleanedDiagnosticsOfLibFiles?: boolean;
        /**
         * True if the semantic diagnostics were copied from the old state
         */
        semanticDiagnosticsFromOldState?: Set<Path>;
        /**
         * Records if change in dts emit was detected
         */
        hasChangedEmitSignature?: boolean;
        /**
         * Files pending to be emitted
         */
        affectedFilesPendingEmit?: ESMap<Path, BuilderFileEmit>;
        /**
         * true if build info is emitted
         */
        buildInfoEmitPending: boolean;
        /**
         * Already seen emitted files
         */
        seenEmittedFiles: ESMap<Path, BuilderFileEmit> | undefined;
        /** Stores list of files that change signature during emit - test only */
        filesChangingSignature?: Set<Path>;
    }

    export type SavedBuildProgramEmitState = Pick<BuilderProgramState,
        "affectedFilesPendingEmit" |
        "seenEmittedFiles" |
        "programEmitPending" |
        "emitSignatures" |
        "emitSignatureDtsMapDiffers" |
        "outSignature" |
        "outSignatureDtsMapDiffers" |
        "latestChangedDtsFile" |
        "hasChangedEmitSignature"
    > & { changedFilesSet: BuilderProgramState["changedFilesSet"] | undefined };

    export function getBuilderFileEmit(options: CompilerOptions) {
        let result = BuilderFileEmit.Js;
        if (options.sourceMap) result = result | BuilderFileEmit.JsMap;
        if (options.inlineSourceMap) result = result | BuilderFileEmit.JsInlineMap;
        if (getEmitDeclarations(options)) result = result | BuilderFileEmit.Dts;
        if (options.declarationMap) result = result | BuilderFileEmit.DtsMap;
        if (options.emitDeclarationOnly) result = result & ~BuilderFileEmit.AllJs;
        return result;
    }

    export function getPendingEmitKind(optionsOrEmitKind: CompilerOptions | BuilderFileEmit, oldOptionsOrEmitKind: CompilerOptions | BuilderFileEmit | undefined): BuilderFileEmit {
        const oldEmitKind = oldOptionsOrEmitKind && (isNumber(oldOptionsOrEmitKind) ? oldOptionsOrEmitKind : getBuilderFileEmit(oldOptionsOrEmitKind));
        const emitKind = isNumber(optionsOrEmitKind) ? optionsOrEmitKind : getBuilderFileEmit(optionsOrEmitKind);
        if (oldEmitKind === emitKind) return BuilderFileEmit.None;
        if (!oldEmitKind || !emitKind) return emitKind;
        const diff = oldEmitKind ^ emitKind;
        let result = BuilderFileEmit.None;
        // If there is diff in Js emit, pending emit is js emit flags
        if (diff & BuilderFileEmit.AllJs) result = emitKind & BuilderFileEmit.AllJs;
        // If there is diff in Dts emit, pending emit is dts emit flags
        if (diff & BuilderFileEmit.AllDts) result = result | (emitKind & BuilderFileEmit.AllDts);
        return result;
    }

    function hasSameKeys(map1: ReadonlyCollection<string> | undefined, map2: ReadonlyCollection<string> | undefined): boolean {
        // Has same size and every key is present in both maps
        return map1 === map2 || map1 !== undefined && map2 !== undefined && map1.size === map2.size && !forEachKey(map1, key => !map2.has(key));
    }

    /**
     * Create the state so that we can iterate on changedFiles/affected files
     */
    function createBuilderProgramState(newProgram: Program, getCanonicalFileName: GetCanonicalFileName, oldState: Readonly<ReusableBuilderProgramState> | undefined, disableUseFileVersionAsSignature: boolean | undefined): BuilderProgramState {
        const state = BuilderState.create(newProgram, getCanonicalFileName, oldState, disableUseFileVersionAsSignature) as BuilderProgramState;
        state.program = newProgram;
        const compilerOptions = newProgram.getCompilerOptions();
        state.compilerOptions = compilerOptions;
        const outFilePath = outFile(compilerOptions);
        // With --out or --outFile, any change affects all semantic diagnostics so no need to cache them
        if (!outFilePath) {
            state.semanticDiagnosticsPerFile = new Map();
        }
        else if (compilerOptions.composite && oldState?.outSignature && outFilePath === outFile(oldState?.compilerOptions)) {
            state.outSignature = oldState?.outSignature;
            if (emitSignatureDtsMapDiffers(compilerOptions, oldState.compilerOptions, oldState.outSignatureDtsMapDiffers)) state.outSignatureDtsMapDiffers = true;
        }
        state.changedFilesSet = new Set();
        state.latestChangedDtsFile = compilerOptions.composite ? oldState?.latestChangedDtsFile : undefined;

        const useOldState = BuilderState.canReuseOldState(state.referencedMap, oldState);
        const oldCompilerOptions = useOldState ? oldState!.compilerOptions : undefined;
        const canCopySemanticDiagnostics = useOldState && oldState!.semanticDiagnosticsPerFile && !!state.semanticDiagnosticsPerFile &&
            !compilerOptionsAffectSemanticDiagnostics(compilerOptions, oldCompilerOptions!);
        // We can only reuse emit signatures (i.e. .d.ts signatures) if the .d.ts file is unchanged,
        // which will eg be depedent on change in options like declarationDir and outDir options are unchanged.
        // We need to look in oldState.compilerOptions, rather than oldCompilerOptions (i.e.we need to disregard useOldState) because
        // oldCompilerOptions can be undefined if there was change in say module from None to some other option
        // which would make useOldState as false since we can now use reference maps that are needed to track what to emit, what to check etc
        // but that option change does not affect d.ts file name so emitSignatures should still be reused.
        const canCopyEmitSignatures = compilerOptions.composite &&
            oldState?.emitSignatures &&
            !outFilePath &&
            !compilerOptionsAffectDeclarationPath(compilerOptions, oldState.compilerOptions);
        if (useOldState) {
            // Copy old state's changed files set
            oldState!.changedFilesSet?.forEach(value => state.changedFilesSet.add(value));
            if (!outFilePath && oldState!.affectedFilesPendingEmit?.size) {
                state.affectedFilesPendingEmit = new Map(oldState!.affectedFilesPendingEmit);
                state.seenAffectedFiles = new Set();
            }
            state.programEmitPending = oldState!.programEmitPending;
        }
        else {
            state.buildInfoEmitPending = true;
        }

        // Update changed files and copy semantic diagnostics if we can
        const referencedMap = state.referencedMap;
        const oldReferencedMap = useOldState ? oldState!.referencedMap : undefined;
        const copyDeclarationFileDiagnostics = canCopySemanticDiagnostics && !compilerOptions.skipLibCheck === !oldCompilerOptions!.skipLibCheck;
        const copyLibFileDiagnostics = copyDeclarationFileDiagnostics && !compilerOptions.skipDefaultLibCheck === !oldCompilerOptions!.skipDefaultLibCheck;
        state.fileInfos.forEach((info, sourceFilePath) => {
            let oldInfo: Readonly<BuilderState.FileInfo> | undefined;
            let newReferences: ReadonlySet<Path> | undefined;

            // if not using old state, every file is changed
            if (!useOldState ||
                // File wasn't present in old state
                !(oldInfo = oldState!.fileInfos.get(sourceFilePath)) ||
                // versions dont match
                oldInfo.version !== info.version ||
                // Implied formats dont match
                oldInfo.impliedFormat !== info.impliedFormat ||
                // Referenced files changed
                !hasSameKeys(newReferences = referencedMap && referencedMap.getValues(sourceFilePath), oldReferencedMap && oldReferencedMap.getValues(sourceFilePath)) ||
                // Referenced file was deleted in the new program
                newReferences && forEachKey(newReferences, path => !state.fileInfos.has(path) && oldState!.fileInfos.has(path))) {
                // Register file as changed file and do not copy semantic diagnostics, since all changed files need to be re-evaluated
                addFileToChangeSet(state, sourceFilePath);
            }
            else if (canCopySemanticDiagnostics) {
                const sourceFile = newProgram.getSourceFileByPath(sourceFilePath)!;

                if (sourceFile.isDeclarationFile && !copyDeclarationFileDiagnostics) return;
                if (sourceFile.hasNoDefaultLib && !copyLibFileDiagnostics) return;

                // Unchanged file copy diagnostics
                const diagnostics = oldState!.semanticDiagnosticsPerFile!.get(sourceFilePath);
                if (diagnostics) {
                    state.semanticDiagnosticsPerFile!.set(sourceFilePath, oldState!.hasReusableDiagnostic ? convertToDiagnostics(diagnostics as readonly ReusableDiagnostic[], newProgram, getCanonicalFileName) : diagnostics as readonly Diagnostic[]);
                    if (!state.semanticDiagnosticsFromOldState) {
                        state.semanticDiagnosticsFromOldState = new Set();
                    }
                    state.semanticDiagnosticsFromOldState.add(sourceFilePath);
                }
            }
            if (canCopyEmitSignatures) {
                const oldEmitSignature = oldState.emitSignatures.get(sourceFilePath);
                if (oldEmitSignature) {
                    (state.emitSignatures ??= new Map()).set(sourceFilePath, oldEmitSignature);
                    if (emitSignatureDtsMapDiffers(compilerOptions, oldState.compilerOptions, oldState.emitSignatureDtsMapDiffers?.has(sourceFilePath))) {
                        (state.emitSignatureDtsMapDiffers ??= new Set()).add(sourceFilePath);
                    }
                }
            }
        });

        // If the global file is removed, add all files as changed
        if (useOldState && forEachEntry(oldState!.fileInfos, (info, sourceFilePath) => (outFilePath || info.affectsGlobalScope) && !state.fileInfos.has(sourceFilePath))) {
            BuilderState.getAllFilesExcludingDefaultLibraryFile(state, newProgram, /*firstSourceFile*/ undefined)
                .forEach(file => addFileToChangeSet(state, file.resolvedPath));
        }
        else if (oldCompilerOptions) {
            const pendingEmitKind = compilerOptionsAffectEmit(compilerOptions, oldCompilerOptions) ?
                getBuilderFileEmit(compilerOptions) :
                getPendingEmitKind(compilerOptions, oldCompilerOptions);
            if (pendingEmitKind !== BuilderFileEmit.None) {
                if (!outFilePath) {
                    // Add all files to affectedFilesPendingEmit since emit changed
                    newProgram.getSourceFiles().forEach(f => {
                        if (!state.changedFilesSet.has(f.resolvedPath)) {
                            addToAffectedFilesPendingEmit(
                                state,
                                f.resolvedPath,
                                pendingEmitKind
                            );
                        }
                    });
                    Debug.assert(!state.seenAffectedFiles || !state.seenAffectedFiles.size);
                    state.seenAffectedFiles = state.seenAffectedFiles || new Set();
                    state.buildInfoEmitPending = true;
                }
                else {
                    state.programEmitPending = state.programEmitPending ?
                        state.programEmitPending | pendingEmitKind :
                        pendingEmitKind;
                }
            }
        }
        // If this program has prepend references, always emit since we wont know if files on disk are correct unless we check file hash for correctness
        if (outFilePath && !state.changedFilesSet.size && some(newProgram.getProjectReferences(), ref => !!ref.prepend)) {
            state.programEmitPending = getBuilderFileEmit(compilerOptions);
        }
        return state;
    }

    function addFileToChangeSet(state: BuilderProgramState, path: Path) {
        state.changedFilesSet.add(path);
        state.buildInfoEmitPending = true;
        state.programEmitPending = undefined;
    }

    function emitSignatureDtsMapDiffers(options: CompilerOptions, oldOptions: CompilerOptions, oldEmitSignatureDiffers: boolean | undefined) {
        return !!options.declarationMap === !!oldOptions.declarationMap ? oldEmitSignatureDiffers : !oldEmitSignatureDiffers;
    }

    function convertToDiagnostics(diagnostics: readonly ReusableDiagnostic[], newProgram: Program, getCanonicalFileName: GetCanonicalFileName): readonly Diagnostic[] {
        if (!diagnostics.length) return emptyArray;
        const buildInfoDirectory = getDirectoryPath(getNormalizedAbsolutePath(getTsBuildInfoEmitOutputFilePath(newProgram.getCompilerOptions())!, newProgram.getCurrentDirectory()));
        return diagnostics.map(diagnostic => {
            const result: Diagnostic = convertToDiagnosticRelatedInformation(diagnostic, newProgram, toPath);
            result.reportsUnnecessary = diagnostic.reportsUnnecessary;
            result.reportsDeprecated = diagnostic.reportDeprecated;
            result.source = diagnostic.source;
            result.skippedOn = diagnostic.skippedOn;
            const { relatedInformation } = diagnostic;
            result.relatedInformation = relatedInformation ?
                relatedInformation.length ?
                    relatedInformation.map(r => convertToDiagnosticRelatedInformation(r, newProgram, toPath)) :
                    [] :
                undefined;
            return result;
        });

        function toPath(path: string) {
            return ts.toPath(path, buildInfoDirectory, getCanonicalFileName);
        }
    }

    function convertToDiagnosticRelatedInformation(diagnostic: ReusableDiagnosticRelatedInformation, newProgram: Program, toPath: (path: string) => Path): DiagnosticRelatedInformation {
        const { file } = diagnostic;
        return {
            ...diagnostic,
            file: file ? newProgram.getSourceFileByPath(toPath(file)) : undefined
        };
    }

    /**
     * Releases program and other related not needed properties
     */
    function releaseCache(state: BuilderProgramState) {
        BuilderState.releaseCache(state);
        state.program = undefined;
    }

    function backupBuilderProgramEmitState(state: Readonly<BuilderProgramState>): SavedBuildProgramEmitState {
        const outFilePath = outFile(state.compilerOptions);
        // Only in --out changeFileSet is kept around till emit
        Debug.assert(!state.changedFilesSet.size || outFilePath);
        return {
            affectedFilesPendingEmit: state.affectedFilesPendingEmit && new Map(state.affectedFilesPendingEmit),
            seenEmittedFiles: state.seenEmittedFiles && new Map(state.seenEmittedFiles),
            programEmitPending: state.programEmitPending,
            emitSignatures: state.emitSignatures && new Map(state.emitSignatures),
            emitSignatureDtsMapDiffers: state.emitSignatureDtsMapDiffers && new Set(state.emitSignatureDtsMapDiffers),
            outSignature: state.outSignature,
            outSignatureDtsMapDiffers: state.outSignatureDtsMapDiffers,
            latestChangedDtsFile: state.latestChangedDtsFile,
            hasChangedEmitSignature: state.hasChangedEmitSignature,
            changedFilesSet: outFilePath ? new Set(state.changedFilesSet) : undefined,
        };
    }

    function restoreBuilderProgramEmitState(state: BuilderProgramState, savedEmitState: SavedBuildProgramEmitState) {
        state.affectedFilesPendingEmit = savedEmitState.affectedFilesPendingEmit;
        state.seenEmittedFiles = savedEmitState.seenEmittedFiles;
        state.programEmitPending = savedEmitState.programEmitPending;
        state.emitSignatures = savedEmitState.emitSignatures;
        state.emitSignatureDtsMapDiffers = savedEmitState.emitSignatureDtsMapDiffers;
        state.outSignature = savedEmitState.outSignature;
        state.outSignatureDtsMapDiffers = savedEmitState.outSignatureDtsMapDiffers;
        state.latestChangedDtsFile = savedEmitState.latestChangedDtsFile;
        state.hasChangedEmitSignature = savedEmitState.hasChangedEmitSignature;
        if (savedEmitState.changedFilesSet) state.changedFilesSet = savedEmitState.changedFilesSet;
    }

    /**
     * Verifies that source file is ok to be used in calls that arent handled by next
     */
    function assertSourceFileOkWithoutNextAffectedCall(state: BuilderProgramState, sourceFile: SourceFile | undefined) {
        Debug.assert(!sourceFile || !state.affectedFiles || state.affectedFiles[state.affectedFilesIndex! - 1] !== sourceFile || !state.semanticDiagnosticsPerFile!.has(sourceFile.resolvedPath));
    }

    /**
     * This function returns the next affected file to be processed.
     * Note that until doneAffected is called it would keep reporting same result
     * This is to allow the callers to be able to actually remove affected file only when the operation is complete
     * eg. if during diagnostics check cancellation token ends up cancelling the request, the affected file should be retained
     */
    function getNextAffectedFile(
        state: BuilderProgramState,
        cancellationToken: CancellationToken | undefined,
        computeHash: BuilderState.ComputeHash,
        getCanonicalFileName: GetCanonicalFileName,
        host: BuilderProgramHost
    ): SourceFile | Program | undefined {
        while (true) {
            const { affectedFiles } = state;
            if (affectedFiles) {
                const seenAffectedFiles = state.seenAffectedFiles!;
                let affectedFilesIndex = state.affectedFilesIndex!; // TODO: GH#18217
                while (affectedFilesIndex < affectedFiles.length) {
                    const affectedFile = affectedFiles[affectedFilesIndex];
                    if (!seenAffectedFiles.has(affectedFile.resolvedPath)) {
                        // Set the next affected file as seen and remove the cached semantic diagnostics
                        state.affectedFilesIndex = affectedFilesIndex;
                        addToAffectedFilesPendingEmit(state, affectedFile.resolvedPath, getBuilderFileEmit(state.compilerOptions));
                        handleDtsMayChangeOfAffectedFile(
                            state,
                            affectedFile,
                            cancellationToken,
                            computeHash,
                            getCanonicalFileName,
                            host
                        );
                        return affectedFile;
                    }
                    affectedFilesIndex++;
                }

                // Remove the changed file from the change set
                state.changedFilesSet.delete(state.currentChangedFilePath!);
                state.currentChangedFilePath = undefined;
                // Commit the changes in file signature
                state.oldSignatures?.clear();
                state.oldExportedModulesMap?.clear();
                state.affectedFiles = undefined;
            }

            // Get next changed file
            const nextKey = state.changedFilesSet.keys().next();
            if (nextKey.done) {
                // Done
                return undefined;
            }

            // With --out or --outFile all outputs go into single file
            // so operations are performed directly on program, return program
            const program = Debug.checkDefined(state.program);
            const compilerOptions = program.getCompilerOptions();
            if (outFile(compilerOptions)) {
                Debug.assert(!state.semanticDiagnosticsPerFile);
                return program;
            }

            // Get next batch of affected files
            state.affectedFiles = BuilderState.getFilesAffectedByWithOldState(
                state,
                program,
                nextKey.value,
                cancellationToken,
                computeHash,
                getCanonicalFileName,
            );
            state.currentChangedFilePath = nextKey.value;
            state.affectedFilesIndex = 0;
            if (!state.seenAffectedFiles) state.seenAffectedFiles = new Set();
        }
    }

    function clearAffectedFilesPendingEmit(state: BuilderProgramState, emitOnlyDtsFiles: boolean | undefined) {
        if (!state.affectedFilesPendingEmit?.size) return;
        if (!emitOnlyDtsFiles) return state.affectedFilesPendingEmit = undefined;
        state.affectedFilesPendingEmit.forEach((emitKind, path) => {
            const pending = emitKind & BuilderFileEmit.AllJs;
            if (!pending) state.affectedFilesPendingEmit!.delete(path);
            else state.affectedFilesPendingEmit!.set(path, pending);
        });
    }

    /**
     * Returns next file to be emitted from files that retrieved semantic diagnostics but did not emit yet
     */
    function getNextAffectedFilePendingEmit(state: BuilderProgramState, emitOnlyDtsFiles: boolean | undefined) {
        if (!state.affectedFilesPendingEmit?.size) return undefined;
        return forEachEntry(state.affectedFilesPendingEmit, (emitKind, path) => {
            const affectedFile = state.program!.getSourceFileByPath(path);
            if (!affectedFile || !sourceFileMayBeEmitted(affectedFile, state.program!)) {
                state.affectedFilesPendingEmit!.delete(path);
                return undefined;
            }
            const seenKind = state.seenEmittedFiles?.get(affectedFile.resolvedPath);
            let pendingKind = getPendingEmitKind(emitKind, seenKind);
            if (emitOnlyDtsFiles) pendingKind = pendingKind & BuilderFileEmit.AllDts;
            if (pendingKind) return { affectedFile, emitKind: pendingKind };
        });
    }

    function removeDiagnosticsOfLibraryFiles(state: BuilderProgramState) {
        if (!state.cleanedDiagnosticsOfLibFiles) {
            state.cleanedDiagnosticsOfLibFiles = true;
            const program = Debug.checkDefined(state.program);
            const options = program.getCompilerOptions();
            forEach(program.getSourceFiles(), f =>
                program.isSourceFileDefaultLibrary(f) &&
                !skipTypeChecking(f, options, program) &&
                removeSemanticDiagnosticsOf(state, f.resolvedPath)
            );
        }
    }

    /**
     *  Handles semantic diagnostics and dts emit for affectedFile and files, that are referencing modules that export entities from affected file
     *  This is because even though js emit doesnt change, dts emit / type used can change resulting in need for dts emit and js change
     */
    function handleDtsMayChangeOfAffectedFile(
        state: BuilderProgramState,
        affectedFile: SourceFile,
        cancellationToken: CancellationToken | undefined,
        computeHash: BuilderState.ComputeHash,
        getCanonicalFileName: GetCanonicalFileName,
        host: BuilderProgramHost,
    ) {
        removeSemanticDiagnosticsOf(state, affectedFile.resolvedPath);

        // If affected files is everything except default library, then nothing more to do
        if (state.allFilesExcludingDefaultLibraryFile === state.affectedFiles) {
            removeDiagnosticsOfLibraryFiles(state);
            // When a change affects the global scope, all files are considered to be affected without updating their signature
            // That means when affected file is handled, its signature can be out of date
            // To avoid this, ensure that we update the signature for any affected file in this scenario.
            BuilderState.updateShapeSignature(
                state,
                Debug.checkDefined(state.program),
                affectedFile,
                cancellationToken,
                computeHash,
                getCanonicalFileName,
            );
            return;
        }
        if (state.compilerOptions.assumeChangesOnlyAffectDirectDependencies) return;
        handleDtsMayChangeOfReferencingExportOfAffectedFile(
            state,
            affectedFile,
            cancellationToken,
            computeHash,
            getCanonicalFileName,
            host,
        );
    }

    /**
     * Handle the dts may change, so they need to be added to pending emit if dts emit is enabled,
     * Also we need to make sure signature is updated for these files
     */
    function handleDtsMayChangeOf(
        state: BuilderProgramState,
        path: Path,
        cancellationToken: CancellationToken | undefined,
        computeHash: BuilderState.ComputeHash,
        getCanonicalFileName: GetCanonicalFileName,
        host: BuilderProgramHost
    ): void {
        removeSemanticDiagnosticsOf(state, path);

        if (!state.changedFilesSet.has(path)) {
            const program = Debug.checkDefined(state.program);
            const sourceFile = program.getSourceFileByPath(path);
            if (sourceFile) {
                // Even though the js emit doesnt change and we are already handling dts emit and semantic diagnostics
                // we need to update the signature to reflect correctness of the signature(which is output d.ts emit) of this file
                // This ensures that we dont later during incremental builds considering wrong signature.
                // Eg where this also is needed to ensure that .tsbuildinfo generated by incremental build should be same as if it was first fresh build
                // But we avoid expensive full shape computation, as using file version as shape is enough for correctness.
                BuilderState.updateShapeSignature(
                    state,
                    program,
                    sourceFile,
                    cancellationToken,
                    computeHash,
                    getCanonicalFileName,
                    !host.disableUseFileVersionAsSignature
                );
                // If not dts emit, nothing more to do
                if (getEmitDeclarations(state.compilerOptions)) {
                    addToAffectedFilesPendingEmit(state, path, state.compilerOptions.declarationMap ? BuilderFileEmit.AllDts : BuilderFileEmit.Dts);
                }
            }
        }
    }

    /**
     * Removes semantic diagnostics for path and
     * returns true if there are no more semantic diagnostics from the old state
     */
    function removeSemanticDiagnosticsOf(state: BuilderProgramState, path: Path) {
        if (!state.semanticDiagnosticsFromOldState) {
            return true;
        }
        state.semanticDiagnosticsFromOldState.delete(path);
        state.semanticDiagnosticsPerFile!.delete(path);
        return !state.semanticDiagnosticsFromOldState.size;
    }

    function isChangedSignature(state: BuilderProgramState, path: Path) {
        const oldSignature = Debug.checkDefined(state.oldSignatures).get(path) || undefined;
        const newSignature = Debug.checkDefined(state.fileInfos.get(path)).signature;
        return newSignature !== oldSignature;
    }

    function handleDtsMayChangeOfGlobalScope(
        state: BuilderProgramState,
        filePath: Path,
        cancellationToken: CancellationToken | undefined,
        computeHash: BuilderState.ComputeHash,
        getCanonicalFileName: GetCanonicalFileName,
        host: BuilderProgramHost,
    ): boolean {
        if (!state.fileInfos.get(filePath)?.affectsGlobalScope) return false;
        // Every file needs to be handled
        BuilderState.getAllFilesExcludingDefaultLibraryFile(state, state.program!, /*firstSourceFile*/ undefined)
            .forEach(file => handleDtsMayChangeOf(
                state,
                file.resolvedPath,
                cancellationToken,
                computeHash,
                getCanonicalFileName,
                host,
            ));
        removeDiagnosticsOfLibraryFiles(state);
        return true;
    }

    /**
     * Iterate on referencing modules that export entities from affected file and delete diagnostics and add pending emit
     */
    function handleDtsMayChangeOfReferencingExportOfAffectedFile(
        state: BuilderProgramState,
        affectedFile: SourceFile,
        cancellationToken: CancellationToken | undefined,
        computeHash: BuilderState.ComputeHash,
        getCanonicalFileName: GetCanonicalFileName,
        host: BuilderProgramHost
    ) {
        // If there was change in signature (dts output) for the changed file,
        // then only we need to handle pending file emit
        if (!state.exportedModulesMap || !state.changedFilesSet.has(affectedFile.resolvedPath)) return;
        if (!isChangedSignature(state, affectedFile.resolvedPath)) return;

        // Since isolated modules dont change js files, files affected by change in signature is itself
        // But we need to cleanup semantic diagnostics and queue dts emit for affected files
        if (state.compilerOptions.isolatedModules) {
            const seenFileNamesMap = new Map<Path, true>();
            seenFileNamesMap.set(affectedFile.resolvedPath, true);
            const queue = BuilderState.getReferencedByPaths(state, affectedFile.resolvedPath);
            while (queue.length > 0) {
                const currentPath = queue.pop()!;
                if (!seenFileNamesMap.has(currentPath)) {
                    seenFileNamesMap.set(currentPath, true);
                    if (handleDtsMayChangeOfGlobalScope(state, currentPath, cancellationToken, computeHash, getCanonicalFileName, host)) return;
                    handleDtsMayChangeOf(state, currentPath, cancellationToken, computeHash, getCanonicalFileName, host);
                    if (isChangedSignature(state, currentPath)) {
                        const currentSourceFile = Debug.checkDefined(state.program).getSourceFileByPath(currentPath)!;
                        queue.push(...BuilderState.getReferencedByPaths(state, currentSourceFile.resolvedPath));
                    }
                }
            }
        }

        const seenFileAndExportsOfFile = new Set<string>();
        // Go through exported modules from cache first
        // If exported modules has path, all files referencing file exported from are affected
        state.exportedModulesMap.getKeys(affectedFile.resolvedPath)?.forEach(exportedFromPath => {
            if (handleDtsMayChangeOfGlobalScope(state, exportedFromPath, cancellationToken, computeHash, getCanonicalFileName, host)) return true;
            const references = state.referencedMap!.getKeys(exportedFromPath);
            return references && forEachKey(references, filePath =>
                handleDtsMayChangeOfFileAndExportsOfFile(
                    state,
                    filePath,
                    seenFileAndExportsOfFile,
                    cancellationToken,
                    computeHash,
                    getCanonicalFileName,
                    host,
                )
            );
        });
    }

    /**
     * handle dts and semantic diagnostics on file and iterate on anything that exports this file
     * return true when all work is done and we can exit handling dts emit and semantic diagnostics
     */
    function handleDtsMayChangeOfFileAndExportsOfFile(
        state: BuilderProgramState,
        filePath: Path,
        seenFileAndExportsOfFile: Set<string>,
        cancellationToken: CancellationToken | undefined,
        computeHash: BuilderState.ComputeHash,
        getCanonicalFileName: GetCanonicalFileName,
        host: BuilderProgramHost,
    ): boolean | undefined {
        if (!tryAddToSet(seenFileAndExportsOfFile, filePath)) return undefined;

        if (handleDtsMayChangeOfGlobalScope(state, filePath, cancellationToken, computeHash, getCanonicalFileName, host)) return true;
        handleDtsMayChangeOf(state, filePath, cancellationToken, computeHash, getCanonicalFileName, host);

        // If exported modules has path, all files referencing file exported from are affected
        state.exportedModulesMap!.getKeys(filePath)?.forEach(exportedFromPath =>
            handleDtsMayChangeOfFileAndExportsOfFile(
                state,
                exportedFromPath,
                seenFileAndExportsOfFile,
                cancellationToken,
                computeHash,
                getCanonicalFileName,
                host,
            )
        );

        // Remove diagnostics of files that import this file (without going to exports of referencing files)
        state.referencedMap!.getKeys(filePath)?.forEach(referencingFilePath =>
            !seenFileAndExportsOfFile.has(referencingFilePath) && // Not already removed diagnostic file
            handleDtsMayChangeOf( // Dont add to seen since this is not yet done with the export removal
                state,
                referencingFilePath,
                cancellationToken,
                computeHash,
                getCanonicalFileName,
                host,
            )
        );
        return undefined;
    }

    /**
     * This is called after completing operation on the next affected file.
     * The operations here are postponed to ensure that cancellation during the iteration is handled correctly
     */
    function doneWithAffectedFile(
        state: BuilderProgramState,
        affected: SourceFile | Program,
        emitKind?: BuilderFileEmit,
        programEmitKind?: BuilderFileEmit,
        isBuildInfoEmit?: boolean
    ) {
        if (isBuildInfoEmit) {
            state.buildInfoEmitPending = false;
        }
        else if (affected === state.program) {
            state.changedFilesSet.clear();
        }
        else {
            const affectedSourceFile = affected as SourceFile;
            state.seenAffectedFiles!.add(affectedSourceFile.resolvedPath);
            if (state.affectedFilesIndex !== undefined) state.affectedFilesIndex++;
            // Change in changeSet/affectedFilesPendingEmit, buildInfo needs to be emitted
            state.buildInfoEmitPending = true;
            if (emitKind !== undefined) {
                const existing = state.seenEmittedFiles?.get(affectedSourceFile.resolvedPath) || BuilderFileEmit.None;
                (state.seenEmittedFiles ??= new Map()).set(affectedSourceFile.resolvedPath, emitKind | existing);
                const existingPending = state.affectedFilesPendingEmit?.get(affectedSourceFile.resolvedPath) || programEmitKind!;
                const pendingKind = getPendingEmitKind(existingPending, emitKind | existing);
                if (pendingKind) {
                    (state.affectedFilesPendingEmit ??= new Map()).set(affectedSourceFile.resolvedPath, pendingKind);
                }
                else {
                    state.affectedFilesPendingEmit?.delete(affectedSourceFile.resolvedPath);
                }
            }
        }
    }

    /**
     * Returns the result with affected file
     */
    function toAffectedFileResult<T>(state: BuilderProgramState, result: T, affected: SourceFile | Program): AffectedFileResult<T> {
        doneWithAffectedFile(state, affected);
        return { result, affected };
    }

    /**
     * Returns the result with affected file
     */
    function toAffectedFileEmitResult(
        state: BuilderProgramState,
        result: EmitResult,
        affected: SourceFile | Program,
        emitKind: BuilderFileEmit,
        programEmitKind: BuilderFileEmit,
        isBuildInfoEmit?: boolean
    ): AffectedFileResult<EmitResult> {
        doneWithAffectedFile(state, affected, emitKind, programEmitKind, isBuildInfoEmit);
        return { result, affected };
    }

    /**
     * Gets semantic diagnostics for the file which are
     * bindAndCheckDiagnostics (from cache) and program diagnostics
     */
    function getSemanticDiagnosticsOfFile(state: BuilderProgramState, sourceFile: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[] {
        return concatenate(
            getBinderAndCheckerDiagnosticsOfFile(state, sourceFile, cancellationToken),
            Debug.checkDefined(state.program).getProgramDiagnostics(sourceFile)
        );
    }

    /**
     * Gets the binder and checker diagnostics either from cache if present, or otherwise from program and caches it
     * Note that it is assumed that when asked about binder and checker diagnostics, the file has been taken out of affected files/changed file set
     */
    function getBinderAndCheckerDiagnosticsOfFile(state: BuilderProgramState, sourceFile: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[] {
        const path = sourceFile.resolvedPath;
        if (state.semanticDiagnosticsPerFile) {
            const cachedDiagnostics = state.semanticDiagnosticsPerFile.get(path);
            // Report the bind and check diagnostics from the cache if we already have those diagnostics present
            if (cachedDiagnostics) {
                return filterSemanticDiagnostics(cachedDiagnostics, state.compilerOptions);
            }
        }

        // Diagnostics werent cached, get them from program, and cache the result
        const diagnostics = Debug.checkDefined(state.program).getBindAndCheckDiagnostics(sourceFile, cancellationToken);
        if (state.semanticDiagnosticsPerFile) {
            state.semanticDiagnosticsPerFile.set(path, diagnostics);
        }
        return filterSemanticDiagnostics(diagnostics, state.compilerOptions);
    }

    export type ProgramBuildInfoFileId = number & { __programBuildInfoFileIdBrand: any };
    export type ProgramBuildInfoFileIdListId = number & { __programBuildInfoFileIdListIdBrand: any };
    export type ProgramBuildInfoDiagnostic = ProgramBuildInfoFileId | [fileId: ProgramBuildInfoFileId, diagnostics: readonly ReusableDiagnostic[]];
    /**
     * fileId if pending emit is same as what compilerOptions suggest
     * [fileId] if pending emit is only dts file emit
     * [fileId, emitKind] if any other type emit is pending
     */
    export type ProgramBuilderInfoFilePendingEmit = ProgramBuildInfoFileId | [fileId: ProgramBuildInfoFileId] | [fileId: ProgramBuildInfoFileId, emitKind: BuilderFileEmit];
    export type ProgramBuildInfoReferencedMap = [fileId: ProgramBuildInfoFileId, fileIdListId: ProgramBuildInfoFileIdListId][];
    export type ProgramMultiFileEmitBuildInfoBuilderStateFileInfo = Omit<BuilderState.FileInfo, "signature"> & {
        /**
         * Signature is
         * - undefined if FileInfo.version === FileInfo.signature
         * - false if FileInfo has signature as undefined (not calculated)
         * - string actual signature
         */
        signature: string | false | undefined;
    };
    /**
     * [fileId, signature] if different from file's signature
     * fileId if file wasnt emitted
     */
    export type ProgramBuildInfoEmitSignature = ProgramBuildInfoFileId | [fileId: ProgramBuildInfoFileId, signature: string];
    /**
     * ProgramMultiFileEmitBuildInfoFileInfo is string if FileInfo.version === FileInfo.signature && !FileInfo.affectsGlobalScope otherwise encoded FileInfo
     */
    export type ProgramMultiFileEmitBuildInfoFileInfo = string | ProgramMultiFileEmitBuildInfoBuilderStateFileInfo;
    export interface ProgramMultiFileEmitBuildInfo {
        fileNames: readonly string[];
        fileInfos: readonly ProgramMultiFileEmitBuildInfoFileInfo[];
        options: CompilerOptions | undefined;
        fileIdsList: readonly (readonly ProgramBuildInfoFileId[])[] | undefined;
        referencedMap: ProgramBuildInfoReferencedMap | undefined;
        exportedModulesMap: ProgramBuildInfoReferencedMap | undefined;
        semanticDiagnosticsPerFile: ProgramBuildInfoDiagnostic[] | undefined;
        affectedFilesPendingEmit: ProgramBuilderInfoFilePendingEmit[] | undefined;
        changeFileSet: readonly ProgramBuildInfoFileId[] | undefined;
        emitSignatures: readonly ProgramBuildInfoEmitSignature[] | undefined;
        emitSignatureDtsMapDiffers: readonly ProgramBuildInfoFileId[] | undefined;
        // Because this is only output file in the program, we dont need fileId to deduplicate name
        latestChangedDtsFile?: string | undefined;
    }
    /**
     * ProgramBundleEmitBuildInfoFileInfo is string if !FileInfo.impliedFormat otherwise encoded FileInfo
     */
    export type ProgramBundleEmitBuildInfoFileInfo = string | BuilderState.FileInfo;
    /**
     * false if it is the emit corresponding to compilerOptions
     * value otherwise
     */
    export type ProgramBuildInfoBundlePendingEmit = BuilderFileEmit | false;
    export interface ProgramBundleEmitBuildInfo {
        fileNames: readonly string[];
        fileInfos: readonly ProgramBundleEmitBuildInfoFileInfo[];
        options: CompilerOptions | undefined;
        outSignature: string | undefined;
        outSignatureDtsMapDiffers: true | undefined;
        latestChangedDtsFile: string | undefined;
        pendingEmit: ProgramBuildInfoBundlePendingEmit | undefined;
    }

    export type ProgramBuildInfo = ProgramMultiFileEmitBuildInfo | ProgramBundleEmitBuildInfo;

    export function isProgramBundleEmitBuildInfo(info: ProgramBuildInfo): info is ProgramBundleEmitBuildInfo {
        return !!outFile(info.options || {});
    }

    /**
     * Gets the program information to be emitted in buildInfo so that we can use it to create new program
     */
    function getProgramBuildInfo(state: BuilderProgramState, getCanonicalFileName: GetCanonicalFileName): ProgramBuildInfo | undefined {
        const currentDirectory = Debug.checkDefined(state.program).getCurrentDirectory();
        const buildInfoDirectory = getDirectoryPath(getNormalizedAbsolutePath(getTsBuildInfoEmitOutputFilePath(state.compilerOptions)!, currentDirectory));
        // Convert the file name to Path here if we set the fileName instead to optimize multiple d.ts file emits and having to compute Canonical path
        const latestChangedDtsFile = state.latestChangedDtsFile ? relativeToBuildInfoEnsuringAbsolutePath(state.latestChangedDtsFile) : undefined;
        const fileNames: string[] = [];
        const fileNameToFileId = new Map<string, ProgramBuildInfoFileId>();
        if (outFile(state.compilerOptions)) {
            const fileInfos = arrayFrom(state.fileInfos.entries(), ([key, value]): ProgramBundleEmitBuildInfoFileInfo => {
                // Ensure fileId
                toFileId(key);
                return value.impliedFormat ?
                    { version: value.version, impliedFormat: value.impliedFormat, signature: undefined, affectsGlobalScope: undefined } :
                    value.version;
            });
            const result: ProgramBundleEmitBuildInfo = {
                fileNames,
                fileInfos,
                options: convertToProgramBuildInfoCompilerOptions(state.compilerOptions),
                outSignature: state.outSignature,
                outSignatureDtsMapDiffers: state.outSignatureDtsMapDiffers,
                latestChangedDtsFile,
                pendingEmit: !state.programEmitPending ?
                    undefined :
                    state.programEmitPending === getBuilderFileEmit(state.compilerOptions) ?
                        false :
                        state.programEmitPending,
            };
            return result;
        }

        let fileIdsList: (readonly ProgramBuildInfoFileId[])[] | undefined;
        let fileNamesToFileIdListId: ESMap<string, ProgramBuildInfoFileIdListId> | undefined;
        let emitSignatures: ProgramBuildInfoEmitSignature[] | undefined;
        let emitSignatureDtsMapDiffers: ProgramBuildInfoFileId[] | undefined;
        const fileInfos = arrayFrom(state.fileInfos.entries(), ([key, value]): ProgramMultiFileEmitBuildInfoFileInfo => {
            // Ensure fileId
            const fileId = toFileId(key);
            Debug.assert(fileNames[fileId - 1] === relativeToBuildInfo(key));
            const oldSignature = state.oldSignatures?.get(key);
            const actualSignature = oldSignature !== undefined ? oldSignature || undefined : value.signature;
            if (state.compilerOptions.composite) {
                const file = state.program!.getSourceFileByPath(key)!;
                if (!isJsonSourceFile(file) && sourceFileMayBeEmitted(file, state.program!)) {
                    const emitSignature = state.emitSignatures?.get(key);
                    if (emitSignature !== actualSignature) {
                        (emitSignatures ||= []).push(emitSignature === undefined ? fileId : [fileId, emitSignature]);
                    }
                    if (state.emitSignatureDtsMapDiffers?.has(key)) (emitSignatureDtsMapDiffers ??= []).push(fileId);
                }
            }
            return value.version === actualSignature ?
                value.affectsGlobalScope || value.impliedFormat ?
                    // If file version is same as signature, dont serialize signature
                    { version: value.version, signature: undefined, affectsGlobalScope: value.affectsGlobalScope, impliedFormat: value.impliedFormat } :
                    // If file info only contains version and signature and both are same we can just write string
                    value.version :
                actualSignature !== undefined ? // If signature is not same as version, encode signature in the fileInfo
                    oldSignature === undefined ?
                        // If we havent computed signature, use fileInfo as is
                        value :
                        // Serialize fileInfo with new updated signature
                        { version: value.version, signature: actualSignature, affectsGlobalScope: value.affectsGlobalScope, impliedFormat: value.impliedFormat } :
                    // Signature of the FileInfo is undefined, serialize it as false
                    { version: value.version, signature: false, affectsGlobalScope: value.affectsGlobalScope, impliedFormat: value.impliedFormat };
        });

        let referencedMap: ProgramBuildInfoReferencedMap | undefined;
        if (state.referencedMap) {
            referencedMap = arrayFrom(state.referencedMap.keys()).sort(compareStringsCaseSensitive).map(key => [
                toFileId(key),
                toFileIdListId(state.referencedMap!.getValues(key)!)
            ]);
        }

        let exportedModulesMap: ProgramBuildInfoReferencedMap | undefined;
        if (state.exportedModulesMap) {
            exportedModulesMap = mapDefined(arrayFrom(state.exportedModulesMap.keys()).sort(compareStringsCaseSensitive), key => {
                const oldValue = state.oldExportedModulesMap?.get(key);
                // Not in temporary cache, use existing value
                if (oldValue === undefined) return [toFileId(key), toFileIdListId(state.exportedModulesMap!.getValues(key)!)];
                if (oldValue) return [toFileId(key), toFileIdListId(oldValue)];
                return undefined;
            });
        }

        let semanticDiagnosticsPerFile: ProgramBuildInfoDiagnostic[] | undefined;
        if (state.semanticDiagnosticsPerFile) {
            for (const key of arrayFrom(state.semanticDiagnosticsPerFile.keys()).sort(compareStringsCaseSensitive)) {
                const value = state.semanticDiagnosticsPerFile.get(key)!;
                (semanticDiagnosticsPerFile ||= []).push(
                    value.length ?
                        [
                            toFileId(key),
                            convertToReusableDiagnostics(value, relativeToBuildInfo)
                        ] :
                        toFileId(key)
                );
            }
        }

        let affectedFilesPendingEmit: ProgramBuilderInfoFilePendingEmit[] | undefined;
        if (state.affectedFilesPendingEmit?.size) {
            const fullEmitForOptions = getBuilderFileEmit(state.compilerOptions);
            const seenFiles = new Set<Path>();
            for (const path of arrayFrom(state.affectedFilesPendingEmit.keys()).sort(compareStringsCaseSensitive)) {
                if (tryAddToSet(seenFiles, path)) {
                    const file = state.program!.getSourceFileByPath(path)!;
                    if (!sourceFileMayBeEmitted(file, state.program!)) continue;
                    const fileId = toFileId(path), pendingEmit = state.affectedFilesPendingEmit.get(path)!;
                    (affectedFilesPendingEmit ||= []).push(
                        pendingEmit === fullEmitForOptions ?
                            fileId :
                            pendingEmit === BuilderFileEmit.Dts ?
                                [fileId] :
                                [fileId, pendingEmit]
                    );
                }
            }
        }

        let changeFileSet: ProgramBuildInfoFileId[] | undefined;
        if (state.changedFilesSet.size) {
            for (const path of arrayFrom(state.changedFilesSet.keys()).sort(compareStringsCaseSensitive)) {
                (changeFileSet ||= []).push(toFileId(path));
            }
        }

        const result: ProgramMultiFileEmitBuildInfo = {
            fileNames,
            fileInfos,
            options: convertToProgramBuildInfoCompilerOptions(state.compilerOptions),
            fileIdsList,
            referencedMap,
            exportedModulesMap,
            semanticDiagnosticsPerFile,
            affectedFilesPendingEmit,
            changeFileSet,
            emitSignatures,
            emitSignatureDtsMapDiffers,
            latestChangedDtsFile,
        };
        return result;

        function relativeToBuildInfoEnsuringAbsolutePath(path: string) {
            return relativeToBuildInfo(getNormalizedAbsolutePath(path, currentDirectory));
        }

        function relativeToBuildInfo(path: string) {
            return ensurePathIsNonModuleName(getRelativePathFromDirectory(buildInfoDirectory, path, getCanonicalFileName));
        }

        function toFileId(path: Path): ProgramBuildInfoFileId {
            let fileId = fileNameToFileId.get(path);
            if (fileId === undefined) {
                fileNames.push(relativeToBuildInfo(path));
                fileNameToFileId.set(path, fileId = fileNames.length as ProgramBuildInfoFileId);
            }
            return fileId;
        }

        function toFileIdListId(set: ReadonlySet<Path>): ProgramBuildInfoFileIdListId {
            const fileIds = arrayFrom(set.keys(), toFileId).sort(compareValues);
            const key = fileIds.join();
            let fileIdListId = fileNamesToFileIdListId?.get(key);
            if (fileIdListId === undefined) {
                (fileIdsList ||= []).push(fileIds);
                (fileNamesToFileIdListId ||= new Map()).set(key, fileIdListId = fileIdsList.length as ProgramBuildInfoFileIdListId);
            }
            return fileIdListId;
        }

        /**
         * @param optionKey key of CommandLineOption to use to determine if the option should be serialized in tsbuildinfo
         */
        function convertToProgramBuildInfoCompilerOptions(options: CompilerOptions) {
            let result: CompilerOptions | undefined;
            const { optionsNameMap } = getOptionsNameMap();
            for (const name of getOwnKeys(options).sort(compareStringsCaseSensitive)) {
                const optionInfo = optionsNameMap.get(name.toLowerCase());
                if (optionInfo?.affectsBuildInfo) {
                    (result ||= {})[name] = convertToReusableCompilerOptionValue(
                        optionInfo,
                        options[name] as CompilerOptionsValue,
                        relativeToBuildInfoEnsuringAbsolutePath
                    );
                }
            }
            return result;
        }
    }

    function convertToReusableCompilerOptionValue(option: CommandLineOption | undefined, value: CompilerOptionsValue, relativeToBuildInfo: (path: string) => string) {
        if (option) {
            if (option.type === "list") {
                const values = value as readonly (string | number)[];
                if (option.element.isFilePath && values.length) {
                    return values.map(relativeToBuildInfo);
                }
            }
            else if (option.isFilePath) {
                return relativeToBuildInfo(value as string);
            }
        }
        return value;
    }

    function convertToReusableDiagnostics(diagnostics: readonly Diagnostic[], relativeToBuildInfo: (path: string) => string): readonly ReusableDiagnostic[] {
        Debug.assert(!!diagnostics.length);
        return diagnostics.map(diagnostic => {
            const result: ReusableDiagnostic = convertToReusableDiagnosticRelatedInformation(diagnostic, relativeToBuildInfo);
            result.reportsUnnecessary = diagnostic.reportsUnnecessary;
            result.reportDeprecated = diagnostic.reportsDeprecated;
            result.source = diagnostic.source;
            result.skippedOn = diagnostic.skippedOn;
            const { relatedInformation } = diagnostic;
            result.relatedInformation = relatedInformation ?
                relatedInformation.length ?
                    relatedInformation.map(r => convertToReusableDiagnosticRelatedInformation(r, relativeToBuildInfo)) :
                    [] :
                undefined;
            return result;
        });
    }

    function convertToReusableDiagnosticRelatedInformation(diagnostic: DiagnosticRelatedInformation, relativeToBuildInfo: (path: string) => string): ReusableDiagnosticRelatedInformation {
        const { file } = diagnostic;
        return {
            ...diagnostic,
            file: file ? relativeToBuildInfo(file.resolvedPath) : undefined
        };
    }

    export enum BuilderProgramKind {
        SemanticDiagnosticsBuilderProgram,
        EmitAndSemanticDiagnosticsBuilderProgram
    }

    export interface BuilderCreationParameters {
        newProgram: Program;
        host: BuilderProgramHost;
        oldProgram: BuilderProgram | undefined;
        configFileParsingDiagnostics: readonly Diagnostic[];
    }

    export function getBuilderCreationParameters(newProgramOrRootNames: Program | readonly string[] | undefined, hostOrOptions: BuilderProgramHost | CompilerOptions | undefined, oldProgramOrHost?: BuilderProgram | CompilerHost, configFileParsingDiagnosticsOrOldProgram?: readonly Diagnostic[] | BuilderProgram, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[]): BuilderCreationParameters {
        let host: BuilderProgramHost;
        let newProgram: Program;
        let oldProgram: BuilderProgram;
        if (newProgramOrRootNames === undefined) {
            Debug.assert(hostOrOptions === undefined);
            host = oldProgramOrHost as CompilerHost;
            oldProgram = configFileParsingDiagnosticsOrOldProgram as BuilderProgram;
            Debug.assert(!!oldProgram);
            newProgram = oldProgram.getProgram();
        }
        else if (isArray(newProgramOrRootNames)) {
            oldProgram = configFileParsingDiagnosticsOrOldProgram as BuilderProgram;
            newProgram = createProgram({
                rootNames: newProgramOrRootNames,
                options: hostOrOptions as CompilerOptions,
                host: oldProgramOrHost as CompilerHost,
                oldProgram: oldProgram && oldProgram.getProgramOrUndefined(),
                configFileParsingDiagnostics,
                projectReferences
            });
            host = oldProgramOrHost as CompilerHost;
        }
        else {
            newProgram = newProgramOrRootNames;
            host = hostOrOptions as BuilderProgramHost;
            oldProgram = oldProgramOrHost as BuilderProgram;
            configFileParsingDiagnostics = configFileParsingDiagnosticsOrOldProgram as readonly Diagnostic[];
        }
        return { host, newProgram, oldProgram, configFileParsingDiagnostics: configFileParsingDiagnostics || emptyArray };
    }

    function getTextHandlingSourceMapForSignature(text: string, data: WriteFileCallbackData | undefined) {
        return data?.sourceMapUrlPos !== undefined ? text.substring(0, data.sourceMapUrlPos) : text;
    }

    export function computeSignatureWithDiagnostics(
        sourceFile: SourceFile,
        text: string,
        computeHash: BuilderState.ComputeHash | undefined,
        getCanonicalFileName: GetCanonicalFileName,
        data: WriteFileCallbackData | undefined
    ) {
        text = getTextHandlingSourceMapForSignature(text, data);
        let sourceFileDirectory: string | undefined;
        if (data?.diagnostics?.length) {
            text += data.diagnostics.map(diagnostic =>
                `${locationInfo(diagnostic)}${DiagnosticCategory[diagnostic.category]}${diagnostic.code}: ${flattenDiagnosticMessageText(diagnostic.messageText)}`
            ).join("\n");
        }
        return (computeHash ?? generateDjb2Hash)(text);

        function flattenDiagnosticMessageText(diagnostic: string | DiagnosticMessageChain | undefined): string {
            return isString(diagnostic) ?
                diagnostic :
                diagnostic === undefined ?
                    "" :
                    !diagnostic.next ?
                        diagnostic.messageText :
                        diagnostic.messageText + diagnostic.next.map(flattenDiagnosticMessageText).join("\n");
        }

        function locationInfo(diagnostic: DiagnosticWithLocation) {
            if (diagnostic.file.resolvedPath === sourceFile.resolvedPath) return `(${diagnostic.start},${diagnostic.length})`;
            if (sourceFileDirectory === undefined) sourceFileDirectory = getDirectoryPath(sourceFile.resolvedPath);
            return `${ensurePathIsNonModuleName(getRelativePathFromDirectory(sourceFileDirectory, diagnostic.file.resolvedPath, getCanonicalFileName))}(${diagnostic.start},${diagnostic.length})`;
        }
    }

    export function computeSignature(text: string, computeHash: BuilderState.ComputeHash | undefined, data?: WriteFileCallbackData) {
        return (computeHash ?? generateDjb2Hash)(getTextHandlingSourceMapForSignature(text, data));
    }

    export function createBuilderProgram(kind: BuilderProgramKind.SemanticDiagnosticsBuilderProgram, builderCreationParameters: BuilderCreationParameters): SemanticDiagnosticsBuilderProgram;
    export function createBuilderProgram(kind: BuilderProgramKind.EmitAndSemanticDiagnosticsBuilderProgram, builderCreationParameters: BuilderCreationParameters): EmitAndSemanticDiagnosticsBuilderProgram;
    export function createBuilderProgram(kind: BuilderProgramKind, { newProgram, host, oldProgram, configFileParsingDiagnostics }: BuilderCreationParameters) {
        // Return same program if underlying program doesnt change
        let oldState = oldProgram && oldProgram.getState();
        if (oldState && newProgram === oldState.program && configFileParsingDiagnostics === newProgram.getConfigFileParsingDiagnostics()) {
            newProgram = undefined!; // TODO: GH#18217
            oldState = undefined;
            return oldProgram;
        }

        /**
         * Create the canonical file name for identity
         */
        const getCanonicalFileName = createGetCanonicalFileName(host.useCaseSensitiveFileNames());
        /**
         * Computing hash to for signature verification
         */
        const computeHash = maybeBind(host, host.createHash);
        const state = createBuilderProgramState(newProgram, getCanonicalFileName, oldState, host.disableUseFileVersionAsSignature);
        newProgram.getProgramBuildInfo = () => getProgramBuildInfo(state, getCanonicalFileName);

        // To ensure that we arent storing any references to old program or new program without state
        newProgram = undefined!; // TODO: GH#18217
        oldProgram = undefined;
        oldState = undefined;

        const getState = () => state;
        const builderProgram = createRedirectedBuilderProgram(getState, configFileParsingDiagnostics);
        builderProgram.getState = getState;
        builderProgram.saveEmitState = () => backupBuilderProgramEmitState(state);
        builderProgram.restoreEmitState = (saved) => restoreBuilderProgramEmitState(state, saved);
        builderProgram.hasChangedEmitSignature = () => !!state.hasChangedEmitSignature;
        builderProgram.getAllDependencies = sourceFile => BuilderState.getAllDependencies(state, Debug.checkDefined(state.program), sourceFile);
        builderProgram.getSemanticDiagnostics = getSemanticDiagnostics;
        builderProgram.emit = emit;
        builderProgram.releaseProgram = () => releaseCache(state);

        if (kind === BuilderProgramKind.SemanticDiagnosticsBuilderProgram) {
            (builderProgram as SemanticDiagnosticsBuilderProgram).getSemanticDiagnosticsOfNextAffectedFile = getSemanticDiagnosticsOfNextAffectedFile;
        }
        else if (kind === BuilderProgramKind.EmitAndSemanticDiagnosticsBuilderProgram) {
            (builderProgram as EmitAndSemanticDiagnosticsBuilderProgram).getSemanticDiagnosticsOfNextAffectedFile = getSemanticDiagnosticsOfNextAffectedFile;
            (builderProgram as EmitAndSemanticDiagnosticsBuilderProgram).emitNextAffectedFile = emitNextAffectedFile;
            builderProgram.emitBuildInfo = emitBuildInfo;
        }
        else {
            notImplemented();
        }

        return builderProgram;

        function emitBuildInfo(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken): EmitResult {
            if (state.buildInfoEmitPending) {
                const result = Debug.checkDefined(state.program).emitBuildInfo(writeFile || maybeBind(host, host.writeFile), cancellationToken);
                state.buildInfoEmitPending = false;
                return result;
            }
            return emitSkippedWithNoDiagnostics;
        }

        /**
         * Emits the next affected file's emit result (EmitResult and sourceFiles emitted) or returns undefined if iteration is complete
         * The first of writeFile if provided, writeFile of BuilderProgramHost if provided, writeFile of compiler host
         * in that order would be used to write the files
         */
        function emitNextAffectedFile(writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): AffectedFileResult<EmitResult> {
            let affected = getNextAffectedFile(state, cancellationToken, computeHash, getCanonicalFileName, host);
            const programEmitKind = getBuilderFileEmit(state.compilerOptions);
            let emitKind = emitOnlyDtsFiles ?
                programEmitKind & BuilderFileEmit.AllDts : programEmitKind;
            if (!affected) {
                if (!outFile(state.compilerOptions)) {
                    const pendingAffectedFile = getNextAffectedFilePendingEmit(state, emitOnlyDtsFiles);
                    if (!pendingAffectedFile) {
                        if (!state.buildInfoEmitPending) {
                            return undefined;
                        }

                        const affected = Debug.checkDefined(state.program);
                        return toAffectedFileEmitResult(
                            state,
                            // When whole program is affected, do emit only once (eg when --out or --outFile is specified)
                            // Otherwise just affected file
                            affected.emitBuildInfo(writeFile || maybeBind(host, host.writeFile), cancellationToken),
                            affected,
                            emitKind,
                            programEmitKind,
                            /*isBuildInfoEmit*/ true
                        );
                    }
                    ({ affectedFile: affected, emitKind } = pendingAffectedFile);
                }
                else {
                    if (!state.programEmitPending) return undefined;
                    emitKind = state.programEmitPending;
                    if (emitOnlyDtsFiles) emitKind = emitKind & BuilderFileEmit.AllDts;
                    if (!emitKind) return undefined;
                    affected = state.program!;
                }
            }
            if (affected === state.program) {
                state.programEmitPending = state.changedFilesSet.size ?
                    getPendingEmitKind(programEmitKind, emitKind) :
                    state.programEmitPending ?
                        getPendingEmitKind(state.programEmitPending, emitKind) :
                        undefined;
            }
            return toAffectedFileEmitResult(
                state,
                // When whole program is affected, do emit only once (eg when --out or --outFile is specified)
                // Otherwise just affected file
                Debug.checkDefined(state.program).emit(
                    affected === state.program ? undefined : affected as SourceFile,
                    getEmitDeclarations(state.compilerOptions) ?
                        getWriteFileCallback(writeFile, customTransformers) :
                        writeFile || maybeBind(host, host.writeFile),
                    cancellationToken,
                    emitOnlyDtsFiles || !(emitKind & BuilderFileEmit.AllJs),
                    customTransformers
                ),
                affected,
                emitKind,
                programEmitKind,
            );
        }

        function getWriteFileCallback(writeFile: WriteFileCallback | undefined, customTransformers: CustomTransformers | undefined): WriteFileCallback {
            return (fileName, text, writeByteOrderMark, onError, sourceFiles, data) => {
                if (isDeclarationFileName(fileName)) {
                    if (!outFile(state.compilerOptions)) {
                        Debug.assert(sourceFiles?.length === 1);
                        let emitSignature;
                        if (!customTransformers) {
                            const file = sourceFiles[0];
                            const info = state.fileInfos.get(file.resolvedPath)!;
                            if (info.signature === file.version) {
                                const signature = computeSignatureWithDiagnostics(
                                    file,
                                    text,
                                    computeHash,
                                    getCanonicalFileName,
                                    data,
                                );
                                // With d.ts diagnostics they are also part of the signature so emitSignature will be different from it since its just hash of d.ts
                                if (!data?.diagnostics?.length) emitSignature = signature;
                                if (signature !== file.version) { // Update it
                                    if (host.storeFilesChangingSignatureDuringEmit) (state.filesChangingSignature ??= new Set()).add(file.resolvedPath);
                                    if (state.exportedModulesMap) BuilderState.updateExportedModules(state, file, file.exportedModulesFromDeclarationEmit);
                                    if (state.affectedFiles) {
                                        // Keep old signature so we know what to undo if cancellation happens
                                        const existing = state.oldSignatures?.get(file.resolvedPath);
                                        if (existing === undefined) (state.oldSignatures ??= new Map()).set(file.resolvedPath, info.signature || false);
                                        info.signature = signature;
                                    }
                                    else {
                                        // These are directly commited
                                        info.signature = signature;
                                        state.oldExportedModulesMap?.clear();
                                    }
                                }
                            }
                        }

                        // Store d.ts emit hash so later can be compared to check if d.ts has changed.
                        // Currently we do this only for composite projects since these are the only projects that can be referenced by other projects
                        // and would need their d.ts change time in --build mode
                        if (state.compilerOptions.composite) {
                            const filePath = sourceFiles[0].resolvedPath;
                            const oldSignature = state.emitSignatures?.get(filePath);
                            emitSignature ??= computeSignature(text, computeHash, data);
                            // Dont write dts files if they didn't change
                            if (emitSignature === oldSignature) {
                                if (!state.emitSignatureDtsMapDiffers?.has(filePath)) return;
                                else if (data) data.differsOnlyInMap = true;
                                else data = { differsOnlyInMap: true };
                            }
                            else {
                                (state.emitSignatures ??= new Map()).set(filePath, emitSignature);
                                state.hasChangedEmitSignature = true;
                                state.latestChangedDtsFile = fileName;
                            }
                            state.emitSignatureDtsMapDiffers?.delete(filePath);
                        }
                    }
                    else if (state.compilerOptions.composite) {
                        const newSignature = computeSignature(text, computeHash, data);
                        // Dont write dts files if they didn't change
                        if (newSignature === state.outSignature) {
                            if (!state.outSignatureDtsMapDiffers) return;
                            else if (data) data.differsOnlyInMap = true;
                            else data = { differsOnlyInMap: true };
                        }
                        else {
                            state.outSignature = newSignature;
                            state.hasChangedEmitSignature = true;
                            state.latestChangedDtsFile = fileName;
                        }
                        state.outSignatureDtsMapDiffers = undefined;
                    }
                }
                if (writeFile) writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles, data);
                else if (host.writeFile) host.writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles, data);
                else state.program!.writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles, data);
            };
        }

        /**
         * Emits the JavaScript and declaration files.
         * When targetSource file is specified, emits the files corresponding to that source file,
         * otherwise for the whole program.
         * In case of EmitAndSemanticDiagnosticsBuilderProgram, when targetSourceFile is specified,
         * it is assumed that that file is handled from affected file list. If targetSourceFile is not specified,
         * it will only emit all the affected files instead of whole program
         *
         * The first of writeFile if provided, writeFile of BuilderProgramHost if provided, writeFile of compiler host
         * in that order would be used to write the files
         */
        function emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult {
            if (kind === BuilderProgramKind.EmitAndSemanticDiagnosticsBuilderProgram) {
                assertSourceFileOkWithoutNextAffectedCall(state, targetSourceFile);
            }
            const result = handleNoEmitOptions(builderProgram, targetSourceFile, writeFile, cancellationToken);
            if (result) return result;

            // Emit only affected files if using builder for emit
            if (!targetSourceFile) {
                if (kind === BuilderProgramKind.EmitAndSemanticDiagnosticsBuilderProgram) {
                    // Emit and report any errors we ran into.
                    let sourceMaps: SourceMapEmitResult[] = [];
                    let emitSkipped = false;
                    let diagnostics: Diagnostic[] | undefined;
                    let emittedFiles: string[] = [];

                    let affectedEmitResult: AffectedFileResult<EmitResult>;
                    while (affectedEmitResult = emitNextAffectedFile(writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers)) {
                        emitSkipped = emitSkipped || affectedEmitResult.result.emitSkipped;
                        diagnostics = addRange(diagnostics, affectedEmitResult.result.diagnostics);
                        emittedFiles = addRange(emittedFiles, affectedEmitResult.result.emittedFiles);
                        sourceMaps = addRange(sourceMaps, affectedEmitResult.result.sourceMaps);
                    }
                    return {
                        emitSkipped,
                        diagnostics: diagnostics || emptyArray,
                        emittedFiles,
                        sourceMaps
                    };
                }
                // In non Emit builder, clear affected files pending emit
                else {
                    clearAffectedFilesPendingEmit(state, emitOnlyDtsFiles);
                }
            }
            return Debug.checkDefined(state.program).emit(
                targetSourceFile,
                getEmitDeclarations(state.compilerOptions) ?
                    getWriteFileCallback(writeFile, customTransformers) :
                    writeFile || maybeBind(host, host.writeFile),
                cancellationToken,
                emitOnlyDtsFiles,
                customTransformers
            );
        }

        /**
         * Return the semantic diagnostics for the next affected file or undefined if iteration is complete
         * If provided ignoreSourceFile would be called before getting the diagnostics and would ignore the sourceFile if the returned value was true
         */
        function getSemanticDiagnosticsOfNextAffectedFile(cancellationToken?: CancellationToken, ignoreSourceFile?: (sourceFile: SourceFile) => boolean): AffectedFileResult<readonly Diagnostic[]> {
            while (true) {
                const affected = getNextAffectedFile(state, cancellationToken, computeHash, getCanonicalFileName, host);
                if (!affected) {
                    // Done
                    return undefined;
                }
                else if (affected === state.program) {
                    // When whole program is affected, get all semantic diagnostics (eg when --out or --outFile is specified)
                    return toAffectedFileResult(
                        state,
                        state.program.getSemanticDiagnostics(/*targetSourceFile*/ undefined, cancellationToken),
                        affected
                    );
                }

                // Get diagnostics for the affected file if its not ignored
                if (ignoreSourceFile && ignoreSourceFile(affected as SourceFile)) {
                    // Get next affected file
                    doneWithAffectedFile(state, affected);
                    continue;
                }

                return toAffectedFileResult(
                    state,
                    getSemanticDiagnosticsOfFile(state, affected as SourceFile, cancellationToken),
                    affected
                );
            }
        }

        /**
         * Gets the semantic diagnostics from the program corresponding to this state of file (if provided) or whole program
         * The semantic diagnostics are cached and managed here
         * Note that it is assumed that when asked about semantic diagnostics through this API,
         * the file has been taken out of affected files so it is safe to use cache or get from program and cache the diagnostics
         * In case of SemanticDiagnosticsBuilderProgram if the source file is not provided,
         * it will iterate through all the affected files, to ensure that cache stays valid and yet provide a way to get all semantic diagnostics
         */
        function getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[] {
            assertSourceFileOkWithoutNextAffectedCall(state, sourceFile);
            const compilerOptions = Debug.checkDefined(state.program).getCompilerOptions();
            if (outFile(compilerOptions)) {
                Debug.assert(!state.semanticDiagnosticsPerFile);
                // We dont need to cache the diagnostics just return them from program
                return Debug.checkDefined(state.program).getSemanticDiagnostics(sourceFile, cancellationToken);
            }

            if (sourceFile) {
                return getSemanticDiagnosticsOfFile(state, sourceFile, cancellationToken);
            }

            // When semantic builder asks for diagnostics of the whole program,
            // ensure that all the affected files are handled
            // eslint-disable-next-line no-empty
            while (getSemanticDiagnosticsOfNextAffectedFile(cancellationToken)) {
            }

            let diagnostics: Diagnostic[] | undefined;
            for (const sourceFile of Debug.checkDefined(state.program).getSourceFiles()) {
                diagnostics = addRange(diagnostics, getSemanticDiagnosticsOfFile(state, sourceFile, cancellationToken));
            }
            return diagnostics || emptyArray;
        }
    }

    function addToAffectedFilesPendingEmit(state: BuilderProgramState, affectedFilePendingEmit: Path, kind: BuilderFileEmit) {
        const existingKind = state.affectedFilesPendingEmit?.get(affectedFilePendingEmit) || BuilderFileEmit.None;
        (state.affectedFilesPendingEmit ??= new Map()).set(affectedFilePendingEmit, existingKind | kind);
    }

    export function toBuilderStateFileInfoForMultiEmit(fileInfo: ProgramMultiFileEmitBuildInfoFileInfo): BuilderState.FileInfo {
        return isString(fileInfo) ?
            { version: fileInfo, signature: fileInfo, affectsGlobalScope: undefined, impliedFormat: undefined } :
            isString(fileInfo.signature) ?
                fileInfo as BuilderState.FileInfo :
                { version: fileInfo.version, signature: fileInfo.signature === false ? undefined : fileInfo.version, affectsGlobalScope: fileInfo.affectsGlobalScope, impliedFormat: fileInfo.impliedFormat };
    }

    export function toBuilderFileEmit(value: ProgramBuilderInfoFilePendingEmit, fullEmitForOptions: BuilderFileEmit): BuilderFileEmit{
        return isNumber(value) ? fullEmitForOptions : value[1] || BuilderFileEmit.Dts;
    }

    export function toProgramEmitPending(value: ProgramBuildInfoBundlePendingEmit, options: CompilerOptions | undefined): BuilderFileEmit | undefined {
        return !value ? getBuilderFileEmit(options || {}) : value;
    }

    export function createBuilderProgramUsingProgramBuildInfo(program: ProgramBuildInfo, buildInfoPath: string, host: ReadBuildProgramHost): EmitAndSemanticDiagnosticsBuilderProgram {
        const buildInfoDirectory = getDirectoryPath(getNormalizedAbsolutePath(buildInfoPath, host.getCurrentDirectory()));
        const getCanonicalFileName = createGetCanonicalFileName(host.useCaseSensitiveFileNames());

        let state: ReusableBuilderProgramState;
        const filePaths = program.fileNames?.map(toPath);
        let filePathsSetList: Set<Path>[] | undefined;
        const latestChangedDtsFile = program.latestChangedDtsFile ? toAbsolutePath(program.latestChangedDtsFile) : undefined;
        if (isProgramBundleEmitBuildInfo(program)) {
            const fileInfos = new Map<Path, BuilderState.FileInfo>();
            program.fileInfos.forEach((fileInfo, index) => {
                const path = toFilePath(index + 1 as ProgramBuildInfoFileId);
                fileInfos.set(path, isString(fileInfo) ? { version: fileInfo, signature: undefined, affectsGlobalScope: undefined, impliedFormat: undefined } : fileInfo);
            });
            state = {
                fileInfos,
                compilerOptions: program.options ? convertToOptionsWithAbsolutePaths(program.options, toAbsolutePath) : {},
                latestChangedDtsFile,
                outSignature: program.outSignature,
                outSignatureDtsMapDiffers: program.outSignatureDtsMapDiffers,
                programEmitPending: program.pendingEmit === undefined ? undefined : toProgramEmitPending(program.pendingEmit, program.options),
            };
        }
        else {
            filePathsSetList = program.fileIdsList?.map(fileIds => new Set(fileIds.map(toFilePath)));
            const fileInfos = new Map<Path, BuilderState.FileInfo>();
            const emitSignatures = program.options?.composite && !outFile(program.options) ? new Map<Path, string>() : undefined;
            program.fileInfos.forEach((fileInfo, index) => {
                const path = toFilePath(index + 1 as ProgramBuildInfoFileId);
                const stateFileInfo = toBuilderStateFileInfoForMultiEmit(fileInfo);
                fileInfos.set(path, stateFileInfo);
                if (emitSignatures && stateFileInfo.signature) emitSignatures.set(path, stateFileInfo.signature);
            });
            program.emitSignatures?.forEach(value => {
                if (isNumber(value)) emitSignatures!.delete(toFilePath(value));
                else emitSignatures!.set(toFilePath(value[0]), value[1]);
            });
            const fullEmitForOptions = program.affectedFilesPendingEmit ? getBuilderFileEmit(program.options || {}) : undefined;
            state = {
                fileInfos,
                compilerOptions: program.options ? convertToOptionsWithAbsolutePaths(program.options, toAbsolutePath) : {},
                referencedMap: toManyToManyPathMap(program.referencedMap),
                exportedModulesMap: toManyToManyPathMap(program.exportedModulesMap),
                semanticDiagnosticsPerFile: program.semanticDiagnosticsPerFile && arrayToMap(program.semanticDiagnosticsPerFile, value => toFilePath(isNumber(value) ? value : value[0]), value => isNumber(value) ? emptyArray : value[1]),
                hasReusableDiagnostic: true,
                affectedFilesPendingEmit: program.affectedFilesPendingEmit && arrayToMap(program.affectedFilesPendingEmit, value => toFilePath(isNumber(value) ? value : value[0]), value => toBuilderFileEmit(value, fullEmitForOptions!)),
                changedFilesSet: new Set(map(program.changeFileSet, toFilePath)),
                latestChangedDtsFile,
                emitSignatures: emitSignatures?.size ? emitSignatures : undefined,
                emitSignatureDtsMapDiffers: program.emitSignatureDtsMapDiffers && new Set(program.emitSignatureDtsMapDiffers.map(toFilePath)),
            };
        }

        return {
            getState: () => state,
            saveEmitState: noop as BuilderProgram["saveEmitState"],
            restoreEmitState: noop,
            getProgram: notImplemented,
            getProgramOrUndefined: returnUndefined,
            releaseProgram: noop,
            getCompilerOptions: () => state.compilerOptions,
            getSourceFile: notImplemented,
            getSourceFiles: notImplemented,
            getOptionsDiagnostics: notImplemented,
            getGlobalDiagnostics: notImplemented,
            getConfigFileParsingDiagnostics: notImplemented,
            getSyntacticDiagnostics: notImplemented,
            getDeclarationDiagnostics: notImplemented,
            getSemanticDiagnostics: notImplemented,
            emit: notImplemented,
            getAllDependencies: notImplemented,
            getCurrentDirectory: notImplemented,
            emitNextAffectedFile: notImplemented,
            getSemanticDiagnosticsOfNextAffectedFile: notImplemented,
            emitBuildInfo: notImplemented,
            close: noop,
            hasChangedEmitSignature: returnFalse,
        };

        function toPath(path: string) {
            return ts.toPath(path, buildInfoDirectory, getCanonicalFileName);
        }

        function toAbsolutePath(path: string) {
            return getNormalizedAbsolutePath(path, buildInfoDirectory);
        }

        function toFilePath(fileId: ProgramBuildInfoFileId) {
            return filePaths[fileId - 1];
        }

        function toFilePathsSet(fileIdsListId: ProgramBuildInfoFileIdListId) {
            return filePathsSetList![fileIdsListId - 1];
        }

        function toManyToManyPathMap(referenceMap: ProgramBuildInfoReferencedMap | undefined): BuilderState.ManyToManyPathMap | undefined {
            if (!referenceMap) {
                return undefined;
            }

            const map = BuilderState.createManyToManyPathMap();
            referenceMap.forEach(([fileId, fileIdListId]) =>
                map.set(toFilePath(fileId), toFilePathsSet(fileIdListId))
            );
            return map;
        }
    }

    export function getBuildInfoFileVersionMap(
        program: ProgramBuildInfo,
        buildInfoPath: string,
        host: Pick<ReadBuildProgramHost, "useCaseSensitiveFileNames" | "getCurrentDirectory">
    ): ESMap<Path, string> {
        const buildInfoDirectory = getDirectoryPath(getNormalizedAbsolutePath(buildInfoPath, host.getCurrentDirectory()));
        const getCanonicalFileName = createGetCanonicalFileName(host.useCaseSensitiveFileNames());
        const fileInfos = new Map<Path, string>();
        program.fileInfos.forEach((fileInfo, index) => {
            const path = toPath(program.fileNames[index], buildInfoDirectory, getCanonicalFileName);
            const version = isString(fileInfo) ? fileInfo : fileInfo.version;
            fileInfos.set(path, version);
        });
        return fileInfos;
    }

    export function createRedirectedBuilderProgram(getState: () => { program?: Program | undefined; compilerOptions: CompilerOptions; }, configFileParsingDiagnostics: readonly Diagnostic[]): BuilderProgram {
        return {
            getState: notImplemented,
            saveEmitState: noop as BuilderProgram["saveEmitState"],
            restoreEmitState: noop,
            getProgram,
            getProgramOrUndefined: () => getState().program,
            releaseProgram: () => getState().program = undefined,
            getCompilerOptions: () => getState().compilerOptions,
            getSourceFile: fileName => getProgram().getSourceFile(fileName),
            getSourceFiles: () => getProgram().getSourceFiles(),
            getOptionsDiagnostics: cancellationToken => getProgram().getOptionsDiagnostics(cancellationToken),
            getGlobalDiagnostics: cancellationToken => getProgram().getGlobalDiagnostics(cancellationToken),
            getConfigFileParsingDiagnostics: () => configFileParsingDiagnostics,
            getSyntacticDiagnostics: (sourceFile, cancellationToken) => getProgram().getSyntacticDiagnostics(sourceFile, cancellationToken),
            getDeclarationDiagnostics: (sourceFile, cancellationToken) => getProgram().getDeclarationDiagnostics(sourceFile, cancellationToken),
            getSemanticDiagnostics: (sourceFile, cancellationToken) => getProgram().getSemanticDiagnostics(sourceFile, cancellationToken),
            emit: (sourceFile, writeFile, cancellationToken, emitOnlyDts, customTransformers) => getProgram().emit(sourceFile, writeFile, cancellationToken, emitOnlyDts, customTransformers),
            emitBuildInfo: (writeFile, cancellationToken) => getProgram().emitBuildInfo(writeFile, cancellationToken),
            getAllDependencies: notImplemented,
            getCurrentDirectory: () => getProgram().getCurrentDirectory(),
            close: noop,
        };

        function getProgram() {
            return Debug.checkDefined(getState().program);
        }
    }
}
