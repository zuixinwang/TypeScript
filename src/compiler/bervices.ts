/* @internal */
namespace ts.Bumbershoot {

    function createNode<TKind extends SyntaxKind>(kind: TKind, pos: number, end: number, parent: Node): any {
        const node = isNodeKind(kind) ? new NodeObject(kind, pos, end) :
            kind === SyntaxKind.Identifier ? new IdentifierObject(SyntaxKind.Identifier, pos, end) :
                new TokenObject(kind, pos, end);
        node.parent = parent;
        node.flags = parent.flags & NodeFlags.ContextFlags;
        return node;
    }

    export class NodeObject implements Node {
        public kind: SyntaxKind;
        public pos: number;
        public end: number;
        public flags: NodeFlags;
        public parent: Node;
        public symbol: Symbol;
        public jsDoc: JSDoc[];
        public original: Node;
        public transformFlags: TransformFlags;
        private _children: Node[] | undefined;

        constructor(kind: SyntaxKind, pos: number, end: number) {
            this.pos = pos;
            this.end = end;
            this.flags = NodeFlags.None;
            this.transformFlags = undefined!; // TODO: GH#18217
            this.parent = undefined!;
            this.kind = kind;
        }

        private assertHasRealPosition(message?: string) {
            // tslint:disable-next-line:debug-assert
            Debug.assert(!positionIsSynthesized(this.pos) && !positionIsSynthesized(this.end), message || "Node must have a real position for this operation");
        }

        public getSourceFile(): SourceFile {
            return getSourceFileOfNode(this) as SourceFile;
        }

        public getStart(sourceFile?: SourceFileLike, includeJsDocComment?: boolean): number {
            this.assertHasRealPosition();
            return getTokenPosOfNode(this, sourceFile, includeJsDocComment);
        }

        public getFullStart(): number {
            this.assertHasRealPosition();
            return this.pos;
        }

        public getEnd(): number {
            this.assertHasRealPosition();
            return this.end;
        }

        public getWidth(sourceFile?: SourceFile): number {
            this.assertHasRealPosition();
            return this.getEnd() - this.getStart(sourceFile);
        }

        public getFullWidth(): number {
            this.assertHasRealPosition();
            return this.end - this.pos;
        }

        public getLeadingTriviaWidth(sourceFile?: SourceFile): number {
            this.assertHasRealPosition();
            return this.getStart(sourceFile) - this.pos;
        }

        public getFullText(sourceFile?: SourceFile): string {
            this.assertHasRealPosition();
            return (sourceFile || this.getSourceFile()).text.substring(this.pos, this.end);
        }

        public getText(sourceFile?: SourceFile): string {
            this.assertHasRealPosition();
            if (!sourceFile) {
                sourceFile = this.getSourceFile();
            }
            return sourceFile.text.substring(this.getStart(sourceFile), this.getEnd());
        }

        public getChildCount(sourceFile?: SourceFile): number {
            return this.getChildren(sourceFile).length;
        }

        public getChildAt(index: number, sourceFile?: SourceFile): Node {
            return this.getChildren(sourceFile)[index];
        }

        public getChildren(sourceFile?: SourceFileLike): Node[] {
            this.assertHasRealPosition("Node without a real position cannot be scanned and thus has no token nodes - use forEachChild and collect the result if that's fine");
            return this._children || (this._children = createChildren(this, sourceFile));
        }

        public getFirstToken(sourceFile?: SourceFile): Node | undefined {
            this.assertHasRealPosition();
            const children = this.getChildren(sourceFile);
            if (!children.length) {
                return undefined;
            }

            const child = find(children, kid => kid.kind < SyntaxKind.FirstJSDocNode || kid.kind > SyntaxKind.LastJSDocNode)!;
            return child.kind < SyntaxKind.FirstNode ?
                child :
                child.getFirstToken(sourceFile);
        }

        public getLastToken(sourceFile?: SourceFile): Node | undefined {
            this.assertHasRealPosition();
            const children = this.getChildren(sourceFile);

            const child = lastOrUndefined(children);
            if (!child) {
                return undefined;
            }

            return child.kind < SyntaxKind.FirstNode ? child : child.getLastToken(sourceFile);
        }

