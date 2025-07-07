import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-dark text-white d-flex align-items-center justify-content-between mx-0 px-3 py-2 border-bottom">
      <h1 className="m-0">Admin Dashboard</h1>
      <nav>
        <ul className="list-unstyled d-flex gap-3 m-0 ">
          <button className="btn btn-dark">
            <Link to="/" className="text-white text-decoration-none fw-bold ">
              Main
            </Link>
          </button>
        </ul>
      </nav>
    </header>
  );
}
