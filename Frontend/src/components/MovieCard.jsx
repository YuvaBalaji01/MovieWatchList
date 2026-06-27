const MovieCard = ({ movie, onAdd }) => {
  return (
    <div className="movie-card">
        <img
          src={movie.poster_path? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.img}
          alt={movie.title}
        />

        <button
          className="add-btn"
          disabled={movie.added}
          onClick={() => onAdd(movie, "trending")}
        >
          {movie.added ? "✔" : "+"}
        </button>
      
    </div>
  );
};

export default MovieCard;
