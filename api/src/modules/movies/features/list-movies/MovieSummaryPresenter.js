/**
 * Presenter (Interface Adapter) — converte a entidade Movie no DTO
 * resumido exibido no grid do frontend.
 *
 * SRP: a única razão para mudar é o formato de saída da listagem.
 */
class MovieSummaryPresenter {
  /** @param {import("../../domain/Movie").Movie} movie */
  static toDto(movie) {
    return {
      id: movie.id.value,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      rating: movie.rating,
      poster: movie.poster
    };
  }

  static toDtoList(movies) {
    return movies.map(MovieSummaryPresenter.toDto);
  }
}

module.exports = { MovieSummaryPresenter };
