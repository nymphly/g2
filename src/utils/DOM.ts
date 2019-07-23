import { G2_GLOBAL } from './../g2';

export namespace DOM {
    export function getElement(el: (string|HTMLElement) = 'container'): (HTMLElement|null) {
        return utils.isString(el) ?
            G2_GLOBAL.document.querySelector(`#${el}`) :
            <HTMLElement> el; 
    }
}

