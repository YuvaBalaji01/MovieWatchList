const MovieCard = ({ movie, onAdd }) => {
  return (
    <div className="movie-card">
      <div className="image-wrapper">
        <img
          src={movie.poster_path || movie.img}
          alt={movie.title}
        />

        <div className="card-overlay">
          <button
            className="add-btn"
            disabled={movie.added}
            onClick={() => onAdd(movie, "trending")}
          >
            {movie.added ? "Added ✔" : "+ Add to List"}
          </button>
        </div>
      </div>

      <div className="movie-details">
        <h3>{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
