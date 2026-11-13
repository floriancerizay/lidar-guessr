// Assemble le site statique dans dist/ (publié sur GitHub Pages).
// Prérequis : npm run build:css

import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/css', { recursive: true });
cpSync('index.html', 'dist/index.html');
cpSync('css/style.css', 'dist/css/style.css');
cpSync('js', 'dist/js', { recursive: true });
