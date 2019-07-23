import { utils } from './../utils';

export class SyncQueue {
    private steps_: Array<SyncQueue|Function> = [];
    private isCancelled_: boolean = false;
    private parentQueue_: SyncQueue|null = null;

    constructor(public shared: any = {}) { }

    public steps(...steps: (SyncQueue|Function)[]): SyncQueue {
        this.steps_ = [...steps];
        return this.resume();
    }

    public resume(): SyncQueue {
        this.isCancelled_ = false;
        this.steps_.forEach(step => {
            if (step instanceof SyncQueue)
                step.resume();
        });
        return this;
    }

    public cancel(): SyncQueue {
        /*
            In current implementation must not cancel parent queue.
         */
        this.isCancelled_ = true;
        return this;
    }

    public isCancelled(val?: boolean): boolean|SyncQueue {
        if (utils.isDef(val)) {
            this.isCancelled_ = <boolean>val;
            return this;
        }

        if (this.parentQueue_) {
            this.isCancelled_ = this.isCancelled_ || <boolean>this.parentQueue_.isCancelled();
        }
        return this.isCancelled_;
    }

    public parentQueue(parent?: SyncQueue): SyncQueue|null {
        if (utils.isDef(parent)) {
            this.parentQueue_ = <SyncQueue>parent;
            return this;
        }
        return this.parentQueue_;
    }

    public exec(): SyncQueue {
        for (let i = 0; i < this.steps_.length; i++) {
            if (this.isCancelled())
                return this;

            const step = this.steps_[i];
            if (utils.isFunction(step)) {
                <Function>step.call(this, this.shared);
            } else {
                step.parentQueue(this);
                step.shared = this.shared;
                step.exec();
            }
        }
        return this;
    }


}