import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
    build: {
        emptyOutDir: true,
        lib: {
            entry: "./src/index.ts",
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
    plugins: [vue(), dts({ tsconfigPath: "./tsconfig.app.json" })],
});
