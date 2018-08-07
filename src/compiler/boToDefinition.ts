/* @internal */
namespace ts.Bumbershoot.GoToDefinition {
    export function getDefinitionAtPosition(program: Program, sourceFile: SourceFile, position: number): DefinitionInfo[] | undefined {
        const reference = getReferenceAtPosition(sourceFile, position, program);
        if (reference) {
            return [getDefinitionInfoForFileReference(reference.fileName, reference.file.fileName)];
        }

        const node = getTouchingPropertyName(sourceFile, position) as any;
        if (node === sourceFile as any) {
            return undefined;
        }
        const { parent } = node;

        // Labels
        if (isJumpStatementTarget(node)) {
            const label = getTargetLabel(node.parent as any, node.text);
            return label ? [createDefinitionInfoFromName(label as any, ScriptElementKind.label, node.text, /*containerName*/ undefined!)] : undefined; // TODO: GH#18217
        }

        const typeChecker = program.getTypeChecker();
        const symbol = getSymbol(node, typeChecker);

        // Could not find a symbol e.g. node is string or number keyword,
        // or the symbol was an internal symbol and does not have a declaration e.g. undefined symbol
        if (!symbol) {
            return getDefinitionInfoForIndexSignatures(node, typeChecker);
        }

        const calledDeclaration = tryGetSignatureDeclaration(typeChecker, node);
        // Don't go to the component constructor definition for a JSX element, just go to the component definition.
        if (calledDeclaration && !(isJsxOpeningLikeElement(node.parent) && isConstructorDeclaration(calledDeclaration))) {
            const sigInfo = createDefinitionFromSignatureDeclaration(typeChecker, calledDeclaration);
            // For a function, if this is the original function definition, return just sigInfo.
            // If this is the original constructor definition, parent is the class.
            if (typeChecker.getRootSymbols(symbol).some(s => symbolMatchesSignature(s as Symbol, calledDeclaration)) ||
                // TODO: GH#25533 Following check shouldn't be necessary if 'require' is an alias
                symbol.declarations && symbol.declarations.some(d => isVariableDeclaration(d) && !!d.initializer && isRequireCall(d.initializer, /*checkArgumentIsStringLiteralLike*/ false))) {
                return [sigInfo];
            }
            else {
                const defs = getDefinitionFromSymbol(typeChecker, symbol, node) || emptyArray;
                // For a 'super()' call, put the signature first, else put the variable first.
                return node.kind === SyntaxKind.SuperKeyword ? [sigInfo, ...defs] : [...defs, sigInfo];
            }
        }

        // Because name in short-hand property assignment has two different meanings: property name and property value,
        // using go-to-definition at such position should go to the variable declaration of the property value rather than
        // go to the declaration of the property name (in this case stay at the same position). However, if go-to-definition
        // is performed at the location of property access, we would like to go to definition of the property in the short-hand
        // assignment. This case and others are handled by the following code.
        if (node.parent.kind === SyntaxKind.ShorthandPropertyAssignment) {
            const shorthandSymbol = typeChecker.getShorthandAssignmentValueSymbol(symbol.valueDeclaration);
            return shorthandSymbol ? shorthandSymbol.declarations.map(decl => createDefinitionInfo(decl, typeChecker, shorthandSymbol as Symbol, node)) : [];
        }

        // If the node is the name of a BindingElement within an ObjectBindingPattern instead of just returning the
        // declaration the symbol (which is itself), we should try to get to the original type of the ObjectBindingPattern
        // and return the property declaration for the referenced property.
        // For example:
        //      import('./foo').then(({ b/*goto*/ar }) => undefined); => should get use to the declaration in file "./foo"
        //
        //      function bar<T>(onfulfilled: (value: T) => void) { //....}
        //      interface Test {
        //          pr/*destination*/op1: number
        //      }
        //      bar<Test>(({pr/*goto*/op1})=>{});
        if (isPropertyName(node) && isBindingElement(parent) && isObjectBindingPattern(parent.parent) &&
            (node === (parent.propertyName || parent.name))) {
            const name = getNameFromPropertyName(node);
            const type = typeChecker.getTypeAtLocation(parent.parent);
            return name === undefined ? emptyArray : flatMap((type as Type).isUnion() ? (type as any).types : [type], t => {
                const prop = (t as any).getProperty(name);
                return prop && getDefinitionFromSymbol(typeChecker, prop, node as any);
            });
        }

        // If the current location we want to find its definition is in an object literal, try to get the contextual type for the
        // object literal, lookup the property symbol in the contextual type, and use this for goto-definition.
        // For example
        //      interface Props{
        //          /*first*/prop1: number
        //          prop2: boolean
        //      }
        //      function Foo(arg: Props) {}
        //      Foo( { pr/*1*/op1: 10, prop2: true })
        const element = getContainingObjectLiteralElement(node);
        if (element) {
            const contextualType = element && typeChecker.getContextualType(element.parent);
            if (contextualType) {
                return flatMap(getPropertySymbolsFromContextualType(element, typeChecker, contextualType as Type, /*unionSymbolOk*/ false), propertySymbol =>
                    getDefinitionFromSymbol(typeChecker, propertySymbol, node));
            }
        }
        return getDefinitionFromSymbol(typeChecker, symbol, node);
    }

