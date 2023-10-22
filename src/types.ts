import type { Logger } from './log';

export type MaybePromise<T> = T | Promise<T>;

export type PluginContext = {
  contextOptions: MaybePromise<any>;
  logger: Logger;
};

export type Options<T> = (this: PluginContext) => MaybePromise<T>;

export type Start<T> = (this: PluginContext, options: T) => MaybePromise<void>;

export type Plugin<T = any> = {
  options?: Options<T>;
  start?: Start<T>;
};
