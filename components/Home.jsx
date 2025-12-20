import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";



const Hero = ({  searchQuery, searchResults, setSearchResults,refreshWatchlistCount }) => {
  
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    setMovies([
      {
        id: 1,
        title: "Oppenheimer",
        genre: "Drama",
        rating: 8.4,
        img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500"
      },
      {
        id: 2,
        title: "Spider-Man",
        genre: "Action",
        rating: 8.7,
        img: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=500"
      }
    ]);
  }, []);

  // 🔍 Search TMDB
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    };

    fetchMovies();
  }, [searchQuery]);

  // ➕ Add to backend
  const handleAddToList = async (movie) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  const res = await fetch("http://localhost:5000/api/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` // 🔥 REQUIRED
    },
    body: JSON.stringify({
      title: movie.title,
      rating: movie.vote_average || 0,
      watched: false,
      posterPath: movie.poster_path 
    })
  });

  if (res.ok) {
    refreshWatchlistCount();
    setSearchResults(prev =>
    prev.map(m =>
      m.id === movie.id ? { ...m, added: true } : m
    )
    );
  }
};



  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Unlimited Movies & TV Shows</h1>
        <p>Track your favorites. Organize your binge-watching. All in one place.</p>
        {token ? (
         <div className="logged-user">
         <span>Welcome, </span>
         <strong>{userEmail}</strong>
         </div>
         ) : (
         <button
         className="primary-btn"
         onClick={() => navigate("/login")}
         >
          Get Started
         </button>
        )}

      </div>

      {/* 🔍 SEARCH RESULTS */}
      {searchResults.length > 0 && (
        <div className="content-section">
          <h2>Search Results</h2>

          <div className="movies-grid">
            {searchResults.map(movie => (
              <div key={movie.id} className="movie-card">
                <div className="image-wrapper">
                  <img
                    src={
                      movie.poster_path
                        ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={movie.title}
                  />
                  <div className="card-overlay">
                    <button
                      className="add-btn"
                      disabled={movie.added}
                      onClick={() => handleAddToList(movie)}
                      >
                      {movie.added ? "Added" : "+ Add to List"}
                    </button>

                  </div>
                </div>

                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <div className="movie-meta">
                    <span> IMDB RATING :⭐ {movie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 TRENDING (STATIC) */}
      <div className="content-section">
        <h2>Trending Today</h2>
        <MovieGrid movies={movies} onAdd={handleAddToList} />
      </div>
    </section>
  );
};

export default Hero;
