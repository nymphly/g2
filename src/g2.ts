import { Stage } from './svg/Stage';
import { DOM } from './utils/DOM';
import { Nullable, StringOrNumber } from './Types';
import { SyncQueue } from './queue/SyncQueue';
import { AsyncQueue } from './queue/AsyncQueue';
import { G2Element } from './svg/G2Element';
import { Layer } from './svg/Layer';
import { Path } from './svg/Path';
import { inject } from './utils/injections';
import * as ext from './extensions/ext';

declare const window: any;
export const G2_GLOBAL = window || global; //TODO NodeJs support. Do we really need it? What about SSR?

export function stage(container: (HTMLElement|string) = 'container', width: StringOrNumber = '100%', height: StringOrNumber = '100%'): Nullable<Stage> {
    const cont: (Nullable<HTMLElement>) = DOM.getElement(container);
    if (cont) {
        return new Stage(cont, width, height);
    }
    throw 'Container for stage is not set correctly, please fix it.';
}

export function syncQueue(shared: any = {}): SyncQueue {
    return new SyncQueue(shared);
}

export function asyncQueue(shared: any = {}): AsyncQueue {
    return new AsyncQueue(shared);
}

export {
    DOM, 
    SyncQueue,
    AsyncQueue,
    Stage,
    G2Element,
    Layer,
    Path,
    inject,
    ext
};
