// vite.config.ts
import vue from "file:///D:/xampp/htdocs/dev/directus/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.14_@types+node@22.13.8_sass-embedded@1.85.1_sass@1.83.4_ter_wuta77eaq26677oojjrm2qpd7u/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "node:path";
import { nodeExternals } from "file:///D:/xampp/htdocs/dev/directus/node_modules/.pnpm/rollup-plugin-node-externals@8.0.0_rollup@4.34.9/node_modules/rollup-plugin-node-externals/dist/index.js";
import { defineConfig } from "file:///D:/xampp/htdocs/dev/directus/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.8_sass-embedded@1.85.1_sass@1.83.4_terser@5.37.0/node_modules/vite/dist/node/index.js";
import dts from "file:///D:/xampp/htdocs/dev/directus/node_modules/.pnpm/vite-plugin-dts@4.5.1_@types+node@22.13.8_rollup@4.34.9_typescript@5.8.2_vite@5.4.14_@types+n_nvc7co5jcza4aj2aw7e442gtpy/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\xampp\\htdocs\\dev\\directus\\packages\\components";
var vite_config_default = defineConfig({
  plugins: [{ ...nodeExternals(), enforce: "pre" }, vue(), dts()],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcZGV2XFxcXGRpcmVjdHVzXFxcXHBhY2thZ2VzXFxcXGNvbXBvbmVudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxkZXZcXFxcZGlyZWN0dXNcXFxccGFja2FnZXNcXFxcY29tcG9uZW50c1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDoveGFtcHAvaHRkb2NzL2Rldi9kaXJlY3R1cy9wYWNrYWdlcy9jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJztcclxuaW1wb3J0IHsgbm9kZUV4dGVybmFscyB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tbm9kZS1leHRlcm5hbHMnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRwbHVnaW5zOiBbeyAuLi5ub2RlRXh0ZXJuYWxzKCksIGVuZm9yY2U6ICdwcmUnIH0sIHZ1ZSgpLCBkdHMoKV0sXHJcblx0YnVpbGQ6IHtcclxuXHRcdGxpYjoge1xyXG5cdFx0XHRlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcclxuXHRcdFx0ZmlsZU5hbWU6ICdpbmRleCcsXHJcblx0XHRcdGZvcm1hdHM6IFsnZXMnXSxcclxuXHRcdH0sXHJcblx0fSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1YsT0FBTyxTQUFTO0FBQ2hXLFNBQVMsZUFBZTtBQUN4QixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFKaEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUyxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUcsU0FBUyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztBQUFBLEVBQzlELE9BQU87QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNKLE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDeEMsVUFBVTtBQUFBLE1BQ1YsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNmO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
