import fs from 'node:fs';
import path from 'node:path';

import { createConfigLoader as createLoader } from 'unconfig';
import { Logger } from '../log';
import { ConfigType, ConfigTypeArray, LocalConfigArr } from '../types';

/**
 * @description 定义配置
 * @param config
 */
export function defineConfig(config: ConfigType | ConfigTypeArray): ConfigType | ConfigTypeArray {
  return config;
}

/**
 * @description 读取本地配置文件
 * @param options
 * @returns Promise<ConfigType | ConfigTypeArray>
 */
export async function loadConfig(options: { cwd: string; configPath?: string }): Promise<ConfigType | ConfigTypeArray> {
  const resolved = path.resolve(options.cwd, options.configPath || '');

  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    options.cwd = path.dirname(resolved);
  }

  const loader = createLoader<ConfigType | ConfigTypeArray>({
    cwd: options.cwd,
    sources: {
      files: ['ypurpose.config'],
      extensions: ['ts', 'js', 'jsx']
    }
  });

  const config = (await loader.load()).config;

  return config;
}

/**
 * @description 获取本地的配置文件
 * @param command
 * @param options
 * @returns Promise<ConfigType>
 */
export async function getLocalConfig(
  command = '',
  options: { cwd: string; configPath?: string },
  logger: Logger
): Promise<ConfigType | null> {
  const localConfig = await loadConfig(options);
  const keys = Object.keys(localConfig);

  if (keys[0] === '0' && command !== '') {
    let commandConfig = null;

    keys.forEach(key => {
      const localConfigArr = localConfig as unknown as LocalConfigArr;
      const config = localConfigArr[key] as ConfigType;

      if (config.command === command) {
        commandConfig = config;
      }
    });

    if (!commandConfig) {
      logger.error('CLI', 'command 不正确！');
    }

    return commandConfig;
  }

  return localConfig as ConfigType;
}
