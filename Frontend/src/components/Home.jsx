import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";



const Hero = ({ setSearchQuery, searchQuery, searchResults, setSearchResults, refreshWatchlistCount }) => {

  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const [oscarMovies, setOscarMovies] = useState([]);
  const isMyListPage = location.pathname === "/my-list";
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const currentYear = new Date().getFullYear();

      const [nowPlayingRes, upcomingRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`
        )
      ]);

      const nowPlaying = await nowPlayingRes.json();
      const upcoming = await upcomingRes.json();

      const allMovies = [...nowPlaying.results, ...upcoming.results];

      // Remove duplicates
      const uniqueMovies = allMovies.filter(
        (movie, index, self) =>
          index === self.findIndex(m => m.id === movie.id)
      );

      const currentYearMovies = uniqueMovies
        .filter(
          movie =>
            movie.release_date &&
            new Date(movie.release_date).getFullYear() === currentYear
        )
        .sort(
          (a, b) =>
            new Date(b.release_date) - new Date(a.release_date)
        )
        .slice(0, 12);

      setMovies(currentYearMovies);
    };

    fetchNewArrivals();
  }, []);


  useEffect(() => {
    const fetchAwardMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=3000&primary_release_date.gte=2020-01-01&primary_release_date.lte=2025-12-31`
      );

      const data = await res.json();

      setOscarMovies(data.results.slice(0, 12));
    };

    fetchAwardMovies();
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
  const handleAddToList = async (movie, source) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const res = await fetch(`${API_BASE}/api/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: movie.title,
        rating: movie.vote_average || 0,
        watched: false,
        posterPath: movie.poster_path || movie.posterPath || movie.img
      })
    });

    if (!res.ok) return;

    refreshWatchlistCount();

    // ✅ SEARCH
    if (source === "search") {
      setSearchResults(prev =>
        prev.map(m =>
          m.id === movie.id ? { ...m, added: true } : m
        )
      );
    }

    // ✅ TRENDING
    if (source === "trending") {
      setMovies(prev =>
        prev.map(m =>
          m.id === movie.id ? { ...m, added: true } : m
        )
      );
    }

    // ✅ OSCAR
    if (source === "oscar") {
      setOscarMovies(prev =>
        prev.map(m =>
          m.id === movie.id ? { ...m, added: true } : m
        )
      );
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>There are total 3,51,89,546+Movies</h1>
        <h1>How many did You Watch?</h1>
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
            Get Started  →
          </button>
        )}

      </div>

      {/* 🔍 SEARCH RESULTS */}

      <div className="content-section">

        {!isMyListPage && !isLoginPage && (
          <input
            type="text"
            className="search-input"
            placeholder="Movie in Ur Mind? Search it!"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
        {searchResults.length > 0 && (
          <h2>Search Results</h2>)}

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
                    onClick={() => handleAddToList(movie, "oscar")}
                  >
                    {movie.added ? "Added ✔" : "+ Add to List"}
                  </button>
                </div>
              </div>

              <div className="movie-details">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 🔥 TRENDING */}
      <div className="content-section">

        <h2>New Arrivals</h2>
        <MovieGrid movies={movies} onAdd={handleAddToList} />

      </div>
      <div className="content-section">
        <h2>🏆 Award Winning Movies</h2>

        <div className="movies-grid">
          {oscarMovies.map(movie => (
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
                    onClick={() => handleAddToList(movie, "oscar")}
                  >
                    {movie.added ? "Added ✔" : "+ Add to List"}
                  </button>
                </div>
              </div>

              <div className="movie-details">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
};

export default Hero;

