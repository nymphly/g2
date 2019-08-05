import { G2Element } from "./G2Element";
import { DOM } from "../utils/DOM";
import { Path } from "./Path";

export class Layer extends G2Element{
    public createDom(): SVGElement {
        return DOM.createSVGElement('g');
    }

    public path(): Path {
        return new Path(this.stage, this);
    }

    public layer(): Layer {
        return new Layer(this.stage, this);
    }
}