import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onAdd,watchlistIds }) => {
  return (
    <div className="movies-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie._id || movie.id}
          movie={movie}
          onAdd={onAdd}
          watchlistIds = {watchlistIds}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
