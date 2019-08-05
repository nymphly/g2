import { Stage } from "./svg/Stage";
import { Nullable } from "./Types";

/**
 * @fileoverview 
 * Intefaces storage.
 */

export interface IDisposable {
    dispose(): void;
}

export interface IRenderable extends IDisposable {
    queue: Nullable<IQueue>;
    render(): Promise<any>;
    domElement: Nullable<SVGElement>;
}

/**
 * This interface is useful for future development
 * to add required fields like 
 * 
 *      interface IStorage {
 *          typesafeProp1?: number,
 *          requiredProp1: string,
 *          [key: string]: any
 *      }
}
 */
export interface IStorage {
    [key: string]: any;
}

export interface ITypedStorage<T> {
    [key: string]: T;
}

export interface IClass {
    prototype: IStorage;
}

export interface IElement extends IRenderable {
    stage: Stage;
    readonly uid: string;
}

export interface IQueue {
    steps: Array<IQueue|Function>;
    parentQueue: Nullable<IQueue>;
    setSteps(...steps: (IQueue|Function)[]): IQueue;
    cancel(): IQueue;
    isCanceled(val?: boolean): boolean|IQueue;
    dispose(): void;
    isEmpty(): boolean;
    exec(): IQueue|Promise<any> //TODO define any.
}