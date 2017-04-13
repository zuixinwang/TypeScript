// @allowJs: true
// @Filename: whatever.d.ts
// @noEmit: true
export class Cool {
    spot: number;
}
export class World {
    marvelous: string;
}
export function dit(smth: number | '0' | '1' | '2'): Cool & World;
export function keys<T>(t: T): keyof T;
export function single<T, K extends keyof T>(t: T, k: K): T[K];
// TODO: Index types, indexed access types, unions, intersections
export function lift<T>(t: T): T[];

// @Filename: simpleJsTypes.js
import { view, Cool, World, dit, keys, single } from './whatever'
lift({
    a: 12,
    m() { }
});
keys(new Cool());
single(new World(), 'marvelous');
dit(101);

