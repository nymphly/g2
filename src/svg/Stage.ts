import { IRenderable } from "./../Interfaces";
import { Nullable, StringOrNumber } from "../Types";

export class Stage implements IRenderable {
    constructor(
        private container_: Nullable<HTMLElement>,
        private width_: StringOrNumber = '100%',
        private height_: StringOrNumber = '100%') {

    }

    render(): Stage {
        console.log(this.container_);
        // TODO implement.
        return this;
    }

    dispose(): void {
        this.container_ = null;
    }
}