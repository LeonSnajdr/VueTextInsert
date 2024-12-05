import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescript from "rollup-plugin-typescript2";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        typescript({
            check: false,
            include: ["./src/**/*.ts", "./src/**/*.vue"],
            tsconfigOverride: {
                compilerOptions: {
                    sourceMap: true,
                    declaration: true,
                    declarationMap: true
                }
            },
            exclude: ["vite.config.ts"]
        })
    ],
    build: {
        lib: {
            entry: "./src/index.ts",
            name: "vue-text-insert",
            fileName: (format) => `vue-text-insert.${format}.js`
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue"
                }
            }
        }
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
