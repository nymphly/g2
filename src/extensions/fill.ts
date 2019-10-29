import { G2Element, Stage, DOM } from "../g2";
import { Defs } from "../svg/Defs";
import { StringOrNumber } from "../Types";

/**
 * DEV NOTES: read mote at 
 *  https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients
 *  https://oreillymedia.github.io/Using_SVG/extras/ch12-bounding-boxes.html
 */
export namespace fill {
    export type LinearGradientStop = {
        offset: StringOrNumber; //Percent value from "0%" to "100%" or 0..1
        color: string;
        opacity?: number; // 0..1 - value.
    };

    export type LinearGradientConfig = {
        attrs?: {
            gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox';
            x1?: StringOrNumber;
            x2?: StringOrNumber;
            y1?: StringOrNumber;
            y2?: StringOrNumber;
            id?: string;
        };
        stops?: Array<LinearGradientStop>;
    };

    /**
     * Linear gradient apply simplification.
     * TODO: Add absolute reference support.
     * @param el - Element to apply linear gradient to.
     * @param config - Confid. @see LinearGradientConfig definition.
     * @param id - Desired ID. Can overried existing one.
     */
    export function linearGradient(
        el: G2Element,
        config: LinearGradientConfig,
        id: string | undefined
    ): string {
        const { stage } = el;
        const { defs } = <{ defs: Defs }>stage;
        const newId: string | undefined = config.attrs ? config.attrs.id || id : id;

        // Checks whether linearGradient with passed id already exists.
        const lgElement: SVGElement = (newId && newId in defs.childrenMap) ?
            defs.childrenMap[newId] :
            DOM.createSVGElement('linearGradient');

        //Removes all stop-nodes.
        while (lgElement.firstChild)
            lgElement.removeChild(lgElement.firstChild);

        //Removes all attributes.
        while (lgElement.attributes.length)
            lgElement.removeAttribute(lgElement.attributes[0].name);

        //Sets attributes to linearGradient.
        DOM.setAttrMap(lgElement, config.attrs);

        //Creates new stops.
        if (config.stops)
            config.stops.forEach(stop => {
                lgElement.appendChild(DOM.createSVGElement('stop', stop));
            });

        //Adds linear gradient, newId still can be undefined.
        const rv = defs.add(lgElement, newId);

        //Applies fill id.
        DOM.attr(<SVGElement>el.domElement, 'fill', `url(#${rv})`);
        return rv;
    }
}
