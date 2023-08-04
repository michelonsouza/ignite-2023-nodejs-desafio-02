/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const srcPath = resolve(__dirname, './src');

export default defineConfig({
  test: {
    threads: false,
  },
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
});
