import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            entry: "./src/main.ts",
            name: "vue-text-insert",
            fileName: (format) => `vue-text-insert.${format}.js`,
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    Vue: "vue",
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json" })],
});
