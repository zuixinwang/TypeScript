declare let singleton: [number]
declare let pair: [number, number]
declare let wpair: [number, string]
declare let triple: [number, number, number]
declare function one(n: number): void;
declare function two(n: number, m: number): void;
declare function three(n: number, m: number, total: number): void;

two(...pair)
two(...wpair) // wrong type
three(1, ...pair)
three(1, ...wpair) // wrong type
three(...pair, 1)
three(...wpair, 1) // wrong type

// multiple spreads
three(...singleton, ...pair);
three(...pair, ...singleton);
three(12, ...singleton, ...singleton);
three(...singleton, 12, ...singleton);
three(...singleton, ...singleton, 12);

three(...wpair, ...singleton); // wrong type
three(...pair, ...pair); // wrong arity

// TODO: calls with rests+optionals (exact and inexact), overloads, generics
