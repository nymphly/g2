import { Stage } from './svg/Stage';
import { DOM } from './utils/DOM';
import { Nullable, StringOrNumber } from './Types';
import { SyncQueue } from './queue/SyncQueue';
import { AsyncQueue } from './queue/AsyncQueue';

declare const window: any;
export const G2_GLOBAL = window || global; //NodeJs support.

export function create(container: (HTMLElement|string) = 'container', width: StringOrNumber = '100%', height: StringOrNumber = '100%'): Nullable<Stage> {
    const cont: (Nullable<HTMLElement>) = DOM.getElement(container);
    if (cont) {
        return new Stage(cont, width, height);
    }
    console.error('Container for stage is not set correctly');
    return null;
}

export function syncQueue(shared: any = {}): SyncQueue {
    return new SyncQueue(shared);
}

export function asyncQueue(shared: any = {}): AsyncQueue {
    return new AsyncQueue(shared);
}