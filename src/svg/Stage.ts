import { IRenderable } from "./../Interfaces";
import { Nullable, StringOrNumber } from "../Types";
import { inject } from "../utils/injections";
import { DOM } from "../utils/DOM";

export class Stage implements IRenderable {
    constructor(
        private container_: Nullable<HTMLElement>,
        private width_: StringOrNumber = '100%',
        private height_: StringOrNumber = '100%') {

    }

    public render(): Stage {

        // let stage: SVGElement = DOM.createSVGElement('svg');
        //     cont.appendChild(stage);
        //     utils.addResizeHandler(cont);


        console.log(this.container_);
        // TODO implement.
        return this;
    }

    public dispose(): void {
        this.container_ = null;
    }
}

/**
 * TODO Test inection, remove it later.
 */
inject(Stage, 'testRender', function(this: Stage): Stage {
    this.render();
    return this;
})
