import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { META, metaTags, type MetaLang } from './seo/meta';

const META_SLOT = '<!--app-meta-->';

// index.html gets the Russian preview meta; after the build it is replaced by
// one copy per language (app.ru.html, app.en.html, app.uz.html). There is no
// index.html in the output on purpose: on Vercel a static file would win over
// the ?lang rewrites in vercel.json.
function localizedMeta(): Plugin {
  let outDir = 'dist';
  return {
    name: 'localized-meta',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return html.replace(META_SLOT, metaTags('ru'));
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, 'utf8');
      for (const lang of Object.keys(META) as MetaLang[]) {
        const localized = html.replace(metaTags('ru'), metaTags(lang)).replace('<html lang="ru">', `<html lang="${lang}">`);
        fs.writeFileSync(path.join(outDir, `app.${lang}.html`), localized);
      }
      fs.rmSync(indexPath);
    },
  };
}

export default defineConfig({
  plugins: [react(), localizedMeta()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
