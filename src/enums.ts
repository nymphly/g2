export namespace enums {
    export const enum Mark {
        DOM_MISSING = 1 << 0, //Do we need this state? By idea, each element has own domElement field.
        ATTRIBUTES = 1 << 1,
        PARENT = 1 << 2,
        CHILDREN = 1 << 3
    }
}