        public forEachChild<T>(cbNode: (node: Node) => T, cbNodeArray?: (nodes: NodeArray<Node>) => T): T | undefined {
            return forEachChild(this, cbNode, cbNodeArray);
        }
    }

    function createChildren(node: Node, sourceFile: SourceFileLike | undefined): Node[] {
        if (!isNodeKind(node.kind)) {
            return emptyArray;
        }

        const children: Node[] = [];

        if (isJSDocCommentContainingNode(node)) {
            /** Don't add trivia for "tokens" since this is in a comment. */
            node.forEachChild(child => { children.push(child); });
            return children;
        }

        scanner.setText((sourceFile || node.getSourceFile()).text);
        let pos = node.pos;
        const processNode = (child: ts.Node) => {
            addSyntheticNodes(children, pos, child.pos, node);
            children.push(child as Node);
            pos = child.end;
        };
        const processNodes = (nodes: NodeArray<Node>) => {
            addSyntheticNodes(children, pos, nodes.pos, node);
            children.push(createSyntaxList(nodes, node));
            pos = nodes.end;
        };
        // jsDocComments need to be the first children
        forEach((node as JSDocContainer).jsDoc, processNode);
        // For syntactic classifications, all trivia are classified together, including jsdoc comments.
        // For that to work, the jsdoc comments should still be the leading trivia of the first child.
        // Restoring the scanner position ensures that.
        pos = node.pos;
        node.forEachChild(processNode, processNodes);
        addSyntheticNodes(children, pos, node.end, node);
        scanner.setText(undefined);
        return children;
    }

    function addSyntheticNodes(nodes: Push<Node>, pos: number, end: number, parent: Node): void {
        scanner.setTextPos(pos);
        while (pos < end) {
            const token = scanner.scan();
            const textPos = scanner.getTextPos();
            if (textPos <= end) {
                if (token === SyntaxKind.Identifier) {
                    Debug.fail(`Did not expect ${Debug.showSyntaxKind(parent)} to have an Identifier in its trivia`);
                }
                nodes.push(createNode(token, pos, textPos, parent));
            }
            pos = textPos;
            if (token === SyntaxKind.EndOfFileToken) {
                break;
            }
        }
    }

    function createSyntaxList(nodes: NodeArray<Node>, parent: Node): Node {
        const list = createNode(SyntaxKind.SyntaxList, nodes.pos, nodes.end, parent) as any as SyntaxList;
        list._children = [];
        let pos = nodes.pos;
        for (const node of nodes) {
            addSyntheticNodes(list._children, pos, node.pos, parent);
            list._children.push(node);
            pos = node.end;
        }
        addSyntheticNodes(list._children, pos, nodes.end, parent);
        return list as any;
    }

    export class TokenOrIdentifierObject implements Node {
        public kind: SyntaxKind;
        public pos: number;
        public end: number;
        public flags: NodeFlags;
        public parent: Node;
        public symbol: Symbol;
        public jsDocComments: JSDoc[];
        public transformFlags: TransformFlags;

        constructor(pos: number, end: number) {
            // Set properties in same order as NodeObject
            this.pos = pos;
            this.end = end;
            this.flags = NodeFlags.None;
            this.parent = undefined!;
        }

        public getSourceFile(): SourceFile {
            return getSourceFileOfNode(this) as SourceFile;
        }

        public getStart(sourceFile?: SourceFileLike, includeJsDocComment?: boolean): number {
            return getTokenPosOfNode(this, sourceFile, includeJsDocComment);
        }

        public getFullStart(): number {
            return this.pos;
        }

        public getEnd(): number {
            return this.end;
        }

        public getWidth(sourceFile?: SourceFile): number {
            return this.getEnd() - this.getStart(sourceFile);
        }

        public getFullWidth(): number {
            return this.end - this.pos;
        }

        public getLeadingTriviaWidth(sourceFile?: SourceFile): number {
            return this.getStart(sourceFile) - this.pos;
        }

        public getFullText(sourceFile?: SourceFile): string {
            return (sourceFile || this.getSourceFile()).text.substring(this.pos, this.end);
        }

        public getText(sourceFile?: SourceFile): string {
            if (!sourceFile) {
                sourceFile = this.getSourceFile();
            }
            return sourceFile.text.substring(this.getStart(sourceFile), this.getEnd());
        }

