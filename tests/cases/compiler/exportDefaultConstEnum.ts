// @Filename: boolean.ts
export default const enum Boolean { TRUE, FALSE, FILE_NOT_FOUND }

// @Filename: user.ts
import Boolean from "./boolean";
const b: Boolean = Boolean.FILE_NOT_FOUND;
