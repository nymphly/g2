import { getUnpackedSettings } from "http2";
import { IStorage } from "./Interfaces";

export namespace utils {
    let uidCounter_: number = 0;
    const UID_PROPERTY_: string = ('g2_uid_' + ((Math.random() * 1e9) >>> 0));

    /**
     * Basic example is described here: https://www.typescriptlang.org/docs/handbook/advanced-types.html#typeof-type-guards
     * @param val 
     */
    export function isString(val: any): val is string {
        return typeof val === 'string';
    }

    export function isDef(val: any): boolean {
        return val !== void 0;
    }

    export function isFunction(val: any): val is Function {
        return typeof val === 'function';
    }

    export function isAsyncFunction(val: any): boolean {
        return isFunction(val) && val.constructor.name === 'AsyncFunction';
    }

    export function getUid(): string {
        return String(++uidCounter_);
    }

    export function uid(obj: IStorage): string {
        return obj[UID_PROPERTY_] || (obj[UID_PROPERTY_] = getUid());
    }
}
