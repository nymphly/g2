import { utils } from './../utils';
import { AsyncQueueFunction } from '../Types';
import { IQueue } from '../Interfaces';

export class AsyncQueue implements IQueue {
    public steps: Array<AsyncQueue | AsyncQueueFunction<any>> = [];
    private isCanceled_: boolean = false;
    public parentQueue: AsyncQueue | null = null;

    /**
     * 
     * @param shared - Shared data, comes as parameter to any function.
     *  By default, comes to subqueues if redefinedShared parameter
     *  is not set to "true".
     * @param redefineShared - Flag whether to make subqueue keep its
     *  own "shared".
     */
    constructor(public shared: any = {}, public redefineShared: boolean = false) { }

    /**
     * NOTE: settings steps resumes queue.
     * @param steps 
     */
    public setSteps(...steps: (AsyncQueue | AsyncQueueFunction<any>)[]): AsyncQueue {
        this.steps = [...steps];
        return this.resume();
    }

    public resume(): AsyncQueue {
        this.isCanceled_ = false;
        this.steps.forEach(step => {
            if (step instanceof AsyncQueue)
                step.resume();
        });
        return this;
    }

    public cancel(): AsyncQueue {
        // In current implementation must not cancel parent queue.
        this.isCanceled_ = true;
        return this;
    }

    public isCanceled(val?: boolean): boolean | AsyncQueue {
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

    public exec(): Promise<any> {
        if (this.isCanceled()) {
            return Promise.reject('canceled');
        } else {
            if (this.steps.length) {
                return this.runStep_();
            } else {
                return Promise.resolve(this);
            }
        }
    }

    private runStep_(index: number = 0): Promise<any> {
        if (this.isCanceled())
            return Promise.reject('canceled');

        const step = this.steps[index];
        if (step) {
            if (utils.isFunction(step)) {
                if (utils.isAsyncFunction(step)) {
                    return Promise.resolve().then(() => step
                        .call(this, this.shared)
                        .then(() => this.runStep_(++index))
                    );
                } else {
                    throw 'Current implementation doesn\'t support not async functions in AsyncQueue. Please, fix it.';
                }
            } else { //Step is queue.
                if (this.redefineShared)
                    step.shared = this.shared;
                return step.exec()
                    .then(() => this.runStep_(++index))
                    .catch(e => {
                        return (e === 'canceled') ?
                            this.runStep_(++index) :
                            Promise.reject(e);
                    });
            }
        }
        return Promise.resolve('complete');
    }

    public dispose() {
        this.steps.forEach(step => {
            if (step instanceof AsyncQueue)
                step.dispose();
        });
        this.steps.length = 0;
        this.shared = null;
    }

}