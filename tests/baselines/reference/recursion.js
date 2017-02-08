//// [recursion.ts]
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


//// [recursion.js]
var o = {
    p: 12,
    m: function () {
        var x = this.m(); // x: number
        var y = this.p; // y: number
        return this.p;
    },
    m2: function () {
        return this.m(); // this: any since it has no annotation
    }
};
var x = o.m(); // x: number
var y = o.m2(); // y: any
var p = o.p; // p: number
