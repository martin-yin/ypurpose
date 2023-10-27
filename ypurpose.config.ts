import { defineConfig } from './src/config/index';
import { gitFetchPull } from './src/plugins';

export default defineConfig({
  command: 'build',
  options: {},
  plugins: [gitFetchPull()]
});
