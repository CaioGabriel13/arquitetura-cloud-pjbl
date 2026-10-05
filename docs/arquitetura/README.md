# Arquitetura do Backend — Vertical Slice + Clean Architecture + SOLID

Backend do **MovieHub** (Azure Functions, Node.js v4) refatorado com apoio de IA Generativa.
Os diagramas abaixo estão em **Mermaid** (renderizam direto no GitHub) e também como imagem
(`.png` e `.svg`) nesta mesma pasta.

## Legenda de cores (camadas da Clean Architecture)

| Cor | Camada | Exemplos |
|---|---|---|
| 🟨 Amarelo | **Domain** (Entities) | `Movie`, `MovieId`, `DomainError` |
| 🟥 Vermelho | **Application** (Use Cases + Ports) | `ListMoviesUseCase`, `MovieListReader` |
| 🟩 Verde | **Interface Adapters** | Controllers, Presenters, `azureHttpAdapter`, `errorMapper` |
| 🟦 Azul | **Frameworks & Drivers** | `*.function.js`, factories, `InMemoryMovieRepository` |

## Estrutura de pastas

```
api/src
├── index.js                                   # entry point: registra as slices
├── shared/                                    # Shared Kernel (usado por todas as slices)
│   ├── kernel/defineInterface.js              # contrato de interface (portas)
│   ├── domain/errors/                         # DomainError, NotFoundError, ValidationError
│   └── http/                                  # azureHttpAdapter, errorMapper, httpResponses
└── modules/movies/
    ├── domain/                                # Movie (entity), MovieId (value object)
    ├── application/ports/                     # MovieListReader, MovieByIdReader (interfaces)
    ├── infrastructure/persistence/            # InMemoryMovieRepository + moviesSeed (mock)
    ├── movies.container.js                    # composition root do módulo
    └── features/                              # ← VERTICAL SLICES
        ├── list-movies/                       # GET /api/movies
        │   ├── listMovies.function.js         #   Frameworks & Drivers
        │   ├── listMovies.factory.js          #   Injeção de dependência
        │   ├── ListMoviesController.js        #   Interface Adapter
        │   ├── MovieSummaryPresenter.js       #   Interface Adapter
        │   └── ListMoviesUseCase.js           #   Application
        └── get-movie-by-id/                   # GET /api/movies/{id}
            ├── getMovieById.function.js
            ├── getMovieById.factory.js
            ├── GetMovieByIdController.js
            ├── MovieDetailsPresenter.js
            └── GetMovieByIdUseCase.js
```

## Diagrama de Componentes

![Diagrama de componentes](diagrama-componentes.png)

```mermaid
flowchart TB
    FE["React SPA (frontend)"]:::ext
    RT["Azure Functions Runtime · Azure Static Web Apps<br/>src/index.js «entry point»"]:::fw

    subgraph S1["«component» Vertical Slice · list-movies"]
        direction TB
        F1["listMovies.function «Azure Function»"]:::fw
        FA1["listMovies.factory «DI»"]:::fw
        C1["ListMoviesController"]:::ad
        P1["MovieSummaryPresenter"]:::ad
        U1["ListMoviesUseCase"]:::app
        F1 --> FA1 --> C1 --> P1
        C1 --> U1
    end

    subgraph S2["«component» Vertical Slice · get-movie-by-id"]
        direction TB
        F2["getMovieById.function «Azure Function»"]:::fw
        FA2["getMovieById.factory «DI»"]:::fw
        C2["GetMovieByIdController"]:::ad
        P2["MovieDetailsPresenter"]:::ad
        U2["GetMovieByIdUseCase"]:::app
        F2 --> FA2 --> C2 --> P2
        C2 --> U2
    end

    subgraph PORTS["«component» Movies · Application Ports"]
        direction LR
        PL(["MovieListReader «interface»"]):::app
        PB(["MovieByIdReader «interface»"]):::app
    end

    subgraph INFRA["«component» Movies · Infrastructure"]
        direction LR
        CONT["movies.container «composition root»"]:::fw
        REPO["InMemoryMovieRepository"]:::fw
        SEED[("moviesSeed (mock)")]:::fw
        CONT --> REPO --> SEED
    end

    subgraph DOM["«component» Movies · Domain"]
        direction LR
        M["Movie «entity»"]:::dom
        MID["MovieId «value object»"]:::dom
        M --> MID
    end

    subgraph SH["«component» Shared"]
        direction LR
        AD["azureHttpAdapter"]:::ad
        EM["errorMapper"]:::ad
        HR["httpResponses"]:::ad
        ERR["DomainError · NotFound · Validation"]:::dom
        DI["defineInterface «kernel»"]:::dom
        AD --> EM --> ERR
    end

    FE -- "HTTP GET /api/movies · /api/movies/{id}" --> RT
    RT --> S1
    RT --> S2
    S1 -- "requer MovieListReader" --> PORTS
    S2 -- "requer MovieByIdReader" --> PORTS
    INFRA -. "implementa (provê)" .-> PORTS
    S1 -- "usa factory" --> INFRA
    S2 -- "usa factory" --> INFRA
    PORTS --> DOM
    INFRA --> DOM
    S1 --> SH
    S2 --> SH
    DOM --> SH

    classDef dom fill:#FFF4C2,stroke:#B8900B,color:#3D3000
    classDef app fill:#FADBD8,stroke:#B03A2E,color:#4A0F09
    classDef ad fill:#D5F5E3,stroke:#1E8449,color:#0B3D20
    classDef fw fill:#D6EAF8,stroke:#1F618D,color:#0B2A40
    classDef ext fill:#EEEEEE,stroke:#666,color:#222
```

