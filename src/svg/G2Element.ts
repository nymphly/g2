import { Stage } from "./Stage";
import { IElement, IRenderable } from "../Interfaces";
import { utils } from "../utils";
import { Nullable } from "../Types";
import { DOM } from "../utils/DOM";

export abstract class G2Element implements IElement {
    uid: string;
    domElement: Nullable<SVGElement> = null;
    
    constructor(public stage: Stage, public parent: Nullable<G2Element>) {
        this.uid = utils.getUid();
        this.stage.children[this.uid] = this;
        this.domElement = this.createDom();
    }

    public abstract createDom(): SVGElement;

    mark(): void {
        //TODO Implement.
    }

    unmark(): void {
        //TODO Implement.
    }

    public render(): G2Element {
        const el: SVGElement = <SVGElement>this.domElement;
        const parentDom: SVGElement = this.parent ?
            <SVGElement>(<G2Element>this.parent).domElement :
            <SVGElement>this.stage.domElement;
        if (!el.parentElement) {
            DOM.setParent(el, parentDom);
        }
        return this;
    }

    public dispose(): void {
        throw new Error("Method not implemented.");
    }
    
}