export namespace utils {
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
}
