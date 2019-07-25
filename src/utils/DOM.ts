import { G2_GLOBAL } from './../g2';
import { utils } from '../utils';
import { Nullable } from '../Types';
import { IStorage } from '../Interfaces';

export namespace DOM {
    export const SVG_NS = 'http://www.w3.org/2000/svg';

    export function getElement(el: (string|HTMLElement) = 'container'): (HTMLElement|null) {
        return utils.isString(el) ?
            G2_GLOBAL.document.querySelector(`#${el}`) :
            <HTMLElement> el; 
    }

    /**
     * 
     * @param name - Name of element.
     */
    export function createSVGElement(name: string): SVGElement {
        return G2_GLOBAL.document.createElementNS(SVG_NS, name);
    }

    /**
     * 
     * @param el 
     * @param key 
     * @param value 
     */
    export function attr(el: Element, key: string, value?: any): Nullable<Element|string> {
        if (utils.isDef(value)) {
            el.setAttribute(key, value);
            return el;
        }
        return el.getAttribute(key);
    }


    /**
     * 
     * @param el 
     * @param map 
     */
    export function setAttrMap(el: Element, map: Nullable<IStorage>): Element {
        if (map) {
            for (let key in map) {
                attr(el, key, map[key]);
            }
        }
        return el;
    }

    function resizeHandler_(el: Element): void {
        let oldWidth = Number(<Nullable<string>>attr(el, '__px-width'));
        let oldHeight = Number(<Nullable<string>>attr(el, '__px-height'));
        let newWidth = el.clientWidth;
        let newHeight = el.clientHeight;
        if (oldWidth != newWidth || oldHeight != newHeight) {
            setAttrMap(el, {'__px-width': newWidth, '__px-height': newHeight});
            if (!isNaN(oldWidth) && !isNaN(oldHeight)) {
                el.dispatchEvent(new CustomEvent('resize', <CustomEventInit>{width: newWidth, height: newHeight}));
            }
        }
        if (el.dispatchEvent(new CustomEvent('stopResizeMonitor', <CustomEventInit>{}))) {
            //TODO Describe mechanism. This event is needed to stop resize monitor.
            addResizeHandler(el);
        }
    }

    export function addResizeHandler(el: Element): void { //TODO maybe should add native ResizeObserver if supported?
        requestAnimationFrame(() => resizeHandler_(el));
    }
}

