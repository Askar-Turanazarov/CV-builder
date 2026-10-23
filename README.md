# Конструктор резюме и мини-сайта портфолио

Веб-приложение для сборки резюме и портфолио-мини-сайта: форма с данными кандидата, ИИ формулирует описание и сильные стороны, несколько шаблонов оформления и цветовых тем, экспорт в PDF/печать, интерфейс на русском/английском/узбекском.

## Структура

- `client/` — React + Vite + TypeScript SPA
- `server/` — Express backend-прокси к AI-провайдерам (Anthropic Claude, Google Gemini)

## Запуск

```bash
npm install
cp server/.env.example server/.env
```

Заполните в `server/.env`:

- `ANTHROPIC_API_KEY` — ключ Anthropic (https://console.anthropic.com/)
- `GOOGLE_API_KEY` — ключ Google AI Studio (https://aistudio.google.com/apikey)
- `AI_PROVIDER_PRIORITY` — порядок перебора моделей при генерации (по умолчанию задан в `.env.example`)

Затем:

```bash
npm run dev
```

Клиент — http://localhost:5173, сервер — http://localhost:3001 (Vite проксирует `/api/*` на сервер).

## Продакшн-сборка

```bash
npm run build
npm start
```

## Деплой (Vercel)

Проект деплоится на Vercel из GitHub как одно приложение: статика клиента из `client/dist` и Express-API как одна serverless-функция (`api/index.mjs` → `server/dist/app.js`). Настройки — в `vercel.json`.

Переменные окружения в Vercel → Settings → Environment Variables:

- `GOOGLE_API_KEY` — обязательно (хотя бы один ключ ИИ)
- `ANTHROPIC_API_KEY` — необязательно; без него модели Claude пропускаются
- `AI_PROVIDER_PRIORITY` — необязательно, по умолчанию лёгкие Gemini, затем Claude
- `PUPPETEER_SKIP_DOWNLOAD=1` — не скачивать полный Chrome при сборке

PDF на Vercel рендерится через `puppeteer-core` + `@sparticuz/chromium` (локально — обычный `puppeteer`). Первый PDF после простоя может занять несколько секунд (холодный старт), поэтому клиент заранее «прогревает» браузер при открытии превью.
