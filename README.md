# MovieHub — PJBL Arquitetura e Soluções Cloud

Catálogo de filmes com frontend em **React (Vite)** consumindo um **BFF em Azure Functions** (Node.js), que por sua vez consulta o **microsserviço de catálogo** (`services/movies-catalog`). Frontend e BFF são publicados no **Azure Static Web Apps**.

```
React (frontend) ──/api──▶ BFF · Azure Functions (api/) ──HTTP /v1──▶ movies-catalog (services/movies-catalog/)
```

## Endereços

- **Site publicado (Azure Static Web Apps):** `<preencher após o deploy — ex: https://moviehub-xxxxx.azurestaticapps.net>`
- **API (Azure Functions, integrada ao Static Web Apps):** `<mesma URL acima>/api/movies`
- **Mock Apidog:** não utilizado neste projeto — os dados mockados ficam no repositório em memória do microsserviço de catálogo ([services/movies-catalog/src/modules/catalog/infrastructure/persistence/moviesSeed.js](services/movies-catalog/src/modules/catalog/infrastructure/persistence/moviesSeed.js)).

## Funcionalidades / Telas

1. **Lista de filmes** — grid com pôster, título, ano, gênero e nota, consumindo `GET /api/movies`.
2. **Detalhes do filme** — sinopse, diretor e nota, consumindo `GET /api/movies/{id}`.

## Estrutura do repositório

```
.
├── frontend/                 # React + Vite (SPA com React Router)
├── api/                      # BFF — Azure Functions (Node.js v4) — Vertical Slice + Clean Architecture
├── services/movies-catalog/  # Microsserviço de catálogo (Node.js) — Vertical Slice + Clean Architecture
├── docs/arquitetura/         # Diagramas e descrição da arquitetura (Mermaid + PNG/SVG)
├── GRUPO.md      # Integrantes do grupo
├── Prompt.md     # Prompts de IAG utilizados para gerar o projeto
└── README.md
```

##  Como rodar localmente

Pré-requisitos: [Node.js 22+](https://nodejs.org) e [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) (`npm i -g azure-functions-core-tools@4`).

### 1. Microsserviço de catálogo

```bash
cd services/movies-catalog
npm install
npm start   # http://localhost:3001  (GET /v1/movies, /v1/movies/:id, /health)
```

### 2. BFF (Azure Functions)

Em outro terminal:

```bash
cd api
npm install
npm start   # func start — sobe em http://localhost:7071
```

O BFF procura o microsserviço em `MOVIES_CATALOG_URL` (padrão `http://localhost:3001`).
Veja [api/local.settings.example.json](api/local.settings.example.json).

Endpoints consumidos pelo frontend (contrato inalterado):

- `GET http://localhost:7071/api/movies`
- `GET http://localhost:7071/api/movies/{id}`

### Testes (unitários, integração, e2e e arquitetura)

```bash
cd services/movies-catalog && npm test        # tudo
cd services/movies-catalog && npm run test:arch   # só ArchUnitTS
cd api && npm test                            # tudo (inclui e2e BFF -> microsserviço)
cd api && npm run test:arch                   # só ArchUnitTS
```

### Arquitetura do backend

BFF e microsserviço estão organizados em **Vertical Slices** (`src/modules/<módulo>/features/<funcionalidade>`),
com as camadas da **Clean Architecture** (Domain → Application → Interface Adapters → Frameworks & Drivers).
As regras são verificadas automaticamente por **testes de arquitetura com ArchUnitTS**.
Detalhes, diagrama e lista de regras em [docs/arquitetura/bff-microsservicos.md](docs/arquitetura/bff-microsservicos.md).

### 3. Frontend (React)

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
5. O microsserviço `services/movies-catalog` não é publicado pelo Static Web Apps. Para usar o BFF em produção, publique-o (ex.: Azure Container Apps ou App Service) e configure a variável de aplicativo `MOVIES_CATALOG_URL` do Static Web App com a URL dele. Sem isso, o BFF responde 502.

## IAG

Este projeto foi gerado com apoio de IA Generativa (Claude Code). Os prompts utilizados estão documentados em [Prompt.md](Prompt.md).

## Grupo

Ver [GRUPO.md](GRUPO.md).
