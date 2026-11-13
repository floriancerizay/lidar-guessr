import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        L: 'readonly', // Leaflet, chargé via CDN
      },
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
