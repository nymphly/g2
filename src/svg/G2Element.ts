import { Stage } from "./Stage";
import { IElement, IRenderable, IQueue } from "../Interfaces";
import { utils } from "../utils";
import { Nullable } from "../Types";
import { DOM } from "../utils/DOM";
import { SyncQueue } from "../queue/SyncQueue";
import { AsyncQueue } from "../queue/AsyncQueue";

export abstract class G2Element implements IElement {
    uid: string;
    public domElement: Nullable<SVGElement> = null;
    public queue: Nullable<IQueue> = null;
    
    constructor(public stage: Stage, public parent?: Nullable<G2Element>) {
        this.uid = utils.getUid();
        this.stage.children[this.uid] = this;
        this.domElement = this.createDom();

        const el: SVGElement = <SVGElement>this.domElement;
        const parentDom: SVGElement = this.parent ?
            <SVGElement>(<G2Element>this.parent).domElement :
            <SVGElement>this.stage.domElement;
        if (!el.parentElement) {
            DOM.setParent(el, parentDom);
        }
    }

    public abstract createDom(): SVGElement;

    public render(): Promise<any> {
        /*
            TODO: think of nullifying queue on render to avoid
            queue execuon on next rendering.
         */
        if (this.queue && !this.queue.isEmpty()) {
            if (this.queue instanceof SyncQueue) {
                this.queue.exec();
            } else {
                return (<AsyncQueue>this.queue).exec();
            }
        }
        return Promise.resolve();
    }

    public dispose(): void {
        throw new Error('Unimplemented G2Element disposing.');
    }
    
}