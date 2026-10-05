# Prompt.md — Uso de IA Generativa (IAG)

Este projeto foi desenvolvido com apoio do **Claude Code** (Anthropic), utilizado como ferramenta de IA Generativa para gerar o frontend em React, a API mock em Azure Functions e os arquivos de configuração/documentação do projeto.

## Ferramenta utilizada

- **Claude Code** (modelo Claude Sonnet 5), via CLI/extensão de IDE.

## Prompt inicial (enunciado do professor)

```
Em grupo PJBL, alunos criam frontend que se comunica com azure functions e mock backend.
(Opcional: utilizar React, opcional: utilizar Module Federation).
No mínimo duas funcionalidades/telas do projeto PJBL.
No repo deve conter um arquivo GRUPO.md com o nome dos alunos.
Comunicação do frontend com pelo menos 1 endpoint GET de Azure Functions (utilizar dados mocks).
Outras funcionalidades: sugiro realizar o mock com Apidog.
Utilizar IAG.
Informe no arquivo Prompt.md qual o prompt utilizado para gerar o frontend.
Publicar no Azure Web Static Apps.
No arquivo Readme.MD deve conter o endereço do site criado no Azure Static Web Apps,
e se utilizou o Apidog para mock, informar os endereços.
```

## Prompts de acompanhamento usados para gerar o frontend e a API

1. **Definição do tema e stack** — solicitado à IA que sugerisse um tema simples de PJBL com duas telas, e que utilizasse React (Vite) no frontend e Azure Functions (Node.js, modelo de programação v4) como backend mock, atendendo aos requisitos do enunciado.

   > "Sugira um tema simples para o PJBL com duas telas fáceis de mockar e demonstrar, usando React no frontend e Azure Functions com dados mock no backend."

2. **Geração do frontend (React + Vite)**:

   > "Crie um projeto React com Vite contendo duas telas: uma lista de filmes (grid com pôster, título, ano, gênero e nota) e uma tela de detalhes do filme (sinopse, diretor, nota). A lista deve navegar para os detalhes usando React Router. Os dados devem vir de uma API em `/api/movies` e `/api/movies/{id}`."

3. **Geração da API mock (Azure Functions)**:

   > "Crie um projeto Azure Functions em Node.js (modelo de programação v4) com dois endpoints HTTP GET: `/api/movies`, retornando uma lista de filmes mockados (id, título, ano, gênero, nota, pôster), e `/api/movies/{id}`, retornando os detalhes completos de um filme (incluindo diretor e sinopse) ou 404 se não existir."

4. **Configuração de deploy no Azure Static Web Apps**:

   > "Configure o projeto para publicação no Azure Static Web Apps com a API de Azure Functions integrada (pasta `api`), incluindo `staticwebapp.config.json` para o roteamento client-side do React Router e um workflow do GitHub Actions para deploy automático."

5. **Documentação do repositório**:

   > "Gere os arquivos GRUPO.md (com os nomes dos integrantes), Prompt.md (documentando os prompts usados) e README.md (com instruções de execução local, deploy e o endereço público do site após a publicação)."

## Observação

Os prompts acima foram utilizados de forma iterativa em uma sessão de chat com o Claude Code, que gerou o código-fonte completo (frontend, API e arquivos de configuração). O código gerado foi revisado, testado localmente (build do frontend e execução da API com Azure Functions Core Tools) e ajustado pelo grupo antes da publicação.

---

# TDE — Vertical Slice + Clean Architecture + SOLID no backend

Refatoração do backend (`api/`) feita com apoio do **Claude Code** (Anthropic, modelo configurado `claude-opus-5-5`)
na branch `refactor/vertical-slice-clean-architecture`.

## Prompt 1 — enunciado (prompt principal)

```
Utilizar IA Generativa para aplicar o VERTICAL SLICE e CLEAN ARCHITECTURE e SOLID no backend da aplicação TDE 2.
Utilizar o código da aplicação que está sendo criada no TDE 2.

Em documento PDF entregar:

No arquivo deve constar o nome dos ALUNOS que auxiliou na tarefa, independente de ser atividade em grupo. (Descreva o que cada aluno realizou).
Informar o GITHUB do projeto em uma nova branch.
Informar todos os prompts utilizados para modificar a aplicação.
Entregar diagrama de classes e componentes do BACKEND da aplicação em VERTICAL SLICE e CLEAN ARCHITECTURE e SOLID (gerar em markdown e imagem).

https://github.com/CaioGabriel13/arquitetura-cloud-pjbl.git

no documento deixe em evidencia como foi estruturado os 3 principios.
```

## Prompt 2 — resposta à pergunta da IA sobre a divisão de tarefas

A IA perguntou como preencher a descrição do que cada aluno realizou. Resposta enviada:

```
Sugira uma divisão
```

## Resultado

- Backend reorganizado em `api/src/modules/movies/features/` (uma pasta por funcionalidade = Vertical Slice).
- Camadas Domain / Application (ports) / Interface Adapters / Frameworks & Drivers (Clean Architecture).
- SOLID aplicado em cada classe (detalhes no PDF de entrega e em [docs/arquitetura/README.md](docs/arquitetura/README.md)).
- 17 testes automatizados (`cd api && npm test`), incluindo teste de paridade do contrato HTTP consumido pelo frontend.
