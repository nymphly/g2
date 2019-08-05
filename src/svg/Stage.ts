import { IRenderable, ITypedStorage, IQueue } from "./../Interfaces";
import { Nullable, StringOrNumber } from "../Types";
import { inject } from "../utils/injections";
import { DOM } from "../utils/DOM";
import { G2Element } from "./G2Element";
import { utils } from "../utils";
import { Layer } from "./Layer";
import { SyncQueue } from "../queue/SyncQueue";
import { AsyncQueue } from "../queue/AsyncQueue";

export class Stage implements IRenderable {
    public domElement: Nullable<SVGElement> = null;
    public children: ITypedStorage<G2Element> = {};
    public container: Nullable<HTMLElement> = null;
    public queue: Nullable<IQueue> = null;

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

    public layer() {
        return new Layer(this, null);
    }

    private renderChildren_(): Promise<any> {
        const proms = [];
        for (let key in this.children) {
            proms.push(this.children[key].render());
        }
        return Promise.all(proms);
    }

    public render(): Promise<any> {
        if (!this.container) {
            //TODO Replace with warning without exception.
            throw 'Stage container is not specified, please fix it.';
        }

        if (this.queue && !this.queue.isEmpty()) {
            if (this.queue instanceof SyncQueue) {
                this.queue.exec();
            } else {
                return (<AsyncQueue>this.queue)
                    .exec()
                    .then(() => this.renderChildren_())
                    .catch(() => this.renderChildren_());
            }
        }
        return this.renderChildren_();
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
