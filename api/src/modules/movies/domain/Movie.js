const { ValidationError } = require("../../../shared/domain/errors");
const { MovieId } = require("./MovieId");

/**
 * Entidade de domínio — Filme.
 *
 * Camada mais interna da Clean Architecture: não importa nada de
 * infraestrutura, HTTP ou Azure. Concentra apenas regras/invariantes
 * do conceito "filme".
 */
class Movie {
  constructor({ id, title, year, genre, director, rating, synopsis, poster }) {
    this.id = id instanceof MovieId ? id : MovieId.from(id);
    this.title = Movie.#requireText(title, "title");
    this.year = Movie.#requireYear(year);
    this.genre = Movie.#requireText(genre, "genre");
    this.director = Movie.#requireText(director, "director");
    this.rating = Movie.#requireRating(rating);
    this.synopsis = Movie.#requireText(synopsis, "synopsis");
    this.poster = poster ?? null;
    Object.freeze(this);
  }

  static create(props) {
    return new Movie(props);
  }

  static #requireText(value, field) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new ValidationError(`Campo "${field}" do filme é obrigatório.`);
    }
    return value;
  }

  static #requireYear(value) {
    if (!Number.isInteger(value) || value < 1888) {
      throw new ValidationError(`Ano do filme inválido: ${value}.`);
    }
    return value;
  }

  static #requireRating(value) {
    if (typeof value !== "number" || value < 0 || value > 10) {
      throw new ValidationError(`Nota do filme deve estar entre 0 e 10: ${value}.`);
    }
    return value;
  }
}

module.exports = { Movie };
