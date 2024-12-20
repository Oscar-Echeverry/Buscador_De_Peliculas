import React, { useState,useEffect } from "react";
import "./MovieApp.css";
import { MovieCard } from "./MovieCards";

export const MovieApp = () => {
  const [search, setSearch] = useState("");
  const [movieList, setMovieList] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(false);

  const urlBase = "https://api.themoviedb.org/3/search/movie";
  const API_KEY = "Key";

  // Manejo los cambios en el input de búsqueda
  const handleInputChange = ({ target }) => {
    setSearch(target.value);
  };

  // Manejo el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (search.trim() === "") {
      alert("Por favor, ingresa el nombre de una película.");
      return;
    }
    fetchMovies();
  };

  // Realizo la búsqueda de películas
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${urlBase}?query=${search}&api_key=${API_KEY}&language=es-ES`
      );
      const data = await response.json();
      setMovieList(data.results);
    } catch (error) {
      console.error("Error al buscar películas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busco el trailer de una película específica
  const fetchTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=es-ES`
      );
      const data = await response.json();

      // Filtra el trailer
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        setShowTrailer(true);
      } else {
        setTrailerUrl(null);
        alert("No hay trailer disponible para esta película.");
      }
    } catch (error) {
      console.error("Error al obtener el trailer:", error);
    }
  };

  // Cierra el modal al presionar 'Esc'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowTrailer(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="container">
      <h1>Buscador de Películas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe una película"
          value={search}
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <div className="loading-spinner">Cargando...</div>}

      {movieList && (
        <div className="movie-list">
          {movieList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onTrailerClick={fetchTrailer}
            />
          ))}
        </div>
      )}

      {/* Modal para mostrar el trailer */}
      {showTrailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-container" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={trailerUrl}
              title="Trailer"
              className="trailer-iframe"
              allowFullScreen
            ></iframe>
            <button
              className="close-button"
              onClick={() => setShowTrailer(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          Creado por <span>Oscar Echeverry</span> &copy; {new Date().getFullYear()} |{" "}
          <a
            href="https://www.linkedin.com/in/oscar-echeverri01/"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-link"
          >
            LinkedIn
          </a>{" "}
          |{" "}
          <a
            href="https://github.com/Oscar-Echeverry"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};