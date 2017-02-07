let o = {
    p: 12,
    m(this: typeof o) {
        return this.p;
    }
}
let o2 = {
    p: 12,
    m() {
        let x: typeof o2;
        let y = this.p // nope, any
        return x.p // ok???
    }
    m2() {
        return this.m() // still any!
    }
}

let x = o2.m()
let y = o2.m2()
let p = o2.p
