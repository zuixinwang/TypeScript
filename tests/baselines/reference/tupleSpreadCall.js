//// [tupleSpreadCall.ts]
declare let singleton: [number]
declare let pair: [number, number]
declare let wpair: [number, string]
declare let triple: [number, number, number]
declare let ns: number[]
declare function two(n: number, m: number): void;
declare function three(n: number, m: number, total: number): void;
declare function opt2(n: number, m?: number): void;
declare function opt3(n: number, m: number, total?: number): void;
declare function rest(n: number, ...ns: number[]): void;
declare function rest2(n: number, m: number, ...ns: number[]): void;

type First = { first }
type Second = { second }
declare function onetwo(n: number): First;
declare function onetwo(n: number, m: number): Second;

declare function optwothree(n: number, m?: number): First;
declare function optwothree(n: number, m: number, total?: number): Second;

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

//calls with rests (exact and inexact)
rest(...pair);
rest(1, ...pair);

rest2(...singleton); // Expected at least 2, got 1
rest2(...singleton, ...singleton);
rest2(...singleton, ...singleton, ...singleton);
rest2(...singleton, ...singleton, ...triple);

// overloads
declare var first: First;
declare var second: Second;
var first = onetwo(...singleton);
var second = onetwo(...pair);
var second = onetwo(...triple); // Expected 1-2, got 3

var first = optwothree(...singleton);
var first = optwothree(...pair);
var first = optwothree(...pair, ...singleton);
var second = optwothree(...pair, 1);
var first = optwothree(...pair, ...pair);
optwothree(...triple, 1); // expected 1-3, got 4

// TODO: generics


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
//calls with rests (exact and inexact)
rest.apply(void 0, pair);
rest.apply(void 0, [1].concat(pair));
rest2.apply(void 0, singleton); // Expected at least 2, got 1
rest2.apply(void 0, singleton.concat(singleton));
rest2.apply(void 0, singleton.concat(singleton, singleton));
rest2.apply(void 0, singleton.concat(singleton, triple));
var first = onetwo.apply(void 0, singleton);
var second = onetwo.apply(void 0, pair);
var second = onetwo.apply(void 0, triple); // Expected 1-2, got 3
var first = optwothree.apply(void 0, singleton);
var first = optwothree.apply(void 0, pair);
var first = optwothree.apply(void 0, pair.concat(singleton));
var second = optwothree.apply(void 0, pair.concat([1]));
var first = optwothree.apply(void 0, pair.concat(pair));
optwothree.apply(void 0, triple.concat([1])); // expected 1-3, got 4
// TODO: generics
