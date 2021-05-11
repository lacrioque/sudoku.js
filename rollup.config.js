import typescript from 'rollup-plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json'


const plugins = [
  typescript({typescript: require('typescript'), lib: ["es5", "es6", "dom"], target: "es5", declaration: true}),
];

if (process.env.BUILD === 'production') {
  plugins.push(terser())
}

export default {
  input: './src/main.ts',
  output: [
    {
      file: process.env.BUILD === 'production' ? pkg.main.replace(/\.js$/, '.min.js') : pkg.main,
      format: 'cjs',
      exports: 'default'
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'default'
    },
  ],
  plugins
}