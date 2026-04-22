# Liza Bot Landing

## Overview
This repository contains the front-end assets for two public pages of the Liza Bot project:

1. **Main landing page**
   - Public URL: [https://liza-ai-admin.ru/notifications](https://liza-ai-admin.ru/notifications)
   - GitHub Pages asset URL: [https://seregaobr882.github.io/liza-tilda-assets/index.html](https://seregaobr882.github.io/liza-tilda-assets/index.html)

2. **YClients connection page**
   - Public URL: [https://liza-ai-admin.ru/notifications/connect-yclients](https://liza-ai-admin.ru/notifications/connect-yclients)
   - GitHub Pages asset URL: [https://seregaobr882.github.io/liza-tilda-assets/yclients-connect/index.html](https://seregaobr882.github.io/liza-tilda-assets/yclients-connect/index.html)

The project uses a hybrid setup:
- **Tilda** is the page container and form receiver.
- **GitHub Pages** serves the actual interface assets.
- The Tilda page embeds the GitHub Pages page through an **iframe**.
- Form submissions are forwarded into a **hidden native Tilda form** and then sent to Tilda receivers such as Telegram or Leads.

## Branches
- `main` — working branch and the default branch for developers.
- `gh-pages` — published branch used by GitHub Pages.

Important:
- `main` is the source-of-truth branch for development.
- `gh-pages` must stay in sync with the published assets.
- When JavaScript or CSS changes, cache-busting asset versions in `index.html` should be bumped before publishing.

## Project structure
### Main landing
- `index.html`
  - shell page for the main landing
  - loads `liza-app.js` and `liza-app.css`
  - contains bootstrap shell logic and layout overrides used by the embedded page
- `liza-app.js`
  - main rendered UI for the landing page
  - sections, cards, mockups, footer, popup form UI
- `liza-app.css`
  - compiled styles for the main landing

### YClients connection page
- `yclients-connect/index.html`
  - standalone connection page UI
  - receives `salon_id` and `user_data` from URL
- `TILDA_YCLIENTS_CONNECT_SNIPPET.html`
  - iframe snippet for embedding the YClients page inside Tilda
- `TILDA_YCLIENTS_CONNECT_BRIDGE_SCRIPT.html`
  - bridge script for the hidden Tilda form on the YClients page
- `TILDA_YCLIENTS_CONNECT_IFRAME_SNIPPET_GITHUB_PAGES.html`
  - mirror iframe snippet for the GitHub Pages setup

### Tilda bridge files
The main landing also relies on Tilda bridge/snippet files that live in the development branch workflow. If you need to modify the Tilda HTML blocks for the main landing, use the corresponding snippet files from the working branch and republish the Tilda page after updating the HTML block.

## Architecture
### Main landing page flow
1. User opens `https://liza-ai-admin.ru/notifications`
2. Tilda page loads an iframe with the main GitHub Pages asset page
3. UI is rendered by `liza-app.js`
4. Tilda remains responsible for the page container and embedded integration points

### YClients page flow
1. User opens `https://liza-ai-admin.ru/notifications/connect-yclients`
2. Query params are passed through to the iframe:
   - `salon_id`
   - `user_data`
3. `yclients-connect/index.html` reads those params and prepares the visible form
4. On submit, the iframe posts a payload to the parent Tilda page
5. `TILDA_YCLIENTS_CONNECT_BRIDGE_SCRIPT.html` fills the hidden native Tilda form
6. Tilda sends the submission to Telegram / Leads / other enabled receivers

## Query parameters for YClients page
Expected URL format:

```text
https://liza-ai-admin.ru/notifications/connect-yclients?salon_id=12345&user_data=BASE64_JSON
```

Where:
- `salon_id` — salon identifier
- `user_data` — base64-encoded JSON payload, currently expected to contain at least `email`

Example JSON before base64 encoding:

```json
{"email":"test@example.com"}
```

## Tilda setup
### Main landing page
The main landing uses a Tilda HTML block that embeds the published `index.html` asset page. If the embedding snippet changes, you must:
1. update the HTML block in Tilda
2. save the block
3. republish the Tilda page

### YClients connection page
The Tilda page should contain **three blocks in this order**:

1. **HTML block with iframe snippet**
   - insert the contents of `TILDA_YCLIENTS_CONNECT_SNIPPET.html`

2. **Hidden native Tilda form**
   - CSS class on the block: `uc-liza-yclients-shadow-form-wrap`
   - visible fields in the form:
     - `Телефон` -> variable name `phone`
     - `Как удобнее связаться` -> variable name `contact_preference`
   - receiver must be enabled for this exact form block

3. **HTML block with bridge script**
   - insert the contents of `TILDA_YCLIENTS_CONNECT_BRIDGE_SCRIPT.html`

After any snippet/script update:
1. save the HTML block(s)
2. republish the Tilda page

## Publishing workflow
### For UI changes on the main landing
1. edit `index.html`, `liza-app.js`, and/or `liza-app.css`
2. if asset content changed, bump `?v=` in `index.html`
3. commit changes to `gh-pages`
4. verify the published GitHub Pages URL
5. if a Tilda embedding snippet also changed, update the Tilda HTML block and republish the Tilda page

### For UI changes on the YClients page
1. edit `yclients-connect/index.html` or the YClients Tilda snippet/bridge files
2. commit changes to `gh-pages`
3. verify the GitHub Pages page directly
4. if snippet or bridge script changed, update the corresponding Tilda HTML block(s)
5. republish the Tilda page

## Verification checklist
### Main landing page
Check on desktop and mobile:
- hero renders correctly
- navigation works
- popup form opens/closes
- `Как это работает` phone mockup is aligned correctly
- `Почему салоны выбирают Лизу?` icon + metric pill layout looks correct
- `Что меняется после подключения Лизы?` icons are visible and aligned
- no horizontal overflow on mobile

### YClients page
Check:
- query params are present in the page URL
- visible form opens correctly inside the iframe
- hidden Tilda form is not visible
- submission reaches Tilda Leads / Telegram
- console logs from the bridge show payload received and hidden form submission path

## Developer handoff
Recommended handoff model:
- give developers access to the **GitHub repository** as collaborators
- give developers access to the **Tilda project**
- keep using the existing repository instead of re-uploading the project elsewhere

Why:
- preserves commit history
- keeps `main` and `gh-pages` in one place
- avoids losing the Tilda integration knowledge tied to this repo

## Notes
- The project is not a plain static website; it is a hybrid of Tilda container pages and GitHub Pages assets.
- Tilda HTML blocks do **not** auto-sync with repository files. If a snippet file changes in Git, the corresponding Tilda block must be updated manually.
- YClients bridge logic should be treated carefully, because the working submit path depends on the hidden Tilda form configuration.
