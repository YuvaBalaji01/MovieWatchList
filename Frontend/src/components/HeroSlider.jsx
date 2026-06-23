import { useNavigate } from "react-router-dom";

const HeroSlider = ({ currentMovie }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div
      className="hero-content"
      style={
        currentMovie?.backdropPath
          ? {
              backgroundImage: `
              linear-gradient(rgba(10,10,20,.75),rgba(10,10,20,.75)),
              url(https://image.tmdb.org/t/p/original${currentMovie.backdropPath})
            `
            }
          : {
            backgroundImage: `
              linear-gradient(rgba(10,10,20,.75),rgba(10,10,20,.75)),
              url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80")
            `
          }
      }
    >
      {token && currentMovie ? (
        <>

          <h1>{currentMovie.title}</h1>

          <h5>
            IMDB  {currentMovie.rating.toFixed(1)}
          </h5>

          <p>{currentMovie.overview}</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/my-list")}
          >
            To Watch
          </button>
        </>
      ) : (
        <>
          <h1>There are total 3,51,89,546+ Movies</h1>

          <h1>How many did You Watch?</h1>

          <p>
            Track your favorites. Organize your binge-watching.
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
  );
};

export default HeroSlider;