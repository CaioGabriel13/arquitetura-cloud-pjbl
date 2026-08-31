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
