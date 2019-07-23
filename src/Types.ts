export type Nullable<T> = T|null;
export type StringOrNumber = string|number;
export type NumberOrString = StringOrNumber; //Sugar.
export type NumberOrPercent = StringOrNumber; //Sugar.
export type AsyncQueueFunction<T> = (val: T) => Promise<T>;