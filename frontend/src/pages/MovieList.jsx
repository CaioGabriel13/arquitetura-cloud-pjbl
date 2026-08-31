import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovies } from "../api/movies";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies()
      .then((data) => {
        setMovies(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  if (status === "loading") {
    return <p className="state-message">Carregando filmes...</p>;
  }

  if (status === "error") {
    return <p className="state-message error">Falha ao carregar filmes: {error}</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <Link to={`/filmes/${movie.id}`} key={movie.id} className="movie-card">
          <img src={movie.poster} alt={`Pôster de ${movie.title}`} />
          <div className="movie-card-body">
            <h3>{movie.title}</h3>
            <p>
              {movie.year} · {movie.genre}
            </p>
            <span className="rating">★ {movie.rating}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
