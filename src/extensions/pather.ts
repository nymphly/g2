import { Path } from "../svg/Path";
import { DOM } from "../utils/DOM";

class Pather_ {
    private rv_: string = '';

    //TODO Think of this shift!!! Do we need it? Do we use it correctly for curves?
    private shift_: number = 0;

    public setShift(val: number): Pather_ {
        this.shift_ = val;
        return this;
    }

    public moveTo(x: number, y: number): Pather_ {
        this.rv_ = `${this.rv_}M ${x + this.shift_} ${y + this.shift_}`;
        return this;
    }

    public lineTo(x: number, y: number): Pather_ {
        this.rv_ = `${this.rv_}L ${x + this.shift_} ${y + this.shift_}`;
        return this;
    }

    public h(x: number): Pather_ {
        this.rv_ = `${this.rv_}H ${x + this.shift_}`;
        return this;
    }

    public v(y: number): Pather_ {
        this.rv_ = `${this.rv_}V ${y + this.shift_}`;
        return this;
    }

    public curveTo(x1: number, y1: number, x2: number, y2: number, toX: number, toY: number): Pather_ {
        this.rv_ = `${this.rv_}C ${x1 + this.shift_} ${y1 + this.shift_} ${x2 + this.shift_} ${y2 + this.shift_} ${toX + this.shift_} ${toY + this.shift_}`;
        return this;
    }

    public bezierCurveTo(x2: number, y2: number, toX: number, toY: number): Pather_ {
        this.rv_ = `${this.rv_}S ${x2 + this.shift_} ${y2 + this.shift_} ${toX + this.shift_} ${toY + this.shift_}`;
        return this;
    }

    public squareBezierCurveTo(x2: number, y2: number, toX: number, toY: number): Pather_ {
        this.rv_ = `${this.rv_}Q ${x2 + this.shift_} ${y2 + this.shift_} ${toX + this.shift_} ${toY + this.shift_}`;
        return this;
    }

    public arcTo(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number,
        sweepFlag: number, toX: number, toY: number): Pather_ {
        this.rv_ = `${this.rv_}A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${toX + this.shift_} ${toY + this.shift_}`;
        return this;
    }

    public close(): Pather_ {
        this.rv_ = `${this.rv_}Z`;
        return this;
    }

    public asRect(left: number, top: number, width: number, height: number): Pather_ {
        this
            .moveTo(left, top)
            .h(left + width)
            .v(top + height)
            .h(left)
            .close();
        return this;
    }

    public asCircle(cx: number, cy: number, radius: number): Pather_ {
        this
            .moveTo(cx + radius, cy)
            .arcTo(radius, radius, 0, 0, 1, cx - radius, cy)
            .arcTo(radius, radius, 0, 0, 1, cx + radius, cy);
        return this;
    }

    public get(): string {
        return this.rv_;
    }

    public clear(): Pather_ {
        this.rv_ = '';
        return this;
    }

    public applyTo(path: Path|SVGPathElement): Pather_ {
        const el: SVGPathElement = path instanceof Path ? <SVGPathElement>path.domElement : path;
        DOM.attr(el, 'd', this.rv_);
        return this;
    }

}

/*
    Simplifier function, allows to use construction like
        {code}
            const d = g2.ext.pather().moveTo(10, 10).lineTo(40, 40).get();
        {code}
    to get resulting line like "M 10 10L 40 40" suitable 
    to be set as SVG path's d-attribute.

    NOTE: in current implementation uses absolute coordinates.

    Read more: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
 */
export function pather(): Pather_ {
    return new Pather_();
}