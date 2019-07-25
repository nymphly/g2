import { IClass } from "../Interfaces";

export function inject(clz: IClass, methodName: string, fn: Function) {
    //TODO probably, should add check whether methodName already presents in class prototype.
    clz.prototype[methodName] = fn;
}

