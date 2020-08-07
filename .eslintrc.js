const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // enable support for dynamic import
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['**/src/**/*.vue'],
      rules: { 'vue/name-property-casing': ['error', 'kebab-case'] },
    },
    {
      files: ['**/**/*.spec.*'],
      rules: { 'no-console': 0 },
    },
  ],
};
