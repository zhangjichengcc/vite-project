import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "node:fs";
import typescript from "@rollup/plugin-typescript";
const pkg = require("./package.json");

function resolve(str: string) {
  return path.resolve(__dirname, str);
}

// 入口文件
const entry = "packages/index.ts";

// 组件存放目录
const componentsDir = "packages";
// 获取组件名称
const componentsName = fs
  .readdirSync(path.resolve(componentsDir))
  .filter((i) => /^[a-zA-Z0-9_]+$/.test(i));

// 获取组件入口
const componentsEntry = componentsName.map(
  (name) => `${componentsDir}/${name}/index.tsx`
);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "lib",
    // 防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制
    cssTarget: "chrome61",
    lib: {
      entry: "packages/index.ts", // 入口文件
      name: "YourComponentLibrary", // 组件库的全局变量名
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["react", "react-dom"],
      output: [
        {
          preserveModules: true, // 使用原始模块名作为文件名
          // preserveModulesRoot: "packages", // 指定输出目录
          // dir: path.join(__dirname, "lib"),
          // format: "esm",
          // exports: "auto",
          // sourcemap: true,

          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            react: "react",
            "react-dom": "react-dom",
          },
          // assetFileNames: (chunkInfo) => {
          //   const { name } = chunkInfo;
          //   const { ext, dir, base } = path.parse(name!);
          //   if (ext !== ".css") return "[name].[ext]";
          //   // 规范 style 的输出格式
          //   return path.join(dir, "style", base);
          // },
          // manualChunks(id) {
          //   // 将组件库的代码分割成按目录结构的 chunk
          //   if (id.includes('/src/')) {
          //     const dirs = id.split('/src/');
          //     if (dirs.length > 1) {
          //       const componentName = dirs[1].split('/')[0];
          //       return componentName;
          //     }
          //   }
          // },
          output: {
            // 保留源代码的目录结构
            preserveModules: true,
          },
        },
      ],
    },
  },
  css: {
    modules: {
      hashPrefix: "zjc",
    },
  },
  plugins: [
    react(),
    typescript({
      target: "es5",
      rootDir: resolve("packages/"),
      declaration: true,
      declarationDir: resolve("lib"),
      exclude: resolve("node_modules/**"),
      allowSyntheticDefaultImports: true,
    }),
  ],
});
