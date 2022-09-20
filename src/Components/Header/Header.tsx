import { Link } from "react-router-dom";

export function Header() {
  return (
    <nav className="navbar my-3" role='navigation' aria-label="main navigation">
      <div className="navbar-brand">
        <Link to='/'>
          <h1 className="title">Deae</h1>
        </Link>
      </div>
    </nav>
  )
}