        public getChildCount(): number {
            return 0;
        }

        public getChildAt(): Node {
            return undefined!;  // TODO: GH#18217
        }

        public getChildren(): Node[] {
            return this.kind === SyntaxKind.EndOfFileToken ? (this as EndOfFileToken).jsDoc as any || emptyArray : emptyArray;
        }

        public getFirstToken(): Node | undefined {
            return undefined;
        }

        public getLastToken(): Node | undefined {
            return undefined;
        }

        public forEachChild<T>(): T | undefined {
            return undefined;
        }
    }

    export class SymbolObject implements Symbol {
        flags: SymbolFlags;
        escapedName: __String;
        declarations: Declaration[];
        valueDeclaration: Declaration;

        // Undefined is used to indicate the value has not been computed. If, after computing, the
        // symbol has no doc comment, then the empty array will be returned.
        documentationComment?: SymbolDisplayPart[];

        // Undefined is used to indicate the value has not been computed. If, after computing, the
        // symbol has no JSDoc tags, then the empty array will be returned.
        tags?: JSDocTagInfo[];

        constructor(flags: SymbolFlags, name: __String) {
            this.flags = flags;
            this.escapedName = name;
        }

        getFlags(): SymbolFlags {
            return this.flags;
        }

        get name(): string {
            return symbolName(this);
        }

        getEscapedName(): __String {
            return this.escapedName;
        }

        getName(): string {
            return this.name;
        }

        getDeclarations(): Declaration[] | undefined {
            return this.declarations;
        }

        getDocumentationComment(/*checker: TypeChecker | undefined*/): SymbolDisplayPart[] {
            if (!this.documentationComment) {
                this.documentationComment = emptyArray; // Set temporarily to avoid an infinite loop finding inherited docs
                // this.documentationComment = getDocumentationComment(this.declarations, checker);
            }
            return this.documentationComment;
        }

        getJsDocTags(): JSDocTagInfo[] {
            if (this.tags === undefined) {
                // this.tags = JsDoc.getJsDocTagsFromDeclarations(this.declarations);
            }

            return this.tags || [];
        }
    }

    export class TokenObject<TKind extends SyntaxKind> extends TokenOrIdentifierObject implements Token<TKind> {
        public symbol: Symbol;
        public kind: TKind;

        constructor(kind: TKind, pos: number, end: number) {
            super(pos, end);
            this.kind = kind;
        }
    }

    export class IdentifierObject extends TokenOrIdentifierObject implements Identifier {
        public kind: SyntaxKind.Identifier;
        public escapedText: __String;
        public symbol: Symbol;
        public autoGenerateFlags: GeneratedIdentifierFlags;
        _primaryExpressionBrand: any;
        _memberExpressionBrand: any;
        _leftHandSideExpressionBrand: any;
        _updateExpressionBrand: any;
        _unaryExpressionBrand: any;
        _expressionBrand: any;
        _declarationBrand: any;
        /*@internal*/typeArguments: NodeArray<TypeNode>;
        constructor(_kind: SyntaxKind.Identifier, pos: number, end: number) {
            super(pos, end);
        }

        get text(): string {
            return idText(this);
        }
    }
    IdentifierObject.prototype.kind = SyntaxKind.Identifier;

    export class TypeObject implements Type {
        checker: TypeChecker;
        flags: TypeFlags;
        objectFlags?: ObjectFlags;
        id: number;
        symbol: Symbol;
        constructor(checker: TypeChecker, flags: TypeFlags) {
            this.checker = checker;
            this.flags = flags;
        }
        getFlags(): TypeFlags {
            return this.flags;
        }
        getSymbol(): Symbol | undefined {
            return this.symbol;
        }
        getProperties(): Symbol[] {
            return this.checker.getPropertiesOfType(this)as Symbol[];
        }
        getProperty(propertyName: string): Symbol | undefined {
            return this.checker.getPropertyOfType(this, propertyName) as Symbol;
        }
        getApparentProperties(): Symbol[] {
            return this.checker.getAugmentedPropertiesOfType(this)as Symbol[];
        }
        getCallSignatures(): ReadonlyArray<Signature> {
            return this.checker.getSignaturesOfType(this, SignatureKind.Call) as ReadonlyArray<Signature>;
        }
        getConstructSignatures(): ReadonlyArray<Signature> {
            return this.checker.getSignaturesOfType(this, SignatureKind.Construct) as ReadonlyArray<Signature>;
        }
        getStringIndexType(): Type | undefined {
            return this.checker.getIndexTypeOfType(this, IndexKind.String) as Type;
        }
        getNumberIndexType(): Type | undefined {
            return this.checker.getIndexTypeOfType(this, IndexKind.Number) as Type;
        }
        getBaseTypes(): BaseType[] | undefined {
            return this.isClassOrInterface() ? this.checker.getBaseTypes(this) : undefined;
        }
        getNonNullableType(): Type {
            return this.checker.getNonNullableType(this) as Type;
        }
        getConstraint(): Type | undefined {
            return this.checker.getBaseConstraintOfType(this) as Type;
        }
        getDefault(): Type | undefined {
            return this.checker.getDefaultFromTypeParameter(this) as Type;
        }

