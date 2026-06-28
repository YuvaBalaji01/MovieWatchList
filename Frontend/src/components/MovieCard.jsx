import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, onAdd }) => {
  const navigate = useNavigate();
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
          onClick={() =>{
            e.stopPropagation();
            onAdd(movie, "trending")}}
        >
          {movie.added ? "✔" : "+"}
        </button>
      
    </div>
  );
};

export default MovieCard;
