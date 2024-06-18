import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

// Create a Navbar function
function Navbar() {
  // Call for the logout function
  const { logout } = useLogout();
  // Call for the user context from useAuthContext to show the email of the user if logged in
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <nav>
      <ul>
        {/* Create a link to the Home */}
        <li>
          <Link to="/">Home</Link>
        </li>
        {user && (
          <>
            <li>
              <Link to="/tournaments/type">Tournaments</Link>
            </li>
            <li>
              <Link to="/users/view">Users</Link>
            </li>
            <li>
              <Link to="/teams">Teams</Link>
            </li>
            <li>
              <Link to="/games/view">Games</Link>
            </li>
            <li>
              <Link to="/venues/view">Venues</Link>
            </li>
            <li>
              <Link to="/payments">Payments</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      {!user ? (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      ) : (
        <div>
          {/* Add user email here beside the logout button */}
          <span>{user.email}</span>
          <button onClick={handleClick}>Logout</button>
        </div>
      )}
    </nav>
  );
}

// Export Navbar
export default Navbar;
