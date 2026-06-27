import { useNavigate } from "react-router-dom";

const HeroSlider = ({ currentMovie, fade }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const backgroundImage = currentMovie?.backdropPath
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdropPath}`
    : `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80`;

  return (
    <section className="hero-slider">

      {/* Background */}
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      />

      {/* Dark Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className={`hero-info ${fade ? "content-show" : "content-hide"}`}>

        {token && currentMovie ? (
          <>
            <span className="hero-subtitle">
              Continue Watching
            </span>

            <h1>{currentMovie.title}</h1>

            <div className="hero-rating">
                IMDB {currentMovie.rating.toFixed(1)}
            </div>

            <p>{currentMovie.overview}</p>

            <button
              className="primary-btn"
              onClick={() => navigate("/my-list")}
            >
              Continue →
            </button>
          </>
        ) : (
          <>
            <h1>There are total 3,51,89,546+ Movies</h1>

            <h2>How many did You Watch?</h2>

            <p>
              Track your favorites.
              Organize your binge-watching.
              All in one place.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Get Started →
            </button>
          </>
        )}

      </div>

    </section>
  );
};

export default HeroSlider;