        isUnion(): this is UnionType {
            return !!(this.flags & TypeFlags.Union);
        }
        isIntersection(): this is IntersectionType {
            return !!(this.flags & TypeFlags.Intersection);
        }
        isUnionOrIntersection(): this is UnionOrIntersectionType {
            return !!(this.flags & TypeFlags.UnionOrIntersection);
        }
        isLiteral(): this is LiteralType {
            return !!(this.flags & TypeFlags.StringOrNumberLiteral);
        }
        isStringLiteral(): this is StringLiteralType {
            return !!(this.flags & TypeFlags.StringLiteral);
        }
        isNumberLiteral(): this is NumberLiteralType {
            return !!(this.flags & TypeFlags.NumberLiteral);
        }
        isTypeParameter(): this is TypeParameter {
            return !!(this.flags & TypeFlags.TypeParameter);
        }
        isClassOrInterface(): this is InterfaceType {
            return !!(getObjectFlags(this) & ObjectFlags.ClassOrInterface);
        }
        isClass(): this is InterfaceType {
            return !!(getObjectFlags(this) & ObjectFlags.Class);
        }
    }

    export class SignatureObject implements Signature {
        checker: TypeChecker;
        declaration: SignatureDeclaration;
        typeParameters?: TypeParameter[];
        parameters: Symbol[];
        thisParameter: Symbol;
        resolvedReturnType: Type;
        resolvedTypePredicate: TypePredicate | undefined;
        minTypeArgumentCount: number;
        minArgumentCount: number;
        hasRestParameter: boolean;
        hasLiteralTypes: boolean;

        // Undefined is used to indicate the value has not been computed. If, after computing, the
        // symbol has no doc comment, then the empty array will be returned.
        documentationComment?: SymbolDisplayPart[];

        // Undefined is used to indicate the value has not been computed. If, after computing, the
        // symbol has no doc comment, then the empty array will be returned.
        jsDocTags?: JSDocTagInfo[];

        constructor(checker: TypeChecker) {
            this.checker = checker;
        }
        getDeclaration(): SignatureDeclaration {
            return this.declaration;
        }
        getTypeParameters(): TypeParameter[] | undefined {
            return this.typeParameters;
        }
        getParameters(): Symbol[] {
            return this.parameters;
        }
        getReturnType(): Type {
            return this.checker.getReturnTypeOfSignature(this) as Type;
        }

        getDocumentationComment(): SymbolDisplayPart[] {
            return this.documentationComment || []; // || (this.documentationComment = getDocumentationComment(singleElementArray(this.declaration), this.checker));
        }

        getJsDocTags(): JSDocTagInfo[] {
            // if (this.jsDocTags === undefined) {
                // this.jsDocTags = this.declaration ? JsDoc.getJsDocTagsFromDeclarations([this.declaration]) : [];
            // }

            return this.jsDocTags || [];
        }
    }

    export class SourceFileObject extends NodeObject implements SourceFile {
        public kind: SyntaxKind.SourceFile;
        public _declarationBrand: any;
        public fileName: string;
        public path: Path;
        public resolvedPath: Path;
        public text: string;
        public scriptSnapshot: IScriptSnapshot;
        public lineMap: ReadonlyArray<number>;

        public statements: NodeArray<Statement>;
        public endOfFileToken: Token<SyntaxKind.EndOfFileToken>;

