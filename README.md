# RelayDeck Developer Portal

A React + TypeScript starter for the RelayDeck developer portal, with interactive API docs,
a webhook signing sandbox, delivery diagnostics, and signature-verification snippets.

## Scaffold commands

These are the equivalent commands for creating the app from an empty directory:

```bash
npm create vite@latest relaydeck -- --template react-ts
cd relaydeck
npm install
npm install lucide-react react-router-dom@^6 swagger-ui-react react-syntax-highlighter
npm install -D 'tailwindcss@^3.4' postcss autoprefixer @types/react-syntax-highlighter
```

In this repository, dependencies are declared in `package.json`. Install them and start the app:

```bash
npm install
npm run dev
```

## Routes

- `/docs` — interactive Swagger UI backed by `src/data/openapi.json`.
- `/sandbox` — generates a local demo HMAC signature and displays the simulated request.
- `/logs` — sample delivery records with HTTP statuses, retries, and RFC 7807 details.
- `/snippets` — Node.js, Python, and cURL examples.

The sandbox does **not** make a network request to the entered endpoint. Its signing key is a
public demo value and must never be used for production verification.

## Build

```bash
npm run build
```
