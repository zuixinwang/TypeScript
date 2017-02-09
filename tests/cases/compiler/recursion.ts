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

type Propertise<T> = { [K in keyof T]: return T[K] };
type Vue<T extends { data, methods, properties }> = T['data'] & T['methods'] & Propertise<T['properties']>;

let options = {
    data: {
        a: 12,
    },
    methods: {
        m1(this: Vue<typeof options>) {
            this.a;
            this.m2();
            return this.a + this.p.length;
        },
        m2(this: Vue<typeof options>) {
            return this.m1();
        }
    },
    properties: {
        p() { return 'foo' }
    }
}

let app: Vue<typeof options>;
