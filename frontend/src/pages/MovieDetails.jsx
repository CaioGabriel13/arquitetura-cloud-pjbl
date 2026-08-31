import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMovieById } from "../api/movies";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("loading");
    fetchMovieById(id)
      .then((data) => {
        setMovie(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [id]);

  if (status === "loading") {
    return <p className="state-message">Carregando detalhes...</p>;
  }

  if (status === "error") {
    return <p className="state-message error">Falha ao carregar filme: {error}</p>;
  }

  return (
    <div className="movie-details">
      <Link to="/" className="back-link">
        ← Voltar para a lista
      </Link>
      <div className="movie-details-content">
        <img src={movie.poster} alt={`Pôster de ${movie.title}`} />
        <div>
          <h2>{movie.title}</h2>
          <p className="meta">
            {movie.year} · {movie.genre} · Direção: {movie.director}
          </p>
          <span className="rating">★ {movie.rating}</span>
          <p className="synopsis">{movie.synopsis}</p>
        </div>
      </div>
    </div>
  );
}
