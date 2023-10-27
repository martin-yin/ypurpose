import cac from 'cac';
import { version, name } from '../package.json';
import { getLocalConfig } from './config';
import { createLogger } from './log';
import { PluginContainer } from './pluginContainer';
import { spawnSync } from 'node:child_process';

const VERSION = version as string;
const cli = cac(name);

cli.help();
cli.version(VERSION);

cli
  .command('start <command>', '执行命令')
  .option('-c, --config <config>', '读取当前目录下的配置代码')
  .action(
    async (
      command: string,
      options: {
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
          configPath: options?.config
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

cli
  .command('build-config', '构建配置文件')
  .option('-f, --fileName <fileName>', '需要被构建的文件')
  .option('-d, --dir <dir>', '输出文件位置')
  .action(async (options: { dir: string; fileName: string }) => {
    const cwd = process.cwd();
    const logger = createLogger();
    const configFile = options.fileName ? options.fileName : 'ypurpose.config.js';
    const outDir = options?.dir ? options.dir : 'ypurpose-build';
    const command = 'npx';
    const args = ['tsup', configFile, '--format', 'cjs', '--outDir', outDir];

    logger.info('CLI', '正在执行构建...');
    spawnSync(command, args, {
      cwd,
      stdio: 'inherit'
    });
  });
cli.parse();
