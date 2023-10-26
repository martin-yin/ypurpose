import { execSync, spawnSync } from 'child_process';
import * as colors from 'colorette';

import type { Plugin } from '../types';

export const gitFetchPull = ({ pluginName } = { pluginName: 'GITFETCHPULL' }): Plugin<void> => {
  return {
    async start() {
      const { logger, contextOptions } = this;

      if (!contextOptions.cwd) {
        logger.error(pluginName, '请传入正确的目录地址！');
      }

      try {
        logger.info(pluginName, '正在进入当前配置项目的目录');

        const branch = execSync(`cd ${contextOptions.cwd} && git rev-parse --abbrev-ref HEAD`)
          .toString()
          .split('\n')[0];

        logger.info(pluginName, `当前分支为 ${colors.green(branch)}`);

        logger.info(pluginName, '正在拉取最新的仓库数据');

        spawnSync('git', ['fetch'], {
          cwd: contextOptions.cwd,
          stdio: 'inherit'
        });

        logger.info(pluginName, '正在拉取当前分支最新的代码');

        spawnSync('git', ['pull'], {
          cwd: contextOptions.cwd,
          stdio: 'inherit'
        });

        logger.success(pluginName, '分支代码拉取完成');
      } catch (e) {
        logger.error(pluginName, e);
      }
    }
  };
};
