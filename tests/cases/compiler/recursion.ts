// TODO: Assignability error when the contextual type of data is `U & V`
declare function create<U, V, W>(
    x: {data: U, methods: V, properties: W} as
    {
        data: U,
        methods: { [s: string]: (this: U & V & Propertise<W>, ...args: any[]) => any },
        properties: { [s: string]: (this: U & V & Propertise<W>, ...args: any[]) => any }
    }): U & V & Propertise<W>;
let vue = create({
    data: { x: 1 },
    methods: {
        m() { return 12 /*this.x*/ },
        m2() { return this.m() },
        m3() { return this.p },
    },
    properties: {
        p() { return 'foo' /*this.x*/ },
        p2() { return this.p },
        p3() { return this.m() },
    }
});
/**
   Problem: you need to fix U and V but also make them provide a contextual type that includes the *whole* type.
But transformed, so the *whole* *transformed* type.

So here's an idea: an in and out type. One is used for type inference (to)
and the other is used for contextual typing. Plus maybe type inference from? Not sure about that one.
*/


type Propertise<T> = { [K in keyof T]: return T[K] };
type ExplicitVue<T extends { data, methods, properties }> = T['data'] & T['methods'] & Propertise<T['properties']>;

let options = {
    data: {
        a: 12,
    },
    methods: {
        m1(this: ExplicitVue<typeof options>) {
            this.a;
            this.m2();
            return this.a + this.p.length;
        },
        m2(this: ExplicitVue<typeof options>) {
            return this.m1();
        }
    },
    properties: {
        p() { return 'foo' }
    }
}

let app: ExplicitVue<typeof options>;
/*interface Vue<T> {
    data: any,
    methods: { [s: string]: (this: ExplicitVue, ...args: any[]) => any },
    properties: Propertise<{ [s: string]: (this: ExplicitVue, ...args: any[]) => any }>
}
declare function create<T>(options: Vue<T>): Vue<T>;
create({
    data: { a: 12 },
    methods: {
    },
    properties: {
    }
});
*/
/*
let o = {
    p: 12,
    m(this: typeof o) {
        let x = this.m(); // x: number
        let y = this.p; // y: number
        return this.p;
    },
    m2() {
        return this.m() // this: any since it has no annotation
    }
}

let x = o.m()  // x: number
let y = o.m2() // y: any
let p = o.p    // p: number

*/
