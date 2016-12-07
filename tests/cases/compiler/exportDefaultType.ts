// @Filename: a.ts
export default type T = number;

// @Filename: b.ts
import T from "./a";
const x: T = 0;
