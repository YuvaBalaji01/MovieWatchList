import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/w500";

const MovieDetails = ({ refreshWatchlistCount, watchlistIds }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant" // or "smooth"
        });
    }, []);

    useEffect(() => {

        const fetchEverything = async () => {

            try {

                const [
                    movieRes,
                    videoRes,
                    castRes,
                    similarRes,
                    reviewRes,
                    providerRes
                ] = await Promise.all([

                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
                    ),

                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
                    ),

                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
                    ),

                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
                    ),

                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}`
                    ),

                    fetch(
                        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
                    )

                ]);

                const [
                    movieData,
                    videoData,
                    castData,
                    similarData,
                    reviewData,
                    providerData

                ] = await Promise.all([

                    movieRes.json(),
                    videoRes.json(),
                    castRes.json(),
                    similarRes.json(),
                    reviewRes.json(),
                    providerRes.json()

                ]);

                setMovie(movieData);

                const trailerVideo = videoData.results.find(
                    video =>
                        video.site === "YouTube" &&
                        video.type === "Trailer"
                );

                setTrailer(trailerVideo || null);

                setCast(castData.cast.slice(0, 12));

                setSimilarMovies(similarData.results.slice(0, 12));

                setReviews(reviewData.results.slice(0, 5));

                setProviders(providerData.results?.IN || null);

            } catch (err) {

                console.error(err);

            }

        };

        fetchEverything();

    }, [id]);

    // ➕ Add to backend
    const handleAddToList = async (movie, source) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        const providerRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
        );

        const providerData = await providerRes.json();

        const india = providerData.results?.IN;

        let providerName = null;
        let providerLogo = null;
        let providerId = null;

        if (india?.flatrate?.length) {
            providerName = india.flatrate[0].provider_name;
            providerLogo = india.flatrate[0].logo_path;
            providerId = india.flatrate[0].provider_id;
        }

        const res = await fetch(`${API_BASE}/api/movies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                tmdbId: movie.id,
                title: movie.title,
                rating: movie.vote_average || 0,
                watched: false,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                overview: movie.overview,
                releaseDate: movie.release_date,
                providerName,
                providerLogo,
                providerId
            })
        });

        if (!res.ok) return;

        refreshWatchlistCount();
        await fetchWatchlist();

    };

   

    if (!movie) {
        return (
            <div className="movie-loading">
                <div className="loader"></div>
                <h2>Loading Movie...</h2>
            </div>
        );
    }

     const inlist = watchlistIds.has(movie.id);

    return (

        <div className="movie-page">

            {/* ── HERO ── */}
            <div className="back-btn" onClick={() => navigate(`/`)}> X </div>

            <div
                className="movie-hero"
                style={{
                    backgroundImage:
                        `url(${IMAGE}${movie.backdrop_path})`
                }}
            >
                 


                <div className="movie-hero-inner">

                    {/* POSTER */}
                    <div className="movie-left">

                        <img
                            src={`${POSTER}${movie.poster_path}`}
                            alt={movie.title}
                        />

                        <div className="movie-rating-badge">
                            <span className="badge-num">
                                {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="badge-lbl">IMDb</span>
                        </div>

                    </div>

                    

                    {/* TEXT */}
                    <div className="movie-right">

                       
                        {/* Eyebrow */}
                        <div className="movie-eyebrow">
                            <span className="movie-eyebrow-tag">
                                {movie.genres?.[0]?.name ?? "Film"}
                            </span>
                            <span className="movie-eyebrow-year">
                                {movie.release_date?.slice(0, 4)}
                            </span>
                            

                        </div>

                        {/* Title */}
                        <h1>{movie.title}</h1>

                        {/* Meta row */}
                        <div className="movie-meta">
                            <span className="movie-meta-item is-rating">
                                ★ {movie.vote_average.toFixed(1)}
                            </span>
                            <span className="movie-meta-item">
                                {movie.release_date}
                            </span>
                            <span className="movie-meta-item">
                                {movie.runtime} mins
                            </span>
                        </div>

                        {/* Genres */}
                        <div className="movie-genres">
                            {movie.genres.map(g =>
                                <span key={g.id}>{g.name}</span>
                            )}
                        </div>

                        {/* Overview */}
                        <p className="movie-overview">
                            {movie.overview}
                        </p>

                        {/* CTA */}
                        <div className="movie-actions">
                            <button
                                className="btn-add-list"
                                onClick={() => { handleAddToList(movie) }}
                            >
                                {inlist? "✔ Added" : "+ Add To List" }
                            </button>
                        </div>

                    </div>

                </div>

            </div>

            {/* ── BELOW FOLD ── */}
            <div className="movie-sections">

                {/* STREAMING */}
                <div className="streaming-section">

                    <div className="section-heading">
                        <h2>Available On</h2>
                    </div>

                    {
                        providers?.flatrate?.length ? (

                            <div className="provider-list">

                                {providers.flatrate.map(provider => (

                                    <div
                                        key={provider.provider_id}
                                        className="provider-card"
                                    >

                                        <img
                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                            alt={provider.provider_name}
                                        />

                                        <p>{provider.provider_name}</p>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <p className="provider-none">
                                Currently unavailable for streaming in India.
                            </p>

                        )
                    }

                </div>

                {/* TRAILER */}
                {trailer && (

                    <div className="trailer-section">

                        <div className="section-heading">
                            <h2>Official Trailer</h2>
                        </div>

                        <div className="trailer-player">

                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title="Trailer"
                                allowFullScreen
                            />

                        </div>

                    </div>

                )}

                {/* CAST */}
                {cast.length > 0 && (

                    <div className="cast-section">

                        <div className="section-heading">
                            <h2>Top Cast</h2>
                        </div>

                        <div className="cast-grid">

                            {cast.map(person => (

                                <div key={person.id} className="cast-card">

                                    <img
                                        src={
                                            person.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                                : null
                                        }
                                        alt={person.name}
                                        onError={e => { e.target.style.display = "none"; }}
                                    />

                                    <div className="cast-info">
                                        <p className="cast-name">{person.name}</p>
                                        <p className="cast-character">{person.character}</p>
                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

};

export default MovieDetails;