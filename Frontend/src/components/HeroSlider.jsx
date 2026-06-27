import { useNavigate } from "react-router-dom";

const HeroSlider = ({ currentMovie, fade }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const today = new Date();

  const released =
    currentMovie &&
    new Date(currentMovie.releaseDate) <= today;

  const formattedDate = currentMovie
    ? new Date(currentMovie.releaseDate).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    )
    : "";

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
              <span>⭐ {currentMovie.rating.toFixed(1)}</span>

              <span>•</span>

              <span>{formattedDate.split(" ").pop()}</span>
            </div>

            <p>{currentMovie.overview}</p>

            {released && currentMovie.providerName ? (

              <div className="provider">

                <p>Available on</p>

                <div className="provider-info">

                  <img
                    src={`https://image.tmdb.org/t/p/original${currentMovie.providerLogo}`}
                  />

                  

                </div>

              </div>

            ) : (

              <div className="provider">

                <p>🎬 In theatres from</p>

                <strong>{formattedDate}</strong>

              </div>

            )}
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