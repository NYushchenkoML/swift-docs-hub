import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/plugin.js',
    format: 'iife',
    name: 'capacitorZebraPrinter',
    globals: {
      '@capacitor/core': 'capacitorExports'
    },
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      // Добавляем расширения файлов, которые нужно обработать
      extensions: ['.js']
    })
  ],
  external: ['@capacitor/core']
};
