import cac from 'cac';
import { version, name } from '../package.json';
import { getLocalConfig } from './config';
import { createLogger } from './log';
import { PluginContainer } from './pluginContainer';

const VERSION = version as string;
const cli = cac(name);

cli.help();
cli.version(VERSION);

cli
  .command('start <command>', '')
  .option('-c, --config', '读取当前目录下的配置代码')
  .action(
    async (
      command: string,
      options: {
        c: string;
        config: string;
      }
    ) => {
      const cwd = process.cwd();
      const logger = createLogger();

      logger.info('CLI', `开始读取配置文件`);

      const localConfig = await getLocalConfig(
        command,
        {
          cwd,
          configPath: options.c || options.config
        },
        logger
      );

      if (!localConfig) {
        logger.error('CLI', `当前目录下没有找到 ${name} 配置文件`);
        return;
      }

      logger.info('CLI', `初始化 Plugins`);

      try {
        const pluginContainer = new PluginContainer([...localConfig.plugins]);
        pluginContainer.setContext({
          logger,
          contextOptions: {
            cwd,
            ...localConfig.options
          }
        });

        await pluginContainer.start();
      } catch (e) {
        logger.error('CLI', e);
        return;
      }
    }
  );

cli.parse();