    /**
     * True if we should not add definitions for both the signature symbol and the definition symbol.
     * True for `const |f = |() => 0`, false for `function |f() {} const |g = f;`.
     */
    function symbolMatchesSignature(s: Symbol, calledDeclaration: SignatureDeclaration) {
        return s === calledDeclaration.symbol || s === calledDeclaration.symbol.parent ||
            !isCallLikeExpression(calledDeclaration.parent) && s === calledDeclaration.parent.symbol;
    }

    export function getReferenceAtPosition(sourceFile: SourceFile, position: number, program: Program): { fileName: string, file: SourceFile } | undefined {
        const referencePath = findReferenceInPosition(sourceFile.referencedFiles, position);
        if (referencePath) {
            const file = tryResolveScriptReference(program, sourceFile, referencePath) as SourceFile;
            return file && { fileName: referencePath.fileName, file };
        }

        const typeReferenceDirective = findReferenceInPosition(sourceFile.typeReferenceDirectives, position);
        if (typeReferenceDirective) {
            const reference = program.getResolvedTypeReferenceDirectives().get(typeReferenceDirective.fileName);
            const file = reference && program.getSourceFile(reference.resolvedFileName!) as SourceFile; // TODO:GH#18217
            return file && { fileName: typeReferenceDirective.fileName, file };
        }

        const libReferenceDirective = findReferenceInPosition(sourceFile.libReferenceDirectives, position);
        if (libReferenceDirective) {
            const file = program.getLibFileFromReference(libReferenceDirective) as SourceFile;
            return file && { fileName: libReferenceDirective.fileName, file };
        }

        return undefined;
    }

    /// Goto type
    export function getTypeDefinitionAtPosition(typeChecker: TypeChecker, sourceFile: SourceFile, position: number): DefinitionInfo[] | undefined {
        const node = getTouchingPropertyName(sourceFile, position) as any;
        if (node === sourceFile) {
            return undefined;
        }

        const symbol = typeChecker.getSymbolAtLocation(node);
        const type = symbol && typeChecker.getTypeOfSymbolAtLocation(symbol, node) as any;
        return type && flatMap(type.isUnion() && !(type.flags & TypeFlags.Enum) ? type.types : [type], (t: any) =>
            t.symbol && getDefinitionFromSymbol(typeChecker, t.symbol, node));
    }

    export function getDefinitionAndBoundSpan(program: Program, sourceFile: SourceFile, position: number): DefinitionInfoAndBoundSpan | undefined {
        const definitions = getDefinitionAtPosition(program, sourceFile, position);

        if (!definitions || definitions.length === 0) {
            return undefined;
        }

        // Check if position is on triple slash reference.
        const comment = findReferenceInPosition(sourceFile.referencedFiles, position) ||
            findReferenceInPosition(sourceFile.typeReferenceDirectives, position) ||
            findReferenceInPosition(sourceFile.libReferenceDirectives, position);

        if (comment) {
            return { definitions, textSpan: createTextSpanFromRange(comment) };
        }

        const node = getTouchingPropertyName(sourceFile, position);
        const textSpan = createTextSpan(node.getStart(), node.getWidth());

        return { definitions, textSpan };
    }

    // At 'x.foo', see if the type of 'x' has an index signature, and if so find its declarations.
    function getDefinitionInfoForIndexSignatures(node: any, checker: TypeChecker): DefinitionInfo[] | undefined {
        if (!isPropertyAccessExpression(node.parent) || node.parent.name !== node) return;
        const type = checker.getTypeAtLocation(node.parent.expression) as Type;
        return mapDefined(type.isUnionOrIntersection() ? type.types : [type], nonUnionType => {
            const info = checker.getIndexInfoOfType(nonUnionType, IndexKind.String);
            return info && info.declaration && createDefinitionFromSignatureDeclaration(checker, info.declaration);
        });
    }

    function getSymbol(node: Node, checker: TypeChecker): Symbol | undefined {
        const symbol = checker.getSymbolAtLocation(node) as any;
        // If this is an alias, and the request came at the declaration location
        // get the aliased symbol instead. This allows for goto def on an import e.g.
        //   import {A, B} from "mod";
        // to jump to the implementation directly.
        if (symbol && symbol.flags & SymbolFlags.Alias && shouldSkipAlias(node, symbol.declarations[0])) {
            const aliased = checker.getAliasedSymbol(symbol);
            if (aliased.declarations) {
                return aliased as any;
            }
        }
        return symbol;
    }

    // Go to the original declaration for cases:
    //
    //   (1) when the aliased symbol was declared in the location(parent).
    //   (2) when the aliased symbol is originating from an import.
    //
    function shouldSkipAlias(node: Node, declaration: Node): boolean {
        if (node.kind !== SyntaxKind.Identifier) {
            return false;
        }
        if (node.parent === declaration) {
            return true;
        }
        switch (declaration.kind) {
            case SyntaxKind.ImportClause:
            case SyntaxKind.ImportEqualsDeclaration:
                return true;
            case SyntaxKind.ImportSpecifier:
                return declaration.parent.kind === SyntaxKind.NamedImports;
            default:
                return false;
        }
    }

