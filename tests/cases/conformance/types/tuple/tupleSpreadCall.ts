declare let singleton: [number]
declare let pair: [number, number]
declare let wpair: [number, string]
declare let triple: [number, number, number]
declare function one(n: number): void;
declare function two(n: number, m: number): void;
declare function three(n: number, m: number, total: number): void;

two(...pair)
two(...wpair)
three(1, ...pair)
three(1, ...wpair)
// syntatically disallowed too early
three(...pair, 1)
three(...wpair, 1)


// TODO: Multiple spreads, calls with rests (exact and inexact), overloads, generics
