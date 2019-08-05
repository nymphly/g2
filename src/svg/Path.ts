import { G2Element } from "./G2Element";
import { DOM } from "../g2";

export class Path extends G2Element {
    public createDom(): SVGElement {
        return DOM.createSVGElement('path');
    }
}