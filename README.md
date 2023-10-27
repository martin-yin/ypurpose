# ypurpose

## ypurpose start

执行特定命令

```ts
npm run build  && npm link
// 对应项目目录下新建 ypurpose.config.js
// 支持 js ts jsx 三种文件类型
import { defineConfig, gitFetchPull } from 'ypurpose';

export default defineConfig({
  command: 'fetch',
  options: {},
  plugins: [gitFetchPull()]
});

// common 则是对应需要执行的命令
ypurpose start fetch

```

## ypurpose build

针对配置文件进行构建。

```ts
// 对应项目目录下新建 ypurpose.config.js
import { defineConfig, gitFetchPull } from 'ypurpose';

export default defineConfig({
  command: 'fetch',
  options: {},
  plugins: [gitFetchPull()]
});

// 针对配置文件进行构建，构建后会在 ypurpose-build 输出 cjs 格式。
ypurpose build -f ypurpose.config.ts -d ypurpose-build

// CLI Building entry: ypurpose.config.ts
// CLI Using tsconfig: tsconfig.json
// CLI tsup v7.2.0
// CLI Using tsup config: /Users/xianweiyin/Documents/GitHub/ypurpose/tsup.config.ts
// CLI Target: esnext
// CLI Cleaning output folder
// CJS Build start
// "default" is imported from external module "fs" but never used in "ypurpose-build/ypurpose.config.js".
// "default" is imported from external module "path" but never used in "ypurpose-build/ypurpose.config.js".
// CJS ypurpose-build/ypurpose.config.js 5.25 KB
// CJS ⚡️ Build success in 96ms
```
