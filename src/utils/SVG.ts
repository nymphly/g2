export namespace SVG {
    class Path_ {
        private rv_: string = '';

        public moveTo(x: number, y: number): Path_ {
            this.rv_ = `${this.rv_ }M ${x} ${y}`;
            return this;
        }

        public lineTo(x: number, y: number): Path_ {
            this.rv_  = `${this.rv_ }L ${x} ${y}`;
            return this;
        }

        public close(): Path_ {
            this.rv_  = `${this.rv_ }Z`;
            return this;
        }

        public get(): string {
            return this.rv_;
        }

    }

    /*
        Simplifier function, allows to use construction like
            {code}
                const d = g2.SVG.path().moveTo(10, 10).lineTo(40, 40).get();
            {code}
        to get resulting line like "M 10 10L 40 40" suitable 
        to be set as SVG path's d-attribute.
     */
    export function path(): Path_ {
        return new Path_();
    }
}