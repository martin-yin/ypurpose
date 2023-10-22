import { execSync, spawnSync } from 'child_process';
import * as colors from 'colorette';

import type { Plugin } from '../types';

export const gitFetch: Plugin = {
  async start() {
    const { logger, contextOptions } = this;

    if (!contextOptions.cwd) {
      throw Error('请传入正确的目录地址！');
    }

    logger.info('GITFETCH', '正在进入当前配置项目的目录');

    spawnSync(`cd ${contextOptions.cwd}`);

    logger.info('GITFETCH', '正在拉取当前分支最新的代码');
    try {
      const branch = execSync(`cd ${contextOptions.cwd} && git rev-parse --abbrev-ref HEAD`).toString().split('\n')[0];

      logger.info('GITFETCH', `当前分支为 ${colors.green(branch)}`);

      spawnSync(`cd ${contextOptions.cwd} && git fetch && git pull`);

      logger.success('GITFETCH', '分支代码拉取完成');
    } catch (e) {
      throw Error('请传入正确的目录地址！');
    }
  }
};
