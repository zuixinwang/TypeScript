type A = 'a';
type B = 'b';
type C = 'c';
type AB = A | B;
type AC = A | C;
type BN = { b: number };
function f<T,U, V> (t: T, u: U, v: V) {
    let t_u: T - U;
    let t_v: T - V;
    let u_t: U - T;

    t_u = t;   // ok
    t_u = t_u; // ok
    t_u = t_v; // error
    t_u = u_t; // error

    var t_a: T - A;
    var t_c: T - C;
    var t_ab: T - AB;
    var u_a: U - A;

    t_a = t_a; // ok
    t_ab = t_a; // ok
    t_a = t; // ok

    t_a = t_c; // error
    t_a = t_ab; // error
    t = t_a; // error, T-a is missing 'a' if T contains 'a'
    t_a = u_a; // error

    var ab_u: { a, b } - U;
    var ab_t: { a, b } - T;
    var a_t: { a } - T;
    var ac_t: { a, c } - T;

    ab_t = ab_t; // ok
    a_t = ab_t; // ok
    ab_t = a_t; // error
    ab_u = ab_t; // error
    ab_t = ac_t // error

    t_a = a_t; // error, this makes no sense.
    t_a = t_u; // error, let T and U contain property u. Then T-a has property u but T-U does not.
    t_u = t_a; // error, let T contain property a and U not. Then T-a has no a, but T-U does.

    var bn: BN;
    t_a = bn; // error, we have no idea what T is supposed to be
    bn = t_a; // would be ok only if T extends BN
}
