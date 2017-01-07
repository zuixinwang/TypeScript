type A = 'a';
type B = 'b';
type C = 'c';
type AB = A | B;
let nothing: A - 'a';
let none: AB - 'a' | 'b';
let over: 'a' - 'a' | 'b';
let under: 'a' | 'b' - 'a';
let partial: 'a' | 'b' - 'b' | 'd';
let empty: AB - AB;
let nope: string - string;
let nope2: 'a' | 'b' - string;
let nope3: string - 'a' | 'b';

// TODO: Require a constraint of extends string?
// or keyof X? Check the mapped type code to decide what to do
function f<T,U> (t: T, u: U) {
    let tsubu: T - U;
    return tsubu;
}

const x = f<'a' | 'b', 'b' | 'd'>('a', 'b');
