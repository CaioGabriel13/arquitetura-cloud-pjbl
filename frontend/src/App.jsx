import { Route, Routes } from "react-router-dom";
import MovieDetails from "./pages/MovieDetails";
import MovieList from "./pages/MovieList";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 MovieHub</h1>
        <p>Catálogo de filmes — PJBL Arquitetura e Soluções Cloud</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/filmes/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </div>
  );
}
