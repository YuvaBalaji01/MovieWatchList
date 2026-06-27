import { useEffect, useState } from "react";
import MovieGrid from "./MovieGrid";
import HeroSlider from "./HeroSlider";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";



const Hero = ({ setSearchQuery, searchQuery, refreshWatchlistCount }) => {

  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [oscarMovies, setOscarMovies] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const isMyListPage = location.pathname === "/my-list";
  const isLoginPage = location.pathname === "/login";
  const [fade, setFade] = useState(true);
  

  const fetchWatchlist = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const unwatched = data.filter(movie => !movie.watched);

      setWatchlistMovies(unwatched);

      if (unwatched.length > 0)
        setCurrentMovie(unwatched[0]);
      else
        setCurrentMovie(null);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

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

  //Movie sliding 
  useEffect(() => {
    if (!token) return;

    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/movies`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        const unwatched = data.filter(movie => !movie.watched);

        setWatchlistMovies(unwatched);

        if (unwatched.length > 0) {
          setCurrentMovie(unwatched[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWatchlist();
  }, []);


  //Sliding
  useEffect(() => {
    if (watchlistMovies.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        index = (index + 1) % watchlistMovies.length;
        setCurrentMovie(watchlistMovies[index]);
      },500)
      
    }, 5000);

    return () => clearInterval(interval);
  }, [watchlistMovies]);


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
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        overview: movie.overview,
        releaseDate: movie.release_date
      })
    });

    if (!res.ok) return;

    refreshWatchlistCount();
    await fetchWatchlist();

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

      <HeroSlider currentMovie={currentMovie} />

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
          <MovieGrid movies={searchResults} onAdd={handleAddToList} />
      </div>


      <div className="content-section">
        <h2>New Arrivals</h2>
        <MovieGrid movies={movies} onAdd={handleAddToList} />
      </div>

      <div className="content-section">
        <h2>Award Winning Movies</h2>
        <MovieGrid movies={oscarMovies} onAdd={handleAddToList} />
      </div>


    </section>
  );
};

export default Hero;

