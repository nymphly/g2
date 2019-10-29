import { G2Element, DOM, Path, Stage } from "../g2";
import { Nullable } from "../Types";
import { Style } from "../svg/Style";
import { IStorage } from "../Interfaces";

export class PathFactory extends G2Element {
    public pool: Array<SVGPathElement> = [];
    private usedIndex_: number = 0;
    public styleName: string = '';

    constructor(
        public stage: Stage,
        public parent: Nullable<G2Element>,
        styleConfig: IStorage = { stroke: '#000', fill: 'none' },
        styleName?: string
    ) {
        super(stage, parent);
        const style: Style = <Style>(this.stage.style);
        this.styleName = style.add(styleConfig, styleName);
    }

    public createDom(): SVGElement {
        return DOM.createSVGElement('g');
    }

    public add(): SVGPathElement {
        let path: SVGPathElement = this.pool[this.usedIndex_];
        if (!path) {
            path = <SVGPathElement>DOM.createSVGElement('path', { class: this.styleName });
            this.pool.push(path);
        }
        this.usedIndex_++;

        //TODO add z-index support.
        DOM.setParent(path, this.domElement);
        return path;
    }

    public clear(): void {
        this.pool.forEach(el => DOM.setParent(el));
        this.usedIndex_ = 0;
    }
}
