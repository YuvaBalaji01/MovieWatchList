import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
import MovieGrid from "./MovieGrid";

const MyList = ({ refreshWatchlistCount }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("toWatch");

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

  if (loading) return <h2>Loading your list...</h2>;

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
        <div className="movies-grid">
          {filteredMovies.map(movie => (
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
                    {movie.watched ? "✔" : "👁️"}
                  </button>

                  {!movie.watched && (
                    <button
                      className="delete-btn "
                      onClick={() => deleteMovie(movie._id)}
                    >
                      x
                    </button>
                  )}


                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyList;
