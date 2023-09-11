@echo off
npx nuxt prepare &^
npx patch-package &^
npm --prefix ./packages/kirakira-backend run build &^
npm --prefix ./locales/editor run build
