import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, onAdd,watchlistIds }) => {
  const navigate = useNavigate();
  const added = watchlistIds.has(movie.id);
  return (
    <div className="movie-card"
      onClick={() => navigate(`/movie/${movie.tmdbId || movie.id}`)}
    >
        <img
          src={movie.poster_path? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.img}
          alt={movie.title}
        />

        <button
          className="add-btn"
          disabled={movie.added}
          onClick={(e) =>{
            e.stopPropagation();
            onAdd(movie, "trending")}}
        >
          {added ? "✔" : "+"}
        </button>
      
    </div>
  );
};

export default MovieCard;