## Diagrama de Classes

![Diagrama de classes](diagrama-classes.png)

```mermaid
classDiagram
direction TB

namespace Shared {
    class DomainError {
        +string name
        +string message
    }
    class NotFoundError {
        <<error>>
    }
    class ValidationError {
        <<error>>
    }
    class defineInterface {
        <<kernel>>
        +name: string
        +methods: string[]
        +isImplementedBy(candidate) boolean
        +ensure(candidate) object
    }
    class AzureHttpAdapter {
        <<adapter>>
        +adaptAzureHttp(makeController) AzureHandler
    }
    class ErrorMapper {
        <<adapter>>
        +mapErrorToHttpResponse(error) HttpResponse
        +registerErrorMapping(ErrorType, toResponse) void
    }
    class HttpResponses {
        <<adapter>>
        +ok(body) HttpResponse
        +badRequest(message) HttpResponse
        +notFound(message) HttpResponse
        +internalError() HttpResponse
    }
}

namespace Movies_Domain {
    class Movie {
        <<entity>>
        +MovieId id
        +string title
        +number year
        +string genre
        +string director
        +number rating
        +string synopsis
        +string poster
        +create(props)$ Movie
    }
    class MovieId {
        <<value object>>
        -number value
        +from(raw)$ MovieId
        +equals(other) boolean
        +toString() string
    }
}

namespace Movies_Ports {
    class MovieListReader {
        <<interface>>
        +findAll() Promise~Movie[]~
    }
    class MovieByIdReader {
        <<interface>>
        +findById(id MovieId) Promise~Movie or null~
    }
}

namespace Slice_ListMovies {
    class ListMoviesUseCase {
        <<use case>>
        -MovieListReader reader
        +execute() Promise~Movie[]~
    }
    class ListMoviesController {
        <<controller>>
        -ListMoviesUseCase useCase
        +handle(httpRequest) Promise~HttpResponse~
    }
    class MovieSummaryPresenter {
        <<presenter>>
        +toDto(movie)$ MovieSummaryDto
        +toDtoList(movies)$ MovieSummaryDto[]
    }
    class ListMoviesFactory {
        <<factory>>
        +makeListMoviesController(deps) ListMoviesController
    }
}

namespace Slice_GetMovieById {
    class GetMovieByIdUseCase {
        <<use case>>
        -MovieByIdReader reader
        +execute(input) Promise~Movie~
    }
    class GetMovieByIdController {
        <<controller>>
        -GetMovieByIdUseCase useCase
        +handle(httpRequest) Promise~HttpResponse~
    }
    class MovieDetailsPresenter {
        <<presenter>>
        +toDto(movie)$ MovieDetailsDto
    }
    class GetMovieByIdFactory {
        <<factory>>
        +makeGetMovieByIdController(deps) GetMovieByIdController
    }
}

namespace Movies_Infrastructure {
    class InMemoryMovieRepository {
        <<repository>>
        -Movie[] movies
        +findAll() Promise~Movie[]~
        +findById(id MovieId) Promise~Movie or null~
    }
    class MoviesContainer {
        <<composition root>>
        +getMovieListReader() MovieListReader
        +getMovieByIdReader() MovieByIdReader
    }
}

DomainError <|-- NotFoundError
DomainError <|-- ValidationError
Movie *-- MovieId
MovieId ..> ValidationError : lança

MovieListReader ..> defineInterface : definida por
MovieByIdReader ..> defineInterface : definida por
InMemoryMovieRepository ..|> MovieListReader
InMemoryMovieRepository ..|> MovieByIdReader
InMemoryMovieRepository o-- Movie
MoviesContainer ..> InMemoryMovieRepository : instancia

ListMoviesUseCase --> MovieListReader : DIP
ListMoviesController --> ListMoviesUseCase
ListMoviesController ..> MovieSummaryPresenter
ListMoviesFactory ..> ListMoviesController : cria
ListMoviesFactory ..> MoviesContainer

GetMovieByIdUseCase --> MovieByIdReader : DIP
GetMovieByIdUseCase ..> MovieId : valida id
GetMovieByIdUseCase ..> NotFoundError : lança
GetMovieByIdController --> GetMovieByIdUseCase
GetMovieByIdController ..> MovieDetailsPresenter
GetMovieByIdFactory ..> GetMovieByIdController : cria
GetMovieByIdFactory ..> MoviesContainer

MovieSummaryPresenter ..> Movie
MovieDetailsPresenter ..> Movie
ListMoviesController ..> HttpResponses
GetMovieByIdController ..> HttpResponses
AzureHttpAdapter ..> ErrorMapper
ErrorMapper ..> DomainError
```

## Regra de dependência

```
Frameworks & Drivers  ──►  Interface Adapters  ──►  Application  ──►  Domain
 (*.function, factory,      (Controller,             (UseCase,        (Movie,
  InMemoryRepository)        Presenter, adapter)      Ports)           MovieId)
```

As setas de código-fonte apontam sempre **para dentro**. O domínio e os casos de uso não
importam `@azure/functions` nem conhecem a origem dos dados. O repositório (camada externa)
**implementa** as portas definidas na camada de aplicação — inversão de dependência.
