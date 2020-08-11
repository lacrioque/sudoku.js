import typescript from 'rollup-plugin-typescript';
import {terser} from 'rollup-plugin-terser';

const plugins = process.env.BUILD === 'production' ? [
  typescript({lib: ["es5", "es6", "dom"], target: "es5"}),
  terser()
] : [
  typescript({lib: ["es5", "es6", "dom"], target: "es5"})
]

export default {
  input: './src/main.ts',
   output: {
    file: process.env.BUILD === 'production' ? 'dist/sudoku.min.js' : 'dist/sudoku.js',
    format: 'cjs',
    exports: 'default'
  },
  plugins
}