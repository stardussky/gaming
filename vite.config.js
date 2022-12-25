import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueComponents from "unplugin-vue-components/vite";
import postcssPresetEnv from "postcss-preset-env";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: [
      { find: "~", replacement: process.cwd() },
      { find: "@", replacement: "/src" },
    ],
  },
  plugins: [
    vue(),
    vueComponents(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "[name]",
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
            @use 'sass:math';
            @import './src/styles/_variables.scss';
            @import './src/styles/mixins/_mixins.scss';
        `,
      },
    },
    postcss: {
      plugins: [postcssPresetEnv({
        browsers: "last 2 versions",
        autoprefixer: { grid: true },
      })],
    },
  },
});
