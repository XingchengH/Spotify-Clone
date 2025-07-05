import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-dark text-white p-3 d-flex align-items-center justify-content-between">
      <h1 className="m-0">Admin Dashboard</h1>
      <nav>
        <ul className="list-unstyled d-flex gap-3 m-0">
          <Link to="/">Main</Link>
        </ul>
      </nav>
    </header>
  );
}