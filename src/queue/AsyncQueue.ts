import { utils } from './../utils';
import { AsyncQueueFunction } from '../Types';

export class AsyncQueue {
    private steps_: Array<AsyncQueue | AsyncQueueFunction<any>> = [];
    private isCancelled_: boolean = false;
    private parentQueue_: AsyncQueue | null = null;

    constructor(public shared: any = {}) { }

    /**
     * NOTE: settings steps resumes queue.
     * @param steps 
     */
    public steps(...steps: (AsyncQueue | AsyncQueueFunction<any>)[]): AsyncQueue {
        this.steps_ = [...steps];
        return this.resume();
    }

    public resume(): AsyncQueue {
        this.isCancelled_ = false;
        this.steps_.forEach(step => {
            if (step instanceof AsyncQueue)
                step.resume();
        });
        return this;
    }

    public cancel(): AsyncQueue {
        /*
            In current implementation must not cancel parent queue.
         */
        this.isCancelled_ = true;
        return this;
    }

    public isCancelled(val?: boolean): boolean | AsyncQueue {
        if (utils.isDef(val)) {
            this.isCancelled_ = <boolean>val;
            return this;
        }

        if (this.parentQueue_) {
            this.isCancelled_ = this.isCancelled_ || <boolean>this.parentQueue_.isCancelled();
        }
        return this.isCancelled_;
    }

    public parentQueue(parent?: AsyncQueue): AsyncQueue | null {
        if (utils.isDef(parent)) {
            this.parentQueue_ = <AsyncQueue>parent;
            return this;
        }
        return this.parentQueue_;
    }

    public exec(): Promise<any> {
        if (this.isCancelled()) {
            return Promise.reject('canceled');
        } else {
            if (this.steps_.length) {
                return this.runStep_();
            } else {
                return Promise.resolve(this);
            }
        }
    }

    private runStep_(index: number = 0): Promise<any> {
        if (this.isCancelled())
            return Promise.reject('canceled');

        const step = this.steps_[index];
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
}