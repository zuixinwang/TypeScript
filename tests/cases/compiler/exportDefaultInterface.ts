// @Filename: interface.ts
export default interface I {
    x: number;
}

// @Filename: user.ts
import I from "./interface";
const x: I = { x: 0 };
