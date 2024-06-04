import { Link } from "react-router-dom"

// create a Navbar function
function Navbar() {
    return (
    <nav>
        <ul>
            {/* now create a link to the Home */}
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tournaments">Tournaments</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/venues">Venues</Link></li>
            <li><Link to="/payments">Payments</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
    </nav>
    )
}

// export Navbar
export default Navbar