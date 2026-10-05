/**
 * Presenter (Interface Adapter) — converte a entidade Movie no DTO
 * completo exibido na tela de detalhes do frontend.
 *
 * SRP: a única razão para mudar é o formato de saída dos detalhes.
 */
class MovieDetailsPresenter {
  /** @param {import("../../domain/Movie").Movie} movie */
  static toDto(movie) {
    return {
      id: movie.id.value,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      director: movie.director,
      rating: movie.rating,
      synopsis: movie.synopsis,
      poster: movie.poster
    };
  }
}

module.exports = { MovieDetailsPresenter };
