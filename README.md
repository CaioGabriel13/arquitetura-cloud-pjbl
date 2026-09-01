# MovieHub — PJBL Arquitetura e Soluções Cloud

Catálogo de filmes com frontend em **React (Vite)** consumindo uma API mock em **Azure Functions** (Node.js), publicado no **Azure Static Web Apps**.

## Endereços

- **Site publicado (Azure Static Web Apps):** `<preencher após o deploy — ex: https://moviehub-xxxxx.azurestaticapps.net>`
- **API (Azure Functions, integrada ao Static Web Apps):** `<mesma URL acima>/api/movies`
- **Mock Apidog:** não utilizado neste projeto — os dados mockados estão embutidos diretamente na Azure Function ([api/src/data/movies.js](api/src/data/movies.js)).

## Funcionalidades / Telas

1. **Lista de filmes** — grid com pôster, título, ano, gênero e nota, consumindo `GET /api/movies`.
2. **Detalhes do filme** — sinopse, diretor e nota, consumindo `GET /api/movies/{id}`.

## Estrutura do repositório

```
.
├── frontend/     # React + Vite (SPA com React Router)
├── api/          # Azure Functions (Node.js, modelo de programação v4)
├── GRUPO.md      # Integrantes do grupo
├── Prompt.md     # Prompts de IAG utilizados para gerar o projeto
└── README.md
```

##  Como rodar localmente

Pré-requisitos: [Node.js 18+](https://nodejs.org) e [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) (`npm i -g azure-functions-core-tools@4`).

### 1. API (Azure Functions)

```bash
cd api
npm install
npm start   # func start — sobe em http://localhost:7071
```

Endpoints disponíveis:

- `GET http://localhost:7071/api/movies`
- `GET http://localhost:7071/api/movies/{id}`

### 2. Frontend (React)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

O Vite já está configurado (`vite.config.js`) para fazer proxy de `/api` para `http://localhost:7071`, então o frontend funciona sem configuração extra em desenvolvimento.

## Deploy no Azure Static Web Apps

1. Criar um repositório no GitHub e enviar este projeto (`git push`).
2. No [Portal do Azure](https://portal.azure.com), criar um recurso **Static Web App**:
   - **Deployment source:** GitHub (autorizar acesso ao repositório).
   - **Build Presets:** React.
   - **App location:** `frontend`
   - **Api location:** `api`
   - **Output location:** `dist`
3. O Azure cria automaticamente um workflow do GitHub Actions (`.github/workflows/azure-static-web-apps-*.yml`) que builda o frontend, publica a API de Azure Functions integrada e faz o deploy a cada push. O repositório já inclui um workflow equivalente em [.github/workflows/azure-static-web-apps.yml](.github/workflows/azure-static-web-apps.yml) — se optar por criar o recurso via CLI (`az staticwebapp create`) em vez do assistente do portal, basta cadastrar o token gerado como o secret `AZURE_STATIC_WEB_APPS_API_TOKEN` no GitHub (Settings → Secrets and variables → Actions).
4. Após o primeiro deploy, copiar a URL gerada (formato `https://<nome>.azurestaticapps.net`) e atualizar a seção **Endereços** deste README.

## IAG

Este projeto foi gerado com apoio de IA Generativa (Claude Code). Os prompts utilizados estão documentados em [Prompt.md](Prompt.md).

## Grupo

Ver [GRUPO.md](GRUPO.md).
