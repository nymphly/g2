import { G2_GLOBAL } from './../g2';
import { utils } from '../utils';
import { Nullable } from '../Types';
import { IStorage } from '../Interfaces';

export namespace DOM {
    export const SVG_NS: string = 'http://www.w3.org/2000/svg';
    export const G2_ATTR_PREFIX: string = 'g2-';

    export function getElement(el: (string|HTMLElement) = 'container'): (HTMLElement|null) {
        return utils.isString(el) ?
            G2_GLOBAL.document.querySelector(`#${el}`) :
            <HTMLElement> el; 
    }

    /**
     * 
     * @param name - Tag.
     */
    export function createSVGElement(name: string): SVGElement {
        return G2_GLOBAL.document.createElementNS(SVG_NS, name);
    }

    export function attr(el: Element, key: string, value?: any, addPrefix?: boolean): Nullable<Element|string> {
        if (utils.isDef(value)) {
            el.setAttribute(`${addPrefix ? G2_ATTR_PREFIX : ''}${key}`, value);
            return el;
        }
        return el.getAttribute(`${addPrefix ? G2_ATTR_PREFIX : ''}${key}`);
    }

    export function setAttrMap(el: Element, map: Nullable<IStorage>, addPrefix?: boolean): Element {
        if (map) {
            for (let key in map) { //This cycle does not create iterator, it's faster then forOf.
                if (key.indexOf('g2_uid_')) //Skipping potential uid.
                    attr(el, key, map[key], addPrefix);
            }
        }
        return el;
    }

    function resizeHandler_(el: Element): void {
        new Promise((resolve, reject) => {
            let oldWidth = Number(<Nullable<string>>attr(el, 'px-width', void 0, true));
            let oldHeight = Number(<Nullable<string>>attr(el, 'px-height', void 0, true));
            let newWidth = el.clientWidth;
            let newHeight = el.clientHeight;
            if (oldWidth != newWidth || oldHeight != newHeight) {
                setAttrMap(el, {'px-width': newWidth, 'px-height': newHeight}, true);
                if (!isNaN(oldWidth) && !isNaN(oldHeight)) {
                    el.dispatchEvent(new CustomEvent('resize', <CustomEventInit>{width: newWidth, height: newHeight}));
                }
            }
            if (el.dispatchEvent(new CustomEvent('stopResizeMonitor', <CustomEventInit>{}))) {
                /*
                    To stop resize monitor it's enough to catch 'stopResizeMonitor' event
                    and prevent it. el.dispatchEvent('stopResizeMonitor') will return false
                    and addResizeHandler(el) will not be called.
                 */
                resolve();
            }
        })
        .then(() => {
            addResizeHandler(el);
        })        
    }

    export function addResizeHandler(el: Element): void { //TODO maybe should add native ResizeObserver if supported?
        requestAnimationFrame(() => resizeHandler_(el));
    }

    export function setParent(child: Nullable<Element>, parent?: Nullable<Element>): boolean {
        if (child) {
            if (parent) {
                //TODO add zIndex support.
                parent.appendChild(child);
            } else {
                child.remove();
            }
            return true; //Operation is successful.
        }
        return false; //Operation is failed.
    }
}

