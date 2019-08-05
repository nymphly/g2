import { Stage } from './svg/Stage';
import { DOM } from './utils/DOM';
import { Nullable, StringOrNumber } from './Types';
import { SyncQueue } from './queue/SyncQueue';
import { AsyncQueue } from './queue/AsyncQueue';
import { SVG } from './utils/SVG';

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

export {DOM};
export {SVG};
