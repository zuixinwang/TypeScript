//// [tupleSpreadCall.ts]
declare let singleton: [number]
declare let pair: [number, number]
declare let wpair: [number, string]
declare let triple: [number, number, number]
declare let ns: number[]
declare function one(n: number): void;
declare function two(n: number, m: number): void;
declare function three(n: number, m: number, total: number): void;
declare function opt2(n: number, m?: number): void;
declare function opt3(n: number, m: number, total?: number): void;
declare function rest(n: number, ...ns: number[]): void;

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
three(...pair, ...pair); // Expected 3, got 4

// optionals (exact and inexact)
opt2(...pair);
opt2(1, ...singleton);
opt2(...pair, 1); // Expected 1-2, got 3
opt2(...singleton);

opt3(...singleton); // Expected 2-3, got 1
opt3(...singleton, ...pair);

// OK: arrays of any length are spreadable into optional arguments
opt2(...triple);
opt2(1, ...pair);
opt3(...singleton, 2, ...triple);
opt3(2, ...triple);
opt3(2, ...singleton, ...triple);
opt3(2, 3, ...triple);
opt3(...singleton, 2, ...ns);
opt3(2, ...singleton, ...ns);

// TODO: calls with rests (exact and inexact), overloads, generics


//// [tupleSpreadCall.js]
two.apply(void 0, pair);
two.apply(void 0, wpair); // wrong type
three.apply(void 0, [1].concat(pair));
three.apply(void 0, [1].concat(wpair)); // wrong type
three.apply(void 0, pair.concat([1]));
three.apply(void 0, wpair.concat([1])); // wrong type
// multiple spreads
three.apply(void 0, singleton.concat(pair));
three.apply(void 0, pair.concat(singleton));
three.apply(void 0, [12].concat(singleton, singleton));
three.apply(void 0, singleton.concat([12], singleton));
three.apply(void 0, singleton.concat(singleton, [12]));
three.apply(void 0, wpair.concat(singleton)); // wrong type
three.apply(void 0, pair.concat(pair)); // Expected 3, got 4
// optionals (exact and inexact)
opt2.apply(void 0, pair);
opt2.apply(void 0, [1].concat(singleton));
opt2.apply(void 0, pair.concat([1])); // Expected 1-2, got 3
opt2.apply(void 0, singleton);
opt3.apply(void 0, singleton); // Expected 2-3, got 1
opt3.apply(void 0, singleton.concat(pair));
// OK: arrays of any length are spreadable into optional arguments
opt2.apply(void 0, triple);
opt2.apply(void 0, [1].concat(pair));
opt3.apply(void 0, singleton.concat([2], triple));
opt3.apply(void 0, [2].concat(triple));
opt3.apply(void 0, [2].concat(singleton, triple));
opt3.apply(void 0, [2, 3].concat(triple));
opt3.apply(void 0, singleton.concat([2], ns));
opt3.apply(void 0, [2].concat(singleton, ns));
// TODO: calls with rests (exact and inexact), overloads, generics
