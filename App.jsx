import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Hero from "./components/Home";
import MyList from "./components/MyList";
import Login from "./components/Login";
import Footer from "./components/Footer";


const App = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [watchlistCount, setWatchlistCount] = useState(0);

  // fetch count from backend
 const fetchWatchlistCount = async () => {
  
    const token = localStorage.getItem("token");
    if (!token) {
      setWatchlistCount(0);
      return;
    }
  try {
    const res = await fetch("http://localhost:5000/api/movies", {
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
      <Navbar watchlistCount={watchlistCount} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<Hero 
        searchQuery={searchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        refreshWatchlistCount={fetchWatchlistCount}/>} />
        <Route path="/my-list" element={<MyList refreshWatchlistCount={fetchWatchlistCount}  />} />
        <Route path="/login" element={<Login  onLogin={fetchWatchlistCount}/>} />

      </Routes>
        <Footer />
    </BrowserRouter>
  );
};

export default App;
