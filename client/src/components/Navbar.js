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
    <nav>
      <ul>
        {/* now create a link to the Home */}
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/tournaments/type">Tournaments</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/teams">Teams</Link>
        </li>
        <li>
          <Link to="/games">Games</Link> /{" "}
          <Link to="/games/create">Create</Link>
        </li>
        <li>
          <Link to="/venues">Venues</Link> /{" "}
          <Link to="/venues/create">Create</Link>
        </li>
        <li>
          <Link to="/payments">Payments</Link>
        </li>
      </ul>
      {!user && (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
      {user && (
        <div>
          {/* add user email here beside the logout button */}
          <span>{user.email}</span>
          <button onClick={handleClick}>Logout</button>
        </div>
      )}
    </nav>
  );
}

// export Navbar
export default Navbar;