        public amdDependencies: { name: string; path: string }[];
        public moduleName: string;
        public referencedFiles: FileReference[];
        public typeReferenceDirectives: FileReference[];
        public libReferenceDirectives: FileReference[];

        public syntacticDiagnostics: DiagnosticWithLocation[];
        public parseDiagnostics: DiagnosticWithLocation[];
        public bindDiagnostics: DiagnosticWithLocation[];
        public bindSuggestionDiagnostics?: DiagnosticWithLocation[];

        public isDeclarationFile: boolean;
        public isDefaultLib: boolean;
        public hasNoDefaultLib: boolean;
        public externalModuleIndicator: Node; // The first node that causes this file to be an external module
        public commonJsModuleIndicator: Node; // The first node that causes this file to be a CommonJS module
        public nodeCount: number;
        public identifierCount: number;
        public symbolCount: number;
        public version: string;
        public scriptKind: ScriptKind;
        public languageVersion: ScriptTarget;
        public languageVariant: LanguageVariant;
        public identifiers: Map<string>;
        public nameTable: UnderscoreEscapedMap<number>;
        public resolvedModules: Map<ResolvedModuleFull>;
        public resolvedTypeReferenceDirectiveNames: Map<ResolvedTypeReferenceDirective>;
        public imports: ReadonlyArray<StringLiteralLike>;
        public moduleAugmentations: StringLiteral[];
        private namedDeclarations: Map<Declaration[]>;
        public ambientModuleNames: string[];
        public checkJsDirective: CheckJsDirective | undefined;
        public possiblyContainDynamicImport: boolean;
        public pragmas: PragmaMap;
        public localJsxFactory: EntityName;
        public localJsxNamespace: __String;

        constructor(kind: SyntaxKind, pos: number, end: number) {
            super(kind, pos, end);
        }

        public update(newText: string, textChangeRange: TextChangeRange): SourceFile {
            return updateSourceFile(this, newText, textChangeRange) as SourceFile;
        }

        public getLineAndCharacterOfPosition(position: number): LineAndCharacter {
            return getLineAndCharacterOfPosition(this, position);
        }

        public getLineStarts(): ReadonlyArray<number> {
            return getLineStarts(this);
        }

        public getPositionOfLineAndCharacter(line: number, character: number): number {
            return getPositionOfLineAndCharacter(this, line, character);
        }

        public getLineEndOfPosition(pos: number): number {
            const { line } = this.getLineAndCharacterOfPosition(pos);
            const lineStarts = this.getLineStarts();

            let lastCharPos: number | undefined;
            if (line + 1 >= lineStarts.length) {
                lastCharPos = this.getEnd();
            }
            if (!lastCharPos) {
                lastCharPos = lineStarts[line + 1] - 1;
            }

            const fullText = this.getFullText();
            // if the new line is "\r\n", we should return the last non-new-line-character position
            return fullText[lastCharPos] === "\n" && fullText[lastCharPos - 1] === "\r" ? lastCharPos - 1 : lastCharPos;
        }

        public getNamedDeclarations(): Map<Declaration[]> {
            if (!this.namedDeclarations) {
                this.namedDeclarations = this.computeNamedDeclarations();
            }

            return this.namedDeclarations;
        }

