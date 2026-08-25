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
