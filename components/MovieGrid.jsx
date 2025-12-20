import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onAdd }) => {
  return (
    <div className="movies-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie._id || movie.id}
          movie={movie}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
