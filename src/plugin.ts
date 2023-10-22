import type { PluginContext } from './types';
import type { Plugin } from './types';

export class PluginContainer {
  plugins: Plugin[];
  context?: PluginContext;

  constructor(plugins: Plugin[]) {
    this.plugins = plugins;
  }

  setContext(context: PluginContext) {
    this.context = context;
  }

  getContext() {
    if (!this.context) throw new Error(`插件上下文没有设置！`);

    return this.context;
  }

  async start() {
    for (const plugin of this.plugins) {
      let options = null;
      if (plugin.options) {
        if (typeof plugin.options === 'function') {
          options = await plugin.options.call(this.getContext());
        }
        // options = plugin.options;
      }
      if (plugin.start) {
        await plugin.start.call(this.getContext(), options);
      }
    }
  }
}
