import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import MovieGrid from "./MovieGrid";

const MyList = ({ refreshWatchlistCount }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("toWatch");

  const groupMoviesByDate = (movies, type) => {

    return movies.reduce((groups, movie) => {

      const date = new Date(
        type === "watched"
          ? movie.watchedAt
          : movie.createdAt
      );

      const key = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(movie);

      return groups;

    }, {});

  };

  const deleteMovie = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_BASE}/api/movies/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) return;

    // remove from UI instantly
    setMovies(prev => prev.filter(m => m._id !== id));
    refreshWatchlistCount();
    fetchWatchlist();
  };


  const toggleWatched = async (movie) => {
    // 🔒 If already watched, do nothing
    if (movie.watched) return;

    const token = localStorage.getItem("token");
    // `http://localhost:5000/api/movies/${movie._id}/toggle`
    const res = await fetch(
      `${API_BASE}/api/movies/${movie._id}/toggle`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) return;

    const updated = await res.json();

    // 🎉 Popup message
    alert("Great! Marked as watched 🎉");

    // ✅ Update UI instantly
    setMovies(prev =>
      prev.map(m => (m._id === updated._id ? updated : m))
    );
    fetchWatchlist();
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to view your list");
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/api/movies`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredMovies =
    activeTab === "toWatch"
      ? movies.filter(movie => !movie.watched)
      : movies.filter(movie => movie.watched);


  const toWatchMovies = movies.filter(movie => !movie.watched);

  const watchedMovies = movies.filter(movie => movie.watched);

  const groupedToWatch = groupMoviesByDate(
    toWatchMovies,
    "created"
  );

  const groupedWatched = groupMoviesByDate(
    watchedMovies,
    "watched"
  );

  const getFriendlyDate = (dateString) => {

    const date = new Date(dateString);

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString())
      return "Today";

    if (date.toDateString() === yesterday.toDateString())
      return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="movie-loading">
        <div className="loader"></div>
        <h2>Loading List...</h2>
      </div>
    );
  }

  return (
    <div className="content-section">

      <div className="mylist-links">
        <span
          className={activeTab === "toWatch" ? "active-link" : ""}
          onClick={() => setActiveTab("toWatch")}
        >
          To Watch ({movies.filter(m => !m.watched).length})
        </span>

        <span
          className={activeTab === "watched" ? "active-link" : ""}
          onClick={() => setActiveTab("watched")}
        >
          Watched ({movies.filter(m => m.watched).length})
        </span>
      </div>

      {movies.length === 0 ? (
        <p>No movies added yet</p>
      ) : (
        <div >
          {
            Object.entries(
              activeTab === "toWatch"
                ? groupedToWatch
                : groupedWatched
            ).map(([date, movies]) => (

              <div key={date} className="date-group">

                <h2 className="date-heading">
                  {activeTab === "toWatch"
                    ? `Added on ${getFriendlyDate(date)}`
                    : `Watched on ${getFriendlyDate(date)}`}
                </h2>

                <div className="movies-grid">

                  {movies.map(movie => (

                    <div key={movie._id} className="movie-card">

                      <div className="movie-details">

                        <img
                          src={
                            movie.posterPath
                              ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                              : "https://via.placeholder.com/300x450?text=No+Image"
                          }
                          alt={movie.title}
                        />

                        <div className="movie-actions">

                          <button
                            className={`add-btn ${movie.watched ? "watched" : ""}`}
                            onClick={() => toggleWatched(movie)}
                            disabled={movie.watched}
                          >
                            ✔
                          </button>

                          {!movie.watched && (

                            <button
                              className="delete-btn"
                              onClick={() => deleteMovie(movie._id)}
                            >
                              ✕
                            </button>

                          )}

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            ))
          }
        </div>
      )}

    </div>
  );
};

export default MyList;
