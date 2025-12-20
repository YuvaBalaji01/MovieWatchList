const MovieCard = ({ movie, onAdd }) => {
  return (
    <div className="movie-card">
      <img src={movie.img} alt={movie.title} />
      <h3>{movie.title}</h3>
      <button onClick={() => onAdd(movie)}>+ Add to List</button>
    </div>
  );
};

export default MovieCard;
