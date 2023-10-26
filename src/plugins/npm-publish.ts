import { execSync } from 'child_process';
import * as colors from 'colorette';

import type { Plugin } from '../types';
import { changeVersionByType } from '../helps';

export type NpmPublishType = {
  versionType: 'fix' | 'business' | 'major'; // 版本类型
  environments?: 'beta' | 'stable' | null; //是否做版本区分
};

const pluginName = 'NPMPUBLISH';

export const npmPublish = (
  { versionType, environments }: NpmPublishType = {
    versionType: 'fix',
    environments: null
  }
): Plugin<void> => {
  return {
    async start() {
      const { logger, contextOptions } = this;

      if (!contextOptions.cwd) {
        logger.error(pluginName, '请传入正确的目录地址！');
      }

      const { cwd } = contextOptions;

      if (!versionType || !['fix', 'business', 'major'].includes(versionType)) {
        logger.warn(pluginName, `versionType: ${colors.green(versionType)} 版本类型不正确`);
      }

      if (!environments || !['beta', 'stable'].includes(environments)) {
        logger.warn(pluginName, `${colors.green('environments')} 没有传递, 发布'无环境'版本！`);
      } else {
        logger.info(pluginName, `${colors.green('environments')} 传递, 发布 ${colors.green(environments)} 版本。`);
      }

      try {
        const packageJson = require(`${cwd}/package.json`) as any;
        const gitBranch = execSync(`cd ${cwd} && git rev-parse --abbrev-ref HEAD`).toString().split('\n')[0];

        const serverVersion = execSync(
          `cd ${cwd} && npm view ${packageJson.name}@${environments === 'stable' ? 'latest' : 'beta'} version`
        ).toString();

        let publishVersion = changeVersionByType(serverVersion, versionType);

        if (environments && ['beta', 'stable'].includes(environments)) {
          logger.info(
            pluginName,
            `${colors.green('environments')} 为 ${colors.green(environments)}, 即将开始发布 ${colors.green(
              environments
            )} 版本`
          );

          const env = gitBranch === 'test' ? 'beta' : 'stable';

          publishVersion = `${publishVersion}-${env}`;
        }

        logger.info(pluginName, `正在发布 ${colors.green(packageJson.name)} 版本号： ${colors.green(publishVersion)}`);
        execSync(`npm version ${publishVersion}`);

        const publishShell = environments ? `npm publish --tag ${environments}` : `npm publish`;
        execSync(publishShell);
        logger.success(pluginName, `当前分布分支 ${colors.green(gitBranch)}, 是否成功请查看以上日志！`);
      } catch (e) {
        logger.error(pluginName, `发布失败，请检查日志!`);
      }
    }
  };
};
