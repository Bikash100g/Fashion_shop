
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar">
      <h1>Fashion Shop</h1>
      <div className="nav-links">
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <NavLink to="/add" className={linkClass}>Add</NavLink>
        <NavLink to="/update" className={linkClass}>Update</NavLink>
        <NavLink to="/delete" className={linkClass}>Delete</NavLink>
        <NavLink to="/season-totals" className={linkClass}>Season Totals</NavLink>
        <NavLink to="/units-sold" className={linkClass}>Units &gt; Threshold</NavLink>
        <NavLink to="/avg-rating" className={linkClass}>Avg Rating (Season)</NavLink>
      </div>
    </nav>
  );
}
