import { Link,useLocation } from "react-router-dom";

const Navbar = ({ watchlistCount, setSearchQuery }) => {
  
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isMyListPage = location.pathname === "/my-list";
  const isLoginPage = location.pathname === "/login";

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
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>Explore</Link>
          </li>

          <li className="watchlist-link">
            <Link to="/my-list" style={{ textDecoration: "none", color: "inherit" }}>
            My List 
            { watchlistCount > 0 &&(
              <span className="badge">{watchlistCount}</span>
            )}
            </Link>
          </li>

          {/* 🔐 LOGIN / LOGOUT */}
          
          {!isLoginPage && (
             token ? (
              <li
               onClick={() => {
                  const isConfirmed = window.confirm("Are you sure you want to log out?");

                  if (isConfirmed) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                Logout
              </li>
            ) : (
              <li>
                <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>Login</Link>
              </li>
            )
          )}

        </ul>
          
       

        
      </div>
    </nav>
  );
};

export default Navbar;
