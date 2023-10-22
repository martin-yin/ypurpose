import fs from 'node:fs';
import path from 'node:path';

import { createConfigLoader as createLoader } from 'unconfig';

export type ConfigType = {
  options: any;
  command?: string;
  plugins: Array<any>;
  onSuccess?: () => void;
  onFail?: (e: Error) => void;
};

export type ConfigTypeArray = Array<ConfigType & { command: string }>;

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
  options: { cwd: string; configPath?: string }
): Promise<ConfigType | null> {
  const localConfig = await loadConfig(options);

  // 如果接收到的配置项是个数组
  if (Array.isArray(localConfig)) {
    if (command !== '') {
      const commandConfig = localConfig.find(config => {
        config.command === command;
      });

      if (!commandConfig) {
        throw Error(`请检查 ${command} 是否有误`);
      }
      return commandConfig;
    }
  }

  return localConfig as ConfigType;
}
