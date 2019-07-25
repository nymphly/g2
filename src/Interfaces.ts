import { Stage } from "./svg/Stage";

/**
 * @fileoverview 
 * Intefaces storage.
 */

export interface IDisposable {
    dispose(): void;
}

export interface IRenderable extends IDisposable {
    render(): IRenderable;
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

export interface IClass {
    prototype: IStorage;
}

export interface IElement extends IRenderable {
    stage: Stage;
    uid: string;
}