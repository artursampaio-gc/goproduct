# Handoff — InvenTree (source ZIP, API 497) — 2026-05-29

## Projeto

Customização do InvenTree (download do ZIP master do GitHub, **API 497**) para adicionar widgets de dashboard. Tudo roda em modo **dev com hot-reload** a partir do código-fonte.

## Stack em execução

| Serviço | Como subir | URL |
|---|---|---|
| Backend (Django) | `cd contrib/container && docker compose -f docker-compose.dev.yml -p inventree-dev up -d` | http://localhost:8000 |
| Frontend (Vite) | `cd src/frontend && npm run dev` | http://localhost:5173 |

Login: **admin / inventree**

## `.claude/launch.json` (já criado)

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "Backend (Docker Compose dev)",
      "cwd": "contrib/container",
      "runtimeExecutable": "docker",
      "runtimeArgs": ["compose", "-f", "docker-compose.dev.yml", "-p", "inventree-dev", "up", "-d"],
      "port": 8000
    },
    {
      "name": "Frontend (Vite hot-reload)",
      "cwd": "src/frontend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 5173
    }
  ]
}
```

## Customizações já aplicadas

- **Logo substituída**: `src/frontend/src/components/items/InvenTreeLogo.tsx` usa `goproduct_logo.svg` (logo GoGroup azul, 28 px de altura) em vez do logo original InvenTree.
- **Arquivo SVG**: `src/frontend/src/components/items/goproduct_logo.svg` (também em `assets/images/`).

## Próximos passos sugeridos

Retomar com: **"Quero iniciar os servidores de dev — use o `.claude/launch.json` para subir o Backend e o Frontend"** — o Claude deve chamar `preview_start` para cada um conforme o arquivo.

## Gotchas importantes

- Build de produção precisa de `npm run compile` (lingui) **antes** de `npm run build` — senão tela em branco.
- `INVENTREE_AUTO_UPDATE=True` no compose para auto-migrations no boot.
- Frontend + backend **devem ser a mesma versão** — não misturar a imagem stable (v1.3.2 / API 477) com o source (API 497).
- Pasta do projeto: `C:\Users\Notebook\Documents\inventree\InvenTree-master\InvenTree-master`
