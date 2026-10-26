/**
 * Dados mock do catálogo (fonte de verdade do microsserviço movies-catalog).
 * Antes ficavam dentro da API; agora pertencem exclusivamente a este serviço.
 */
export const moviesSeed = Object.freeze([
  {
    id: 1,
    title: "Interestelar",
    releaseYear: 2014,
    genre: "Ficção Científica",
    director: "Christopher Nolan",
    rating: 8.6,
    synopsis:
      "Um grupo de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.",
    posterUrl: "https://picsum.photos/seed/interestelar/400/600"
  },
  {
    id: 2,
    title: "A Origem",
    releaseYear: 2010,
    genre: "Ficção Científica",
    director: "Christopher Nolan",
    rating: 8.8,
    synopsis:
      "Um ladrão que invade sonhos para roubar segredos corporativos recebe a missão inversa: plantar uma ideia na mente de um alvo.",
    posterUrl: "https://picsum.photos/seed/aorigem/400/600"
  },
  {
    id: 3,
    title: "Matrix",
    releaseYear: 1999,
    genre: "Ação",
    director: "Lana e Lilly Wachowski",
    rating: 8.7,
    synopsis:
      "Um programador descobre que a realidade como ele a conhece é uma simulação criada por máquinas.",
    posterUrl: "https://picsum.photos/seed/matrix/400/600"
  },
  {
    id: 4,
    title: "O Poderoso Chefão",
    releaseYear: 1972,
    genre: "Drama",
    director: "Francis Ford Coppola",
    rating: 9.2,
    synopsis:
      "A saga da família Corleone, uma das mais poderosas famílias da máfia italoamericana, sob o comando do patriarca Vito Corleone.",
    posterUrl: "https://picsum.photos/seed/chefao/400/600"
  },
  {
    id: 5,
    title: "Divertida Mente",
    releaseYear: 2015,
    genre: "Animação",
    director: "Pete Docter",
    rating: 8.1,
    synopsis:
      "Dentro da mente da jovem Riley, cinco emoções competem para guiá-la através de uma mudança de vida difícil.",
    posterUrl: "https://picsum.photos/seed/divertidamente/400/600"
  },
  {
    id: 6,
    title: "Coringa",
    releaseYear: 2019,
    genre: "Drama",
    director: "Todd Phillips",
    rating: 8.4,
    synopsis:
      "Um comediante fracassado é levado à loucura e ao crime pela sociedade indiferente de Gotham City.",
    posterUrl: "https://picsum.photos/seed/coringa/400/600"
  }
]);
