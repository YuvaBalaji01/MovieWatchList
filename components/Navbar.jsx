import { Link,useLocation } from "react-router-dom";

const Navbar = ({ watchlistCount, setSearchQuery }) => {
  
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isMyListPage = location.pathname === "/my-list";

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Cine<span>Stack</span>
        </Link>
      </div>

      <div className="nav-items">
        <ul className="nav-links">
          <li>
            <Link to="/">Explore</Link>
          </li>

          <li className="watchlist-link">
            <Link to="/my-list" style={{ textDecoration: "none", color: "inherit" }}>
              My List <span className="badge">{watchlistCount}</span>
            </Link>
          </li>

          {/* 🔐 LOGIN / LOGOUT */}
          {token ? (
            <li
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{ cursor: "pointer" }}
            >
              Logout
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>

        {!isMyListPage && (
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
