import React from "react";
import "./MovieApp.css";

export const MovieCard = ({ movie, onTrailerClick }) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <button className="trailer-button" onClick={() => onTrailerClick(movie.id)}>
        Ver Trailer
      </button>
    </div>
  );
};
