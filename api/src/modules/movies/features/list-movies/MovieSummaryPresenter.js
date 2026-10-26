/**
 * Presenter (Interface Adapter) — converte a entidade Movie no DTO
 * resumido exibido no grid do frontend.
 *
 * É aqui que o BFF "recorta" o contrato para a tela: o microsserviço devolve
 * o filme completo, mas a listagem só precisa destes campos.
 */
export class MovieSummaryPresenter {
  /** @param {import("../../domain/Movie.js").Movie} movie */
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
