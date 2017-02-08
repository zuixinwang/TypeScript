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
