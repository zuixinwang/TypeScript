type A = 'a';
type B = 'b';
type C = 'c';
type AB = A | B;
type AC = A | C;
function f<T,U, V> (t: T, u: U, v: V) {
    let t_u: T - U;
    let t_v: T - V;
    let u_t: U - T;

    t_u = t;   // ok
    t_u = t_u; // ok
    t_u = t_v; // error

    var t_a: T - A;
    var t_c: T - C;
    var t_ab: T - AB;

    t_a = t_a; // ok
    t_ab = t_a; // ok
    t_a = t; // ok

    t_a = t_c; // error
    t_a = t_ab; // error
    t = t_a; // error

    var ab_u: AB - U;
    var ab_t: AB - T;
    var a_t: A - T;
    var ac_t: AC - T;

    ab_t = ab_t; // ok
    ab_t = a_t; // error
    a_t = ab_t; // ok
    ab_u = ab_t; // error
    ab_t = ac_t // error
}