    function getDefinitionFromSymbol(typeChecker: TypeChecker, symbol: Symbol, node: Node): DefinitionInfo[] | undefined {
        return getConstructSignatureDefinition() || getCallSignatureDefinition() || map(symbol.declarations, declaration => createDefinitionInfo(declaration, typeChecker, symbol, node));

        function getConstructSignatureDefinition(): DefinitionInfo[] | undefined {
            // Applicable only if we are in a new expression, or we are on a constructor declaration
            // and in either case the symbol has a construct signature definition, i.e. class
            if (symbol.flags & SymbolFlags.Class && (isNewExpressionTarget(node) || node.kind === SyntaxKind.ConstructorKeyword)) {
                const cls = find(symbol.declarations, isClassLike) || Debug.fail("Expected declaration to have at least one class-like declaration");
                return getSignatureDefinition(cls.members, /*selectConstructors*/ true);
            }
        }

        function getCallSignatureDefinition(): DefinitionInfo[] | undefined {
            return isCallOrNewExpressionTarget(node) || isNameOfFunctionDeclaration(node)
                ? getSignatureDefinition(symbol.declarations, /*selectConstructors*/ false)
                : undefined;
        }

        function getSignatureDefinition(signatureDeclarations: ReadonlyArray<Declaration> | undefined, selectConstructors: boolean): DefinitionInfo[] | undefined {
            if (!signatureDeclarations) {
                return undefined;
            }
            const declarations = signatureDeclarations.filter(selectConstructors ? isConstructorDeclaration : isFunctionLike);
            return declarations.length
                ? [createDefinitionInfo(find(declarations, d => !!(<FunctionLikeDeclaration>d).body) || last(declarations), typeChecker, symbol, node)]
                : undefined;
        }
    }

    /** Creates a DefinitionInfo from a Declaration, using the declaration's name if possible. */
    function createDefinitionInfo(declaration: Declaration, checker: TypeChecker, symbol: Symbol, node: Node): DefinitionInfo {
        const symbolName = checker.symbolToString(symbol); // Do not get scoped name, just the name of the symbol
        const symbolKind = SymbolDisplay.getSymbolKind(checker, symbol, node);
        const containerName = symbol.parent ? checker.symbolToString(symbol.parent, node) : "";
        return createDefinitionInfoFromName(declaration, symbolKind, symbolName, containerName);
    }

    /** Creates a DefinitionInfo directly from the name of a declaration. */
    function createDefinitionInfoFromName(declaration: Declaration, symbolKind: ScriptElementKind, symbolName: string, containerName: string): DefinitionInfo {
        const name = (getNameOfDeclaration(declaration) || declaration) as any;
        const sourceFile = name.getSourceFile();
        return {
            fileName: sourceFile.fileName,
            textSpan: createTextSpanFromNode(name, sourceFile),
            kind: symbolKind,
            name: symbolName,
            containerKind: undefined!, // TODO: GH#18217
            containerName
        };
    }

    function createDefinitionFromSignatureDeclaration(typeChecker: TypeChecker, decl: SignatureDeclaration): DefinitionInfo {
        return createDefinitionInfo(decl, typeChecker, decl.symbol as Symbol, decl as any);
    }

    export function findReferenceInPosition(refs: ReadonlyArray<FileReference>, pos: number): FileReference | undefined {
        return find(refs, ref => textRangeContainsPositionInclusive(ref, pos));
    }

    function getDefinitionInfoForFileReference(name: string, targetFileName: string): DefinitionInfo {
        return {
            fileName: targetFileName,
            textSpan: createTextSpanFromBounds(0, 0),
            kind: ScriptElementKind.scriptElement,
            name,
            containerName: undefined!,
            containerKind: undefined!, // TODO: GH#18217
        };
    }

    /** Returns a CallLikeExpression where `node` is the target being invoked. */
    function getAncestorCallLikeExpression(node: Node): CallLikeExpression | undefined {
        const target = climbPastManyPropertyAccesses(node) as any;
        const callLike = target.parent;
        return callLike && isCallLikeExpression(callLike) && getInvokedExpression(callLike) === target ? callLike : undefined;
    }

    function climbPastManyPropertyAccesses(node: Node): Node {
        return isRightSideOfPropertyAccess(node) ? climbPastManyPropertyAccesses(node.parent as Node) : node;
    }

    function tryGetSignatureDeclaration(typeChecker: TypeChecker, node: Node): SignatureDeclaration | undefined {
        const callLike = getAncestorCallLikeExpression(node);
        const signature = callLike && typeChecker.getResolvedSignature(callLike);
        // Don't go to a function type, go to the value having that type.
        return tryCast(signature && signature.declaration, (d): d is SignatureDeclaration => isFunctionLike(d) && !isFunctionTypeNode(d));
    }
}
