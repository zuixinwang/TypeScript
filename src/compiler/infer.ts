/** @internal */
namespace ts {
    export function createInference(
        // TODO: Probably can just pass in a checker instance to abbreviate some of this.
        resolveName: (
            location: Node | undefined,
            name: __String,
            meaning: SymbolFlags,
            nameNotFoundMessage: DiagnosticMessage | undefined,
            nameArg: __String | Identifier | undefined,
            isUse: boolean,
            excludeGlobals?: boolean,
            suggestedNameNotFoundMessage?: DiagnosticMessage) => Symbol | undefined,
        getTypeOfExpression: (node: Expression, cache?: boolean) => Type,
        getContextualType: (node: Expression) => Type | undefined,
        getTypeOfPropertyOfType: (type: Type, propertyName: __String) => Type | undefined,
        isLiteralType: (type: Type) => boolean,
        getSignaturesOfType: (type: Type, kind: SignatureKind) => ReadonlyArray<Signature>,
        getTypeAtPosition: (signature: Signature, pos: number) => Type,
        hasCorrectArity: (node: CallLikeExpression, args: ReadonlyArray<Expression>, signature: Signature, signatureHelpTrailingComma?: boolean) => boolean,
        isEmptyObjectType: (type: Type) => boolean,
        createAnonymousType: (symbol: Symbol | undefined, members: SymbolTable, callSignatures: ReadonlyArray<Signature>, constructSignatures: ReadonlyArray<Signature>, stringIndexInfo: IndexInfo | undefined, numberIndexInfo: IndexInfo | undefined) => ResolvedType,
        emptySymbols: UnderscoreEscapedMap<Symbol>,
        jsObjectLiteralIndexInfo: IndexInfo | undefined,
        undefinedType: Type,
        undefinedWideningType: Type,
        numberType: Type,
        stringType: Type,
        getFunctionType: () => ObjectType,
        anyType: Type,
        getBaseTypeOfLiteralType: (type: Type) => Type,
        isOnlyNullOrUndefined: (type: Type) => boolean,
        getUnionType: (types: Type[], subtypeReduction?: UnionReduction) => Type,
        getWidenedType: (type: Type) => Type,
        getUnionOrIntersectionProperty: (type: UnionOrIntersectionType, name: __String) => Symbol | undefined,
        getPropertyOfType: (type: Type, propertyName: __String) => Symbol | undefined,
        createSymbol: (flags: SymbolFlags, name: __String) => TransientSymbol,
        createSignature: (
            declaration: SignatureDeclaration,
            typeParameters: TypeParameter[] | undefined,
            thisParameter: Symbol | undefined,
            parameters: Symbol[],
            resolvedReturnType: Type,
            typePredicate: TypePredicate | undefined,
            minArgumentCount: number,
            hasRestParameter: boolean,
            hasLiteralTypes: boolean,
        ) => Signature,
        isTypeAssignableTo: (source: Type, target: Type) => boolean,
        createArrayType: (elementType: Type) => Type,
        createPromiseType: (type: Type) => Type) {
        return tryKindOfHard;
        function tryKindOfHard(declaration: any): Type | undefined {
            // TODO:
            // 1. variables with no informative usages should (arguably) create unconstrained type parameters instead of failing
            if (!(isParameter(declaration) && isIdentifier(declaration.name) && isApplicableFunctionForInference(declaration.parent) && declaration.parent.body)) {
                return;
            }
            const uses: Identifier[] = [];
            const name = declaration.name.escapedText;
            const walk = function(node: Node): void {
                switch (node.kind) {
                    case SyntaxKind.Identifier:
                        // TODO: This walk needs to be replaced by a text search, one that looks for all parameters and builds a map: decl->uses
                        if ((node as Identifier).escapedText === name && resolveName(node, name, SymbolFlags.Value, undefined, name, /*isUse*/ true)) {
                            uses.push(node as Identifier);
                        }
                        return;
                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.FunctionExpression:
                    case SyntaxKind.ArrowFunction:
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.Constructor:
                        if ((node as FunctionLike).parameters.every(p => !isIdentifier(p) || p.escapedText !== name)) {
                            return forEachChild(node, walk);
                        }
                        else {
                            return;
                        }
                    default:
                        return forEachChild(node, walk);
                }
            }
            forEachChild(declaration.parent.body, walk);
            return inferTypeFromReferences(uses as ReadonlyArray<Identifier>);
        }

        function isApplicableFunctionForInference(declaration: SignatureDeclaration):
            declaration is MethodDeclaration | FunctionDeclaration | ConstructorDeclaration | FunctionExpression | ArrowFunction{
            switch (declaration.kind) {
                case SyntaxKind.FunctionDeclaration:
                case SyntaxKind.MethodDeclaration:
                case SyntaxKind.Constructor:
                case SyntaxKind.FunctionExpression:
                case SyntaxKind.ArrowFunction:
                    return true;
            }
            return false;
        }

        interface CallContext {
            argumentTypes: Type[];
            returnType: UsageContext;
        }

        interface UsageContext {
            isNumber?: boolean;
            isString?: boolean;
            isNumberOrString?: boolean;
            candidateTypes?: Type[];
            properties?: UnderscoreEscapedMap<UsageContext>;
            callContexts?: CallContext[];
            constructContexts?: CallContext[];
            numberIndexContext?: UsageContext;
            stringIndexContext?: UsageContext;
        }

        function inferTypeFromReferences(references: ReadonlyArray<Identifier>): Type | undefined {
            const usageContext: UsageContext = {};
            for (const reference of references) {
                inferTypeFromContext(reference, usageContext);
            }
            return getTypeFromUsageContext(usageContext);
        }

        function inferTypeFromContext(node: Expression, k: UsageContext): void {
            while (isRightSideOfQualifiedNameOrPropertyAccess(node)) {
                node = node.parent as Expression;
            }

            switch (node.parent.kind) {
                case SyntaxKind.PostfixUnaryExpression:
                    k.isNumber = true;
                    break;
                case SyntaxKind.PrefixUnaryExpression:
                    inferTypeFromPrefixUnaryExpressionContext(node.parent as PrefixUnaryExpression, k);
                    break;
                case SyntaxKind.BinaryExpression:
                    inferTypeFromBinaryExpressionContext(node, node.parent as BinaryExpression, k);
                    break;
                case SyntaxKind.CaseClause:
                case SyntaxKind.DefaultClause:
                    inferTypeFromSwitchStatementLabelContext(node.parent as CaseOrDefaultClause, k);
                    break;
                case SyntaxKind.CallExpression:
                case SyntaxKind.NewExpression:
                    inferTypeFromCallExpression((node.parent as CallExpression | NewExpression), (node as Expression), k);
                    break;
                case SyntaxKind.PropertyAccessExpression:
                    inferTypeFromPropertyAccessExpressionContext(node.parent as PropertyAccessExpression, k);
                    break;
                case SyntaxKind.ElementAccessExpression:
                    inferTypeFromPropertyElementExpressionContext(node.parent as ElementAccessExpression, node, k);
                    break;
                case SyntaxKind.VariableDeclaration: {
                    const { name, initializer } = node.parent as VariableDeclaration;
                    if (node === name) {
                        if (initializer) { // This can happen for `let x = null;` which still has an implicit-any error.
                            addCandidateType(k, getTypeOfExpression(initializer));
                        }
                        break;
                    }
                }
                    // falls through
                default:
                    return inferTypeFromContextualType(node, k);
            }
        }

        function inferTypeFromContextualType(node: Expression, k: UsageContext): void {
            if (isExpressionNode(node)) {
                addCandidateType(k, getContextualType(node));
            }
        }

        function inferTypeFromPrefixUnaryExpressionContext(node: PrefixUnaryExpression, k: UsageContext): void {
            switch (node.operator) {
                case SyntaxKind.PlusPlusToken:
                case SyntaxKind.MinusMinusToken:
                case SyntaxKind.MinusToken:
                case SyntaxKind.TildeToken:
                    k.isNumber = true;
                    break;

                case SyntaxKind.PlusToken:
                    k.isNumberOrString = true;
                    break;

                // case SyntaxKind.ExclamationToken:
                // no inferences here;
            }
        }

        function inferTypeFromBinaryExpressionContext(node: Expression, parent: BinaryExpression, k: UsageContext): void {
            switch (parent.operatorToken.kind) {
                // ExponentiationOperator
                case SyntaxKind.AsteriskAsteriskToken:

                // MultiplicativeOperator
                case SyntaxKind.AsteriskToken:
                case SyntaxKind.SlashToken:
                case SyntaxKind.PercentToken:

                // ShiftOperator
                case SyntaxKind.LessThanLessThanToken:
                case SyntaxKind.GreaterThanGreaterThanToken:
                case SyntaxKind.GreaterThanGreaterThanGreaterThanToken:

                // BitwiseOperator
                case SyntaxKind.AmpersandToken:
                case SyntaxKind.BarToken:
                case SyntaxKind.CaretToken:

                // CompoundAssignmentOperator
                case SyntaxKind.MinusEqualsToken:
                case SyntaxKind.AsteriskAsteriskEqualsToken:
                case SyntaxKind.AsteriskEqualsToken:
                case SyntaxKind.SlashEqualsToken:
                case SyntaxKind.PercentEqualsToken:
                case SyntaxKind.AmpersandEqualsToken:
                case SyntaxKind.BarEqualsToken:
                case SyntaxKind.CaretEqualsToken:
                case SyntaxKind.LessThanLessThanEqualsToken:
                case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                case SyntaxKind.GreaterThanGreaterThanEqualsToken:

                // AdditiveOperator
                case SyntaxKind.MinusToken:

                // RelationalOperator
                case SyntaxKind.LessThanToken:
                case SyntaxKind.LessThanEqualsToken:
                case SyntaxKind.GreaterThanToken:
                case SyntaxKind.GreaterThanEqualsToken:
                    const operandType = getTypeOfExpression(parent.left === node ? parent.right : parent.left);
                    if (operandType.flags & TypeFlags.EnumLike) {
                        addCandidateType(k, operandType);
                    }
                    else {
                        k.isNumber = true;
                    }
                    break;

                case SyntaxKind.PlusEqualsToken:
                case SyntaxKind.PlusToken:
                    const otherOperandType = getTypeOfExpression(parent.left === node ? parent.right : parent.left);
                    if (otherOperandType.flags & TypeFlags.EnumLike) {
                        addCandidateType(k, otherOperandType);
                    }
                    else if (otherOperandType.flags & TypeFlags.NumberLike) {
                        k.isNumber = true;
                    }
                    else if (otherOperandType.flags & TypeFlags.StringLike &&
                             (!isLiteralType(otherOperandType) || (otherOperandType as StringLiteralType).value !== "")) {
                            // "" + x is still string | number (and .. uh .. sometimes boolean)
                        k.isString = true;
                    }
                    else {
                        k.isNumberOrString = true;
                    }
                    break;

                //  AssignmentOperators
                case SyntaxKind.EqualsToken:
                case SyntaxKind.EqualsEqualsToken:
                case SyntaxKind.EqualsEqualsEqualsToken:
                case SyntaxKind.ExclamationEqualsEqualsToken:
                case SyntaxKind.ExclamationEqualsToken:
                    addCandidateType(k, getTypeOfExpression(parent.left === node ? parent.right : parent.left));
                    break;

                case SyntaxKind.InKeyword:
                    if (node === parent.left) {
                        k.isString = true;
                    }
                    break;

                // LogicalOperator
                case SyntaxKind.BarBarToken:
                    if (node === parent.left &&
                        (node.parent.parent.kind === SyntaxKind.VariableDeclaration || isAssignmentExpression(node.parent.parent, /*excludeCompoundAssignment*/ true))) {
                        // var x = x || {};
                        // TODO: use getFalsyflagsOfType
                        addCandidateType(k, getTypeOfExpression(parent.right));
                    }
                    break;

                case SyntaxKind.AmpersandAmpersandToken:
                case SyntaxKind.CommaToken:
                case SyntaxKind.InstanceOfKeyword:
                    // nothing to infer here
                    break;
            }
        }

        function inferTypeFromSwitchStatementLabelContext(parent: CaseOrDefaultClause, k: UsageContext): void {
            addCandidateType(k, getTypeOfExpression(parent.parent.parent.expression));
        }

        function inferTypeFromCallExpression(parent: CallExpression | NewExpression, node: Expression, k: UsageContext): void {
            if (parent.expression === node) {
                inferTypeFromCallExpressionContext((node.parent as CallExpression | NewExpression), k);
            }
            else {
                if (parent.arguments) {
                    const i = parent.arguments.indexOf(node);
                    if (i > -1) {
                        inferTypeFromArgumentContext(parent, i, k);
                    }
                }
                else {
                    inferTypeFromContextualType(node, k); // pretty sure that the resulting call to resolveCall tries to get the type of x (while getting the type of x). Instead I should just do the non-resolveCall parts? Maybe a simplified non-overload-aware version?
                }
            }
        }

        function inferTypeFromCallExpressionContext(parent: CallExpression | NewExpression, k: UsageContext): void {
            const callContext: CallContext = {
                argumentTypes: [],
                returnType: {}
            };

            if (parent.arguments) {
                for (const argument of parent.arguments) {
                    callContext.argumentTypes.push(getTypeOfExpression(argument));
                }
            }

            inferTypeFromContext(parent, callContext.returnType);
            if (parent.kind === SyntaxKind.CallExpression) {
                (k.callContexts || (k.callContexts = [])).push(callContext);
            }
            else {
                (k.constructContexts || (k.constructContexts = [])).push(callContext);
            }
        }

        function inferTypeFromArgumentContext(parent: CallExpression | NewExpression, i: number, k: UsageContext): void {
            const t = getTypeOfExpression(parent.expression)
            const allSigs = getSignaturesOfType(t, t.symbol && t.symbol.valueDeclaration && isFunctionLikeDeclaration(t.symbol.valueDeclaration) ? SignatureKind.Call : SignatureKind.Construct);
            const sigs = filter(allSigs, sig => !sig.typeParameters && hasCorrectArity(parent, parent.arguments!, sig));
            for (const sig of sigs) {
                // TODO: This change caused a TON of new errors in npm and small improvement elsewhere
                addCandidateType(k, getTypeAtPosition(sig, i));
            }
        }

        function inferTypeFromPropertyAccessExpressionContext(parent: PropertyAccessExpression, k: UsageContext): void {
            const name = parent.name.escapedText;
            if (!k.properties) {
                k.properties = createUnderscoreEscapedMap<UsageContext>();
            }
            const propertyUsageContext = k.properties.get(name) || { };
            inferTypeFromContext(parent, propertyUsageContext);
            k.properties.set(name, propertyUsageContext);
        }

        function inferTypeFromPropertyElementExpressionContext(parent: ElementAccessExpression, node: Expression, k: UsageContext): void {
            if (node === parent.argumentExpression) {
                k.isNumberOrString = true;
                return;
            }
            else {
                const indexType = getTypeOfExpression(parent.argumentExpression);
                const indexUsageContext = {};
                inferTypeFromContext(parent, indexUsageContext);
                if (indexType.flags & TypeFlags.NumberLike) {
                    k.numberIndexContext = indexUsageContext;
                }
                else {
                    k.stringIndexContext = indexUsageContext;
                }
            }
        }

        /** This is a hack */
        function postConvertType(type: Type) {
            return isEmptyObjectType(type) ? createAnonymousType(type.symbol, emptySymbols, emptyArray, emptyArray, jsObjectLiteralIndexInfo, undefined) :
                type === undefinedType ? undefinedWideningType :
                type;
        }

        function getTypeFromUsageContext(k: UsageContext): Type | undefined {
            // TODO: Probably should combine all inferences instead of strictly ranking them like this
            if (k.isNumberOrString && !k.isNumber && !k.isString) {
                return getUnionType([numberType, stringType]);
            }
            else if (k.isNumber) {
                return numberType;
            }
            else if (k.isString) {
                return stringType;
            }
            // TODO: Need to know whether any candidateTypes came from inference themselves, and intersect with the object type if so
            else if (k.candidateTypes) {
                const u = getUnionType(k.candidateTypes.map(t => postConvertType(getBaseTypeOfLiteralType(t))), UnionReduction.Subtype);
                if (u.flags & TypeFlags.Union && (u as UnionType).types.length > 2 ||
                    isOnlyNullOrUndefined(u) ||
                    couldBeMissingProperties(u, k)) { // couldBeMissingProperties is almost the same as !matchesAllPropertiesOf
                    return undefined;
                }
                return getWidenedType(u);
            }
            return findBuiltinType(k);
        }

        function couldBeMissingProperties(type: Type, k: UsageContext) {
            if (!k.properties) return false;
            let foundMissing = false;
            k.properties.forEach((_, name) => {
                foundMissing = foundMissing || !(type.flags & TypeFlags.Union ? getUnionOrIntersectionProperty(type as UnionType, name) : getPropertyOfType(type, name));
            });
            return foundMissing;
        }

        function addCandidateType(context: UsageContext, type: Type | undefined) {
            if (type && !(type.flags & TypeFlags.Any) && !(type.flags & TypeFlags.Never)) {
                (context.candidateTypes || (context.candidateTypes = [])).push(type);
            }
        }

        function getSignatureFromCallContexts(callContexts: CallContext[]): Signature {
            const parameters: Symbol[] = [];
            // TODO: Use max and fill in undefined in the type instead
            const argLength = Math.min(...callContexts.map(k => k.argumentTypes.length));
            for (let i = 0; i < argLength; i++) {
                const symbol = createSymbol(SymbolFlags.FunctionScopedVariable, `arg${i}` as __String);
                symbol.type = getWidenedType(getUnionType(callContexts.map(k => getBaseTypeOfLiteralType(k.argumentTypes[i]))));
                parameters.push(symbol);
            }
            const returnType = getReturnTypeFromCallContexts(callContexts);
            // TODO: GH#18217
            return createSignature(/*declaration*/ undefined!, /*typeParameters*/ undefined, /*thisParameter*/ undefined, parameters, returnType, /*typePredicate*/ undefined, argLength, /*hasRestParameter*/ false, /*hasLiteralTypes*/ false);
        }

        function getCallableFromCallContexts(callContexts: CallContext[]) {
            return createAnonymousType(undefined, emptySymbols, [getSignatureFromCallContexts(callContexts)], emptyArray, undefined, undefined);
        }

        function getReturnTypeFromCallContexts(callContexts: CallContext[]) {
            return getWidenedType(getUnionType(callContexts.map(k => getBaseTypeOfLiteralType(getTypeFromUsageContext(k.returnType) || anyType)), UnionReduction.Subtype));
        }

        function matchesAllPropertiesOf(t: Type, k: UsageContext) {
            if (!k.properties) return false;
            let result = true;
            k.properties.forEach((prop, name) => {
                // TODO: Special case for callables to simulate resolveCall instead of trying to assign to whole overload set (or just figure out how to make resolveCall work)
                // should start with if (prop.callContexts) ...
                const source = getTypeFromUsageContext(prop);
                const target = getTypeOfPropertyOfType(t, name);
                if (target && prop.callContexts) {
                    const sigs = getSignaturesOfType(target, SignatureKind.Call);
                    result = result && !!sigs.length && some(sigs, sig => isTypeAssignableTo(getCallableFromCallContexts(prop.callContexts!), createAnonymousType(undefined, emptySymbols, [sig], emptyArray, undefined, undefined)));
                }
                else {
                    result = result && !!source && !!target && isTypeAssignableTo(source, target);
                }
            });
            return result;
        }
        function findBuiltinType(k: UsageContext): Type | undefined {
            // TODO: Smarter handling for arrays
            // In general, post-match insertion of type parameters needs to be inferred by scanning the matching method(s) for instances of the bound type parmaeter and inferring that parameter type to it. *maybe* I can reuse the inference algorithm but probably not?
            const matches = [stringType, numberType, createArrayType(anyType), createPromiseType(anyType), getFunctionType()].
                filter(t => matchesAllPropertiesOf(t, k)) // t => [t, countMatchingProperties(k, getPropertiesOfType(t))] as [Type, number]).sort(([_,n1],[__,n2]) => n2 - n1)
            if (0 < matches.length && matches.length < 3) {
                return getUnionType(matches);
            }
        }
    }
}
