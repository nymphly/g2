import { G2Element, DOM } from "../g2";
import { ITypedStorage } from "../Interfaces";
import { utils } from "../utils";

/**
 * DEV NOTE: Read carefully this section:
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs#Usage_notes
 */
export class Defs extends G2Element {
    public childrenMap: ITypedStorage<SVGElement> = {};

    public createDom(): SVGElement {
        return DOM.createSVGElement('defs');
    }

    add(el: SVGElement, id: string = `${DOM.G2_ATTR_PREFIX}${utils.getUid()}`): string {
        if (!(id in this.childrenMap)) {
            this.childrenMap[id] = el;
            DOM.setParent(el, this.domElement);
        }
        DOM.attr(el, 'id', id); //Just to make sure.
        return id;
    }

    get(id: string): SVGElement | undefined {
        return this.childrenMap[id];
    }
}