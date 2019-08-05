import { utils } from './../utils';
import { IQueue } from '../Interfaces';
import { Nullable } from '../Types';

export class SyncQueue implements IQueue{
    public steps: Array<SyncQueue|Function> = [];
    private isCanceled_: boolean = false;
    public parentQueue: Nullable<SyncQueue> = null;

    /**
     * 
     * @param shared - Shared data, comes as parameter to any function.
     *  By default, comes to subqueues if redefinedShared parameter
     *  is not set to "true".
     * @param redefineShared - Flag whether to make subqueue keep its
     *  own "shared".
     */
    constructor(public shared: any = {}, public redefineShared: boolean = false) { }

    public setSteps(...steps: (SyncQueue|Function)[]): SyncQueue {
        this.steps = [...steps];
        return this.resume();
    }

    public resume(): SyncQueue {
        this.isCanceled_ = false;
        this.steps.forEach(step => {
            if (step instanceof SyncQueue)
                step.resume();
        });
        return this;
    }

    public cancel(): SyncQueue {
        // In current implementation must not cancel parent queue.
        this.isCanceled_ = true;
        return this;
    }

    public isCanceled(val?: boolean): boolean|SyncQueue {
        if (utils.isDef(val)) {
            this.isCanceled_ = <boolean>val;
            return this;
        }

        if (this.parentQueue) {
            this.isCanceled_ = this.isCanceled_ || <boolean>this.parentQueue.isCanceled();
        }
        return this.isCanceled_;
    }

    public isEmpty() {
        return !!this.steps.length;
    }

    public exec(): SyncQueue {
        for (let i = 0; i < this.steps.length; i++) {
            if (this.isCanceled())
                return this;

            const step = this.steps[i];
            if (utils.isFunction(step)) {
                <Function>step.call(this, this.shared);
            } else {
                step.parentQueue = this;
                if (this.redefineShared)
                    step.shared = this.shared;
                step.exec();
            }
        }
        return this;
    }

    public dispose() {
        this.steps.forEach(step => {
            if (step instanceof SyncQueue)
                step.dispose();
        });
        this.steps.length = 0;
        this.shared = null;
    }  

}