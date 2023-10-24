import cac from 'cac';
import { version, name } from '../package.json';
import { getLocalConfig } from './config';
import { createLogger } from './log';
import { PluginContainer } from './plugin';

const VERSION = version as string;
const cli = cac(name);

cli.help();
cli.version(VERSION);

cli
  .command('start [...command]', '')
  .option('-c, --config', '读取当前目录下的配置代码')
  .action(
    async (
      options: {
        c: string;
        config: string;
      },
      command: string
    ) => {
      const cwd = process.cwd();
      const logger = createLogger();
      const localConfig = await getLocalConfig(command, {
        cwd,
        configPath: options.c || options.config
      });

      if (!localConfig) {
        logger.error('CLI', `当前目录下没有找到 ${name} 配置文件`);
        return;
      }

      const pluginContainer = new PluginContainer([...localConfig.plugins]);

      pluginContainer.setContext({
        logger,
        contextOptions: {
          cwd,
          ...localConfig.options
        }
      });

      try {
        await pluginContainer.start();
      } catch (e) {
        logger.error('CLI', e);
        return;
      }
    }
  );

cli.parse();
