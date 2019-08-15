import { G2Element, DOM, Stage } from "../g2";
import { IStorage, ITypedStorage } from "../Interfaces";
import { utils } from "../utils";
import { Nullable } from "../Types";

/**
 * Current implementation of Style has the following features
 * that must be considered on development and usage:
 *  - In current implementation (8 Aug 2019) it works with CSS classes only.
 *    Another CSS-features will be added later if needed. 
 *  - CSS native JS classes such as CSSRule, CSSStyleSheet, etc are not used for a while
 *    because of implementation complexity. Current initial implementation
 *    just uses simple DOM-node creation with sting innerHTML injection.
 *    This way probably has some security and performance issues that can be fixed
 *    later.  
 *  - For future implementation @see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Using_dynamic_styling_information
 */
export class Style extends G2Element {
    public styleString: string = '';
    public stylesMap: ITypedStorage<Object> = {};

    public createDom(): SVGElement {
        return DOM.createSVGElement('style');
    }

    public add(config: IStorage, name: string = `${DOM.G2_ATTR_PREFIX}${utils.getUid()}`): string {
        //TODO Probably needs to add merging.
        this.stylesMap[name] = config;
        return name;
    }

    public get(name: string): IStorage | undefined {
        return this.stylesMap[name];
    }

    public stringifyClass(obj: IStorage) {
        let rv = '{';
        for (let key in obj) {
            rv = `${rv}${key}: ${obj[key]};`;
        }
        return `${rv}}`
    }

    public stringifyStylesMap(): string {
        this.styleString = '';
        for (let key in this.stylesMap) {
            const classString = this.stringifyClass(this.stylesMap[key]);
            this.styleString = `${this.styleString} .${key} ${classString}`;
        }
        return this.styleString;
    }

    render(): Promise<any> {
        return super
            .render()
            .then(() => new Promise((resolve: Function, reject: Function) => {
                const str = this.stringifyStylesMap();
                if (str === '') {
                    reject('Could not parse style to string.Looks like styles map is empty.');
                } else {
                    (<SVGElement>this.domElement).innerHTML = str;
                    resolve();
                }
            }))
            .catch(e => e);
    }



}