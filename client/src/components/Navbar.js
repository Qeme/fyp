import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

// create a Navbar function
function Navbar() {
  // call for the logout function
  const { logout } = useLogout();
  // call for the user context from useAuthContext to show the email of the user if he has logged in
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <h1>ESMS</h1>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <div className="dropdown">
                <Link to="/tournaments/type" className="dropbtn">Tournaments</Link>
              </div>
            </li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li>
              <div className="dropdown">
                <Link to="/games/home" className="dropbtn">Games</Link>
                <div className="dropdown-content">
                </div>
              </div>
            </li>
            <li>
              <div className="dropdown">
                <Link to="/venues" className="dropbtn">Venues</Link>
                <div className="dropdown-content">
                  <Link to="/venues/create">Create</Link>
                </div>
              </div>
            </li>
            <li><Link to="/payments">Payments</Link></li>
          </ul>
          {!user && (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
          {user && (
            <div className="user-info">
              <span>{user.email}</span>
              <button onClick={handleClick}>Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

// export Navbar
export default Navbar;