        private computeNamedDeclarations(): Map<Declaration[]> {
            const result = createMultiMap<Declaration>();

            this.forEachChild(visit);

            return result;

            function addDeclaration(declaration: Declaration) {
                const name = getDeclarationName(declaration);
                if (name) {
                    result.add(name, declaration);
                }
            }

            function getDeclarations(name: string) {
                let declarations = result.get(name);
                if (!declarations) {
                    result.set(name, declarations = []);
                }
                return declarations;
            }

            function getDeclarationName(declaration: Declaration) {
                const name = getNonAssignedNameOfDeclaration(declaration);
                return name && (isComputedPropertyName(name) && isPropertyAccessExpression(name.expression) ? (name.expression.name as any).text
                    : isPropertyName(name) ? getNameFromPropertyName(name) : undefined);
            }

            function visit(node: Node): void {
                switch (node.kind) {
                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.FunctionExpression:
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.MethodSignature:
                        const functionDeclaration = <any>node;
                        const declarationName = getDeclarationName(functionDeclaration);

                        if (declarationName) {
                            const declarations = getDeclarations(declarationName);
                            const lastDeclaration = lastOrUndefined(declarations);

                            // Check whether this declaration belongs to an "overload group".
                            if (lastDeclaration && functionDeclaration.parent === lastDeclaration.parent && functionDeclaration.symbol === lastDeclaration.symbol) {
                                // Overwrite the last declaration if it was an overload
                                // and this one is an implementation.
                                if (functionDeclaration.body && !(<FunctionLikeDeclaration>lastDeclaration).body) {
                                    declarations[declarations.length - 1] = functionDeclaration;
                                }
                            }
                            else {
                                declarations.push(functionDeclaration);
                            }
                        }
                        forEachChild(node, visit);
                        break;

                    case SyntaxKind.ClassDeclaration:
                    case SyntaxKind.ClassExpression:
                    case SyntaxKind.InterfaceDeclaration:
                    case SyntaxKind.TypeAliasDeclaration:
                    case SyntaxKind.EnumDeclaration:
                    case SyntaxKind.ModuleDeclaration:
                    case SyntaxKind.ImportEqualsDeclaration:
                    case SyntaxKind.ExportSpecifier:
                    case SyntaxKind.ImportSpecifier:
                    case SyntaxKind.ImportClause:
                    case SyntaxKind.NamespaceImport:
                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                    case SyntaxKind.TypeLiteral:
                        addDeclaration(<any>node);
                        forEachChild(node, visit);
                        break;

                    case SyntaxKind.Parameter:
                        // Only consider parameter properties
                        if (!hasModifier(node, ModifierFlags.ParameterPropertyModifier)) {
                            break;
                        }
                    // falls through
                    case SyntaxKind.VariableDeclaration:
                    case SyntaxKind.BindingElement: {
                        const decl = <any>node;
                        if (isBindingPattern(decl.name)) {
                            forEachChild(decl.name, visit);
                            break;
                        }
                        if (decl.initializer) {
                            visit(decl.initializer);
                        }
                    }
                    // falls through
                    case SyntaxKind.EnumMember:
                    case SyntaxKind.PropertyDeclaration:
                    case SyntaxKind.PropertySignature:
                        addDeclaration(<any>node);
                        break;

                    case SyntaxKind.ExportDeclaration:
                        // Handle named exports case e.g.:
                        //    export {a, b as B} from "mod";
                        if ((<any>node).exportClause) {
                            forEach((<any>node).exportClause!.elements, visit);
                        }
                        break;

                    case SyntaxKind.ImportDeclaration:
                        const importClause = (<any>node).importClause;
                        if (importClause) {
                            // Handle default import case e.g.:
                            //    import d from "mod";
                            if (importClause.name) {
                                addDeclaration(importClause.name);
                            }

                            // Handle named bindings in imports e.g.:
                            //    import * as NS from "mod";
                            //    import {a, b as B} from "mod";
                            if (importClause.namedBindings) {
                                if (importClause.namedBindings.kind === SyntaxKind.NamespaceImport) {
                                    addDeclaration(importClause.namedBindings);
                                }
                                else {
                                    forEach(importClause.namedBindings.elements, visit);
                                }
                            }
                        }
                        break;

                    case SyntaxKind.BinaryExpression:
                        if (getSpecialPropertyAssignmentKind(node as ts.Node as BinaryExpression) !== SpecialPropertyAssignmentKind.None) {
                            addDeclaration(node as ts.Node as BinaryExpression);
                        }
                    // falls through

                    default:
                        forEachChild(node, visit);
                }
            }
        }
    }

    export class SourceMapSourceObject implements SourceMapSource {
        lineMap: number[];
        constructor(public fileName: string, public text: string, public skipTrivia?: (pos: number) => number) { }

        public getLineAndCharacterOfPosition(pos: number): LineAndCharacter {
            return getLineAndCharacterOfPosition(this, pos);
        }
    }




    /* @internal */
    export type ObjectLiteralElementWithName = ObjectLiteralElement & { name: PropertyName; parent: ObjectLiteralExpression | JsxAttributes };

