# Миграция с Cloudflare Pages на стабильный хостинг для РФ

Этот репозиторий уже подготовлен для деплоя через GitHub Actions по FTPS.

## Рекомендуемая схема

- Хостинг: Timeweb или Beget (виртуальный хостинг в РФ)
- Деплой: GitHub Actions -> FTPS
- Сайт: `index.html`, `connect.html`, `liza-app.css`, `liza-app.js`

## Что настроить на хостинге

1. Создать сайт и привязать домен.
2. Включить SSL (Let's Encrypt).
3. Узнать:
   - FTP/FTPS host
   - FTP user
   - FTP password
   - корневую директорию сайта (обычно `public_html/`)

## Что настроить в GitHub

В репозитории открыть `Settings -> Secrets and variables -> Actions` и добавить секреты:

- `FTP_SERVER` — FTP/FTPS хост
- `FTP_USERNAME` — логин FTP
- `FTP_PASSWORD` — пароль FTP
- `FTP_SERVER_DIR` — путь на сервере (например `public_html/`)

После этого запустить workflow:

- `Actions -> Deploy static site to RU hosting -> Run workflow`

или просто запушить изменения в `main`.

## Проверка после деплоя

Проверить URL:

- `https://<ВАШ_ДОМЕН>/index.html?v=7`
- `https://<ВАШ_ДОМЕН>/connect.html`

## Сниппет для Tilda

```html
<div style="width:100%;margin:0;padding:0;">
  <iframe
    src="https://<ВАШ_ДОМЕН>/index.html?v=7"
    style="display:block;width:100%;height:100vh;border:0;background:#f2f5fb;"
    loading="eager"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
```

## Важно

- Текущий URL `liza-bot.pages.dev` больше не использовать.
- Для смены версии фронта достаточно обновить `v=7` на `v=8` (и т.д.), если нужно быстро обойти кеш.

## Быстрый вариант без внешнего хостинга

В репозитории есть workflow `Deploy static site to GitHub Pages`.
Он публикует сайт без Cloudflare по адресу:

- `https://seregaobr882.github.io/liza-tilda-assets/index.html`
