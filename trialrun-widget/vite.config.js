import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'TrialRunWidget',
      fileName: 'trialrun-widget',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        // Ensure the CSS is inlined in the JS file
        inlineDynamicImports: true,
      },
    },
    // Minify the output
    minify: 'terser',
  },
});
