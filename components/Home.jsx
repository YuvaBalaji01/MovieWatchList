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
  const [oscarMovies, setOscarMovies] = useState([]);

  useEffect(() => {
  setMovies([
    {
      id: 1,
      title: "Pokiri",
      genre: "Action",
      rating: 8.0,
      img: "https://upload.wikimedia.org/wikipedia/en/3/3a/Pokiri_Movie_Poster.jpg"
    },
    {
      id: 2,
      title: "Athadu",
      genre: "Action / Thriller",
      rating: 8.2,
      img: "https://upload.wikimedia.org/wikipedia/en/8/8a/Athadu_Movie_Poster.jpg"
    },
    {
      id: 3,
      title: "Interstellar",
      genre: "Sci-Fi / Drama",
      rating: 8.6,
      img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
      id: 4,
      title: "Race Gurram",
      genre: "Action / Comedy",
      rating: 7.4,
      img: "https://upload.wikimedia.org/wikipedia/en/1/1f/Race_Gurram.jpg"
    },
    {
      id: 5,
      title: "Atharintiki Daaredi",
      genre: "Family / Drama",
      rating: 7.8,
      img: "https://upload.wikimedia.org/wikipedia/en/2/2e/Atharintiki_Daaredi.jpg"
    },
    {
      id: 6,
      title: "Titanic",
      genre: "Romance / Drama",
      rating: 7.9,
      img: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"
    },

    // ⭐ My 5 Favourite Movies
    {
      id: 7,
      title: "The Dark Knight",
      genre: "Action / Crime",
      rating: 9.0,
      img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
      id: 8,
      title: "Inception",
      genre: "Sci-Fi / Thriller",
      rating: 8.8,
      img: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
    },
    {
      id: 9,
      title: "Forrest Gump",
      genre: "Drama / Romance",
      rating: 8.8,
      img: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"
    },
    {
      id: 10,
      title: "Fight Club",
      genre: "Drama",
      rating: 8.8,
      img: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg"
    },
    {
      id: 11,
      title: "The Shawshank Redemption",
      genre: "Drama",
      rating: 9.3,
      img: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
    }
  ]);
}, []);


  const OSCAR_WINNERS = [
  {
    id: 157336,
    title: "Interstellar",
    year: 2014,
    awards: "Best Visual Effects",
    posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: 27205,
    title: "Inception",
    year: 2010,
    awards: "Best Cinematography, Sound Editing",
    posterPath: "/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    year: 1994,
    awards: "7 Nominations",
    posterPath: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  },
  {
    id: 238,
    title: "The Godfather",
    year: 1972,
    awards: "Best Picture",
    posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
  },
  {
    id: 424,
    title: "Schindler's List",
    year: 1993,
    awards: "Best Picture",
    posterPath: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"
  },
  {
    id: 240,
    title: "The Godfather Part II",
    year: 1974,
    awards: "Best Picture",
    posterPath: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg"
  },
  {
    id: 129,
    title: "Spirited Away",
    year: 2001,
    awards: "Best Animated Feature",
    posterPath: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"
  },
  {
    id: 389,
    title: "12 Angry Men",
    year: 1957,
    awards: "3 Nominations",
    posterPath: "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg"
  }
];

useEffect(() => {
  setOscarMovies(OSCAR_WINNERS);
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

  const res = await fetch("http://localhost:5000/api/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: movie.title,
      rating: movie.vote_average || 0,
      watched: false,
      posterPath: movie.poster_path || movie.posterPath
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
        <h2>My Suggestions</h2>
        <MovieGrid movies={movies} onAdd={handleAddToList} />
        
      </div>

      {OSCAR_WINNERS.length > 0 && (
  <div className="content-section">
    <h2>🏆 Oscar Winners</h2>

    <div className="movies-grid">
      {oscarMovies.map(movie => (
        <div key={movie.id} className="movie-card">
          <div className="image-wrapper">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
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
            <span className="award">🏆 {movie.awards}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}



    </section>
  );
};

export default Hero;