    /**
     * Returns the containing object literal property declaration given a possible name node, e.g. "a" in x = { "a": 1 }
     */
    /* @internal */
    export function getContainingObjectLiteralElement(node: Node): ObjectLiteralElementWithName | undefined {
        const element = getContainingObjectLiteralElementWorker(node);
        return element && (isObjectLiteralExpression(element.parent) || isJsxAttributes(element.parent)) ? element as ObjectLiteralElementWithName : undefined;
    }
    function getContainingObjectLiteralElementWorker(node: Node): ObjectLiteralElement | undefined {
        switch (node.kind) {
            case SyntaxKind.StringLiteral:
            case SyntaxKind.NumericLiteral:
                if (node.parent.kind === SyntaxKind.ComputedPropertyName) {
                    return isObjectLiteralElement(node.parent.parent) ? node.parent.parent : undefined;
                }
            // falls through
            case SyntaxKind.Identifier:
                return isObjectLiteralElement(node.parent) &&
                    (node.parent.parent.kind === SyntaxKind.ObjectLiteralExpression || node.parent.parent.kind === SyntaxKind.JsxAttributes) &&
                    node.parent.name === node as any ? node.parent : undefined;
        }
        return undefined;
    }

    /** Gets all symbols for one property. Does not get symbols for every property. */
    /* @internal */
    export function getPropertySymbolsFromContextualType(node: ObjectLiteralElementWithName, checker: TypeChecker, contextualType: Type, unionSymbolOk: boolean): ReadonlyArray<Symbol> {
        const name = getNameFromPropertyName(node.name);
        if (!name) return emptyArray;
        if (!contextualType.isUnion()) {
            const symbol = contextualType.getProperty(name);
            return symbol ? [symbol] : emptyArray;
        }

        const discriminatedPropertySymbols = mapDefined(contextualType.types, t => isObjectLiteralExpression(node.parent) && checker.isTypeInvalidDueToUnionDiscriminant(t, node.parent) ? undefined : (t as any).getProperty(name));
        if (unionSymbolOk && (discriminatedPropertySymbols.length === 0 || discriminatedPropertySymbols.length === contextualType.types.length)) {
            const symbol = contextualType.getProperty(name);
            if (symbol) return [symbol];
        }
        if (discriminatedPropertySymbols.length === 0) {
            // Bad discriminant -- do again without discriminating
            return mapDefined(contextualType.types, t => (t as any).getProperty(name));
        }
        return discriminatedPropertySymbols;
    }
    /* @internal */
    /** Names in the name table are escaped, so an identifier `__foo` will have a name table entry `___foo`. */
    export function getNameTable(sourceFile: SourceFile): UnderscoreEscapedMap<number> {
        if (!sourceFile.nameTable) {
            initializeNameTable(sourceFile);
        }

        return sourceFile.nameTable!; // TODO: GH#18217
    }

    function initializeNameTable(sourceFile: SourceFile): void {
        const nameTable = sourceFile.nameTable = createUnderscoreEscapedMap<number>();
        (sourceFile as any).forEachChild(function walk(node: any) {
            if (isIdentifier(node) && node.escapedText || isStringOrNumericLiteral(node) && literalIsName(node)) {
                const text = getEscapedTextOfIdentifierOrLiteral(node);
                nameTable.set(text, nameTable.get(text) === undefined ? node.pos : -1);
            }

            forEachChild(node, walk);
            if (hasJSDocNodes(node)) {
                for (const jsDoc of node.jsDoc!) {
                    forEachChild(jsDoc, walk);
                }
            }
        });
    }

    /**
     * We want to store any numbers/strings if they were a name that could be
     * related to a declaration.  So, if we have 'import x = require("something")'
     * then we want 'something' to be in the name table.  Similarly, if we have
     * "a['propname']" then we want to store "propname" in the name table.
     */
    function literalIsName(node: StringLiteral | NumericLiteral): boolean {
        return isDeclarationName(node) ||
            node.parent.kind === SyntaxKind.ExternalModuleReference ||
            isArgumentOfElementAccessExpression(node as any) ||
            isLiteralComputedPropertyDeclarationName(node);
    }

    function isArgumentOfElementAccessExpression(node: Node) {
        return node &&
            node.parent &&
            node.parent.kind === SyntaxKind.ElementAccessExpression &&
            (<any>node.parent).argumentExpression === node;
    }
}
