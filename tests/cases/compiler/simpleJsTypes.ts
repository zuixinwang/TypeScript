// @allowJs: true
// @Filename: whatever.d.ts
// @noEmit: true
export interface Cool {
    a: number;
}
export function view<T>(t: T): T;

// @Filename: simpleJsTypes.js
import { view } from './whatever'
view({
    a: 12,
    m() { return this.a + 1 }
});
