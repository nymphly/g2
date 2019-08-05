import { IRenderable, ITypedStorage } from "./../Interfaces";
import { Nullable, StringOrNumber } from "../Types";
import { inject } from "../utils/injections";
import { DOM } from "../utils/DOM";
import { G2Element } from "./G2Element";
import { utils } from "../utils";
import { Layer } from "./Layer";

export class Stage implements IRenderable {
    domElement: Nullable<SVGElement> = null;
    children: ITypedStorage<G2Element> = {};
    container: Nullable<HTMLElement> = null;

    constructor(container: HTMLElement, public width: StringOrNumber = '100%', public height: StringOrNumber = '100%') {
        this.container = container;
        this.domElement = DOM.createSVGElement('svg');
        DOM.setAttrMap(this.domElement, {
            xmlns: DOM.SVG_NS,
            border: 0,
            width: this.width,
            height: this.height
        });
        this.container.appendChild(this.domElement);
        // DOM.addResizeHandler(this.container);
        // const self = this;
        // this.container.addEventListener('resize', (e) => {
        //     //TODO implement.
        //     // const el = <SVGElement>self.domElement;
        //     // el.dispatchEvent(new CustomEvent('resize', <CustomEventInit>{width: e.newWidth, height: e.newHeight}));
        // }, { passive: true });
    }

    mark(state: number) {
        //does nothing
    }

    unmark(state: number) {
        //does nothing
    }

    public layer() {
        return new Layer(this, null);
    }

    public render(): Stage {
        if (this.container) {
            for (let key in this.children) {
                this.children[key].render();
            }
            // DOM.addResizeHandler(this.container);
        } else {
            //TODO Replace with warning without exception.
            throw 'Stage container is not specified, please fix it.';
        }

        return this;
    }

    public dispose(): void {
        this.container = null;
    }

}

/**
 * TODO Test inection, remove it later.
 */
inject(Stage, 'testRender', function (this: Stage): Stage {
    this.render();
    return this;
})
