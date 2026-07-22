// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import playformCompress from "@playform/compress";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";

// ====== ОСНОВНАЯ КОНФИГУРАЦИЯ ======
export default defineConfig({
  site: "https://example.com",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    // ====== 1. SITEMAP ======
    sitemap({
      filter: (page) => {
        // Исключаем системные пути
        const url = new URL(page);
        const pathname = url.pathname;

        // Не включаем в sitemap черновики и админку
        if (
          ["/admin", "/draft", "/preview", "/_astro", "/api"].some((p) =>
            pathname.startsWith(p),
          )
        ) {
          return false;
        }
        return true;
      },

      // Стандартные значения для всех страниц
      changefreq: "weekly",
      priority: 0.7,

      // Автоматическая настройка приоритетов
      serialize: (item) => {
        if (item.url === "https://example.com/") {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.DAILY;
        }
        return item;
      },
    }),

    // ====== 2. COMPRESS  ======
    playformCompress({
      HTML: {
        "html-minifier-terser": {
          removeAttributeQuotes: false,
          minifyCSS: false,
          minifyJS: false,
          removeComments: false,
          collapseWhitespace: true,
        },
      },
      Image: true,
      JavaScript: {
        terser: {
          mangle: false,
        },
      },
      JSON: true,
      SVG: true,

      // Исключаем стандартные файлы
      Exclude: [/\.min\.(js|css)$/, /service-worker\.js$/, /\.map$/],

      Logger: 1,
    }),
  ],
});
