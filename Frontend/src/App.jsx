import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Hero from "./components/Home";
import MyList from "./components/MyList";
import Login from "./components/Login";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
const API_BASE = import.meta.env.VITE_API_BASE_URL;


const App = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [watchlistCount, setWatchlistCount] = useState(0);

  // fetch count from backend
  const fetchWatchlistCount = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      setWatchlistCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setWatchlistCount(data.length);
    } catch (err) {
      console.error(err);
    }
  };


  // load count on app start
  useEffect(() => {
    fetchWatchlistCount();
  }, []);

  return (
    <BrowserRouter>
      <Navbar watchlistCount={watchlistCount} />
      <Routes>
        <Route path="/" element={<Hero
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          refreshWatchlistCount={fetchWatchlistCount} />} />
        <Route path="/my-list" element={<MyList refreshWatchlistCount={fetchWatchlistCount} />} />
        <Route path="/login" element={<Login onLogin={fetchWatchlistCount} />} />

      </Routes>

      <Routes>
        <Route
          path="/movie/:id"
          element={<MovieDetails  refreshWatchlistCount={fetchWatchlistCount}/>}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
