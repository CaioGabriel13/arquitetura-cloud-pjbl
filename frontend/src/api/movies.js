const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function handleResponse(response) {
  if (!response.ok) {
    const message = `Erro ${response.status} ao chamar ${response.url}`;
    throw new Error(message);
  }
  return response.json();
}

export async function fetchMovies() {
  const response = await fetch(`${API_BASE}/movies`);
  return handleResponse(response);
}

export async function fetchMovieById(id) {
  const response = await fetch(`${API_BASE}/movies/${id}`);
  return handleResponse(response);